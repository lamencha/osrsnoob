import axios from 'axios';
import type { QuestRequirement, SkillRequirement } from '../types';
import { questRequirements as fallbackRequirements } from '../data/questRequirements';

const WIKI_API_URL = 'https://oldschool.runescape.wiki/api.php';


/**
 * Parse the quest requirements from the wiki page content
 */
function parseQuestRequirements(content: string): {
    skills: SkillRequirement[];
    questPrerequisites: string[];
} {
    const requirements = {
        skills: [] as SkillRequirement[],
        questPrerequisites: [] as string[]
    };

    // Regular expressions for matching requirements
    const skillPatterns = [
        /(\d+)\s+([A-Za-z]+)(?:\s+(?:level|Level))?/g,  // "50 Firemaking" or "50 Firemaking level"
        /([A-Za-z]+)\s+(?:level|Level)\s+(\d+)/g,       // "Firemaking level 50"
        /level\s+(\d+)\s+([A-Za-z]+)/gi                 // "level 50 Firemaking"
    ];

    // Extract skill requirements
    for (const regex of skillPatterns) {
        const skillMatches = content.matchAll(regex);
        for (const match of skillMatches) {
            const [_, numOrSkill, skillOrNum] = match;
            // Check which group is the number and which is the skill
            const level = parseInt(numOrSkill) || parseInt(skillOrNum);
            const skill = isNaN(parseInt(numOrSkill)) ? numOrSkill : skillOrNum;
            
            if (!isNaN(level) && skill) {
                // Normalize skill name
                const normalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
                // Only add if we don't already have this skill or if the level is higher
                const existingSkill = requirements.skills.find(s => s.skill === normalizedSkill);
                if (!existingSkill || existingSkill.level < level) {
                    if (existingSkill) {
                        existingSkill.level = level;
                    } else {
                        requirements.skills.push({ skill: normalizedSkill, level });
                    }
                }
            }
        }
    }

    // Various patterns for quest prerequisites
    const questPatterns = [
        /(?:Completion of|Started|Complete).*?:\s*(?:\*\s*(.+?)(?=\n|$))+/g,
        /Required quests?:\s*(?:\*\s*(.+?)(?=\n|$))+/g,
        /following quests?.*?:\s*(?:\*\s*(.+?)(?=\n|$))+/g
    ];

    // Extract quest prerequisites
    const foundQuests = new Set<string>();
    for (const regex of questPatterns) {
        const questMatches = content.matchAll(regex);
        for (const match of questMatches) {
            const questList = match[0]
                .split('\n')
                .filter(line => line.trim().startsWith('*'))
                .map(line => line.trim().replace(/^\*\s*/, '').replace(/\s*\([^)]*\)/g, ''));
            
            for (const quest of questList) {
                if (quest && !foundQuests.has(quest)) {
                    foundQuests.add(quest);
                    requirements.questPrerequisites.push(quest);
                }
            }
        }
    }

    return requirements;
}

/**
 * Fetch quest data from the OSRS Wiki API
 */
const QUEST_FETCH_RETRIES = 3;
const QUEST_FETCH_DELAY = 1000; // 1 second

export async function fetchQuestData(questName: string, retryCount = 0): Promise<QuestRequirement> {
    try {
        // First, try to get the page info to find the right section ID
        const infoResponse = await axios.get(WIKI_API_URL, {
            params: {
                action: 'parse',
                page: questName,
                format: 'json',
                prop: 'sections',
                origin: '*'
            },
            timeout: 10000 // 10 second timeout
        });

        // Find the Requirements section
        const sections = infoResponse.data?.parse?.sections || [];
        const requirementsSection = sections.find((section: { line: string; index: string }) => {
            const sectionTitle = section.line.toLowerCase();
            return sectionTitle.includes('requirement') || 
                   sectionTitle === 'requirements' || 
                   sectionTitle === 'prereq';
        });
        
        if (!requirementsSection) {
            console.warn(`No requirements section found for quest: ${questName}`);
            return {
                name: questName,
                skills: [],
                questPrerequisites: []
            };
        }

        // Now fetch the actual requirements content
        const response = await axios.get(WIKI_API_URL, {
            params: {
                action: 'parse',
                page: questName,
                format: 'json',
                prop: 'text',
                section: requirementsSection.index,
                origin: '*'
            },
            timeout: 10000
        });

        // Check if we have a valid parse result
        if (!response.data?.parse?.text?.['*']) {
            console.warn(`No content found in requirements section for quest: ${questName}`);
            return {
                name: questName,
                skills: [],
                questPrerequisites: []
            };
        }

        const content = response.data.parse.text['*'];

        const requirements = parseQuestRequirements(content);

        return {
            name: questName,
            ...requirements
        };
    } catch (error: any) {
        // Only log actual errors, not expected timeout/network issues
        if (!error.code?.includes('ECONNABORTED') && 
            !error.message?.includes('timeout') && 
            !error.message?.includes('network')) {
            console.error(`Error fetching quest data for ${questName}:`, error);
        }

        // If we haven't reached max retries, try again
        if (retryCount < QUEST_FETCH_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, QUEST_FETCH_DELAY * (retryCount + 1)));
            return fetchQuestData(questName, retryCount + 1);
        }

        // Get from cache if available
        const { requirements: cachedReqs } = getCachedRequirements();
        if (cachedReqs?.[questName]) {
            return cachedReqs[questName];
        }

        // If network error or timeout, return empty requirements
        if (error.code === 'ECONNABORTED' || 
            error.message?.includes('timeout') || 
            error.message?.includes('network') || 
            error.response?.status === 404) {
            return {
                name: questName,
                skills: [],
                questPrerequisites: []
            };
        }

        // Return empty requirements as last resort
        return {
            name: questName,
            skills: [],
            questPrerequisites: []
        };
    }
}

/**
 * Cache quest data in localStorage to avoid too many API requests
 */
const CACHE_KEY = 'questRequirementsCache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days - increased from 24 hours
const STALE_AFTER = 24 * 60 * 60 * 1000; // Consider data stale after 24 hours

interface CachedData {
    timestamp: number;
    requirements: Record<string, QuestRequirement>;
    version: number; // For future cache invalidation if quest requirements format changes
}

/**
 * Get cached quest requirements
 */
function getCachedRequirements(): { requirements: Record<string, QuestRequirement> | null, isStale: boolean } {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { requirements: null, isStale: true };

    try {
        const data: CachedData = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - data.timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return { requirements: null, isStale: true };
        }

        // Check if cache is stale (needs refresh but still usable)
        const isStale = now - data.timestamp > STALE_AFTER;

        return { 
            requirements: data.requirements,
            isStale 
        };
    } catch (error) {
        console.error('Error reading cache:', error);
        localStorage.removeItem(CACHE_KEY);
        return { requirements: null, isStale: true };
    }
}

/**
 * Cache quest requirements
 */
function cacheRequirements(requirements: Record<string, QuestRequirement>) {
    const data: CachedData = {
        timestamp: Date.now(),
        requirements,
        version: 1 // Initial version
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

/**
 * Initialize quest requirements from the wiki
 */
export async function initializeQuestRequirements(): Promise<Record<string, QuestRequirement>> {
    // Try to get cached data first
    const { requirements: cached, isStale } = getCachedRequirements();
    
    // If we have valid cached data
    if (cached) {
        // If data is stale, fetch new data in the background silently
        if (isStale) {
            setTimeout(async () => {
                try {
                    const requirements: Record<string, QuestRequirement> = {};
                    await Promise.all(quests.map(async questName => {
                        requirements[questName] = await fetchQuestData(questName);
                    }));
                    cacheRequirements(requirements);
                } catch (error) {
                    // Silently fail background updates
                }
            }, 0);
        }
        // Always merge cached data with fallback requirements (fallback takes precedence)
        return { ...cached, ...fallbackRequirements };
    }

    // List of all OSRS quests (we can fetch this from the wiki too, but for now let's hardcode the F2P ones)
    const quests = [
        "Black Knights' Fortress",
        "Cook's Assistant",
        "Demon Slayer",
        "Doric's Quest",
        "Dragon Slayer I",
        "Ernest the Chicken",
        "Goblin Diplomacy",
        "Imp Catcher",
        "The Knight's Sword",
        "Misthalin Mystery",
        "Pirates' Treasure",
        "Prince Ali Rescue",
        "The Restless Ghost",
        "Romeo & Juliet",
        "Rune Mysteries",
        "Sheep Shearer",
        "Shield of Arrav",
        "Vampire Slayer",
        "Witch's Potion",
        "X Marks the Spot"
    ];

    let requirements: Record<string, QuestRequirement> = {};
    
    try {
        // Fetch requirements for each quest
        const results = await Promise.allSettled(quests.map(async questName => {
            try {
                requirements[questName] = await fetchQuestData(questName);
                return true;
            } catch (error) {
                console.error(`Failed to fetch requirements for ${questName}:`, error);
                return false;
            }
        }));

        // Log statistics about successful/failed fetches
        const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
        if (successCount < quests.length) {
            console.log(`Fetched ${successCount}/${quests.length} quest requirements successfully`);
        }

        // Only cache if we got at least some data
        if (Object.keys(requirements).length > 0) {
            cacheRequirements(requirements);
        }

        // Merge with fallback requirements (fallback takes precedence)
        const mergedRequirements = { ...requirements, ...fallbackRequirements };
        return mergedRequirements;
    } catch (error) {
        // Only log if it's a non-network error
        if (!(error as any).code?.includes('ECONNABORTED') && 
            !(error as any).message?.includes('timeout')) {
            console.error('Error fetching quest requirements:', error);
        }
        
        // Try to get requirements from cache
        const { requirements: cachedReqs } = getCachedRequirements();
        if (cachedReqs) {
            return { ...cachedReqs, ...fallbackRequirements };
        }
        
        // Return fallback requirements if all else fails
        return fallbackRequirements;
    }

    return requirements;
}
