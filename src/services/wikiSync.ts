import axios from 'axios';

const WIKI_SYNC_API = 'https://sync.runescape.wiki/runelite/player/';

interface QuestStatus {
    name: string;
    status: 'COMPLETE' | 'IN_PROGRESS' | 'NOT_STARTED';
}

export interface PlayerQuestData {
    quests: QuestStatus[];
    lastUpdated: string;
    levels: Record<string, number>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const PLAYER_CACHE_KEY = 'playerQuestDataCache';
const PLAYER_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days - longer cache for player data

interface PlayerCacheData {
    timestamp: number;
    username: string;
    data: PlayerQuestData;
}

// Get cached player data
function getCachedPlayerData(username: string): PlayerQuestData | null {
    const cached = localStorage.getItem(PLAYER_CACHE_KEY);
    if (!cached) return null;

    try {
        const cacheData: Record<string, PlayerCacheData> = JSON.parse(cached);
        const userData = cacheData[username.toLowerCase()];
        
        if (!userData) return null;

        const now = Date.now();
        if (now - userData.timestamp > PLAYER_CACHE_DURATION) {
            // Remove expired cache entry
            delete cacheData[username.toLowerCase()];
            localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(cacheData));
            return null;
        }

        return userData.data;
    } catch {
        return null;
    }
}

// Cache player data
function cachePlayerData(username: string, data: PlayerQuestData) {
    try {
        const cached = localStorage.getItem(PLAYER_CACHE_KEY);
        const cacheData: Record<string, PlayerCacheData> = cached ? JSON.parse(cached) : {};
        
        // Clean up expired entries
        const now = Date.now();
        Object.keys(cacheData).forEach(key => {
            if (now - cacheData[key].timestamp > PLAYER_CACHE_DURATION) {
                delete cacheData[key];
            }
        });

        // Add new data
        cacheData[username.toLowerCase()] = {
            timestamp: now,
            username,
            data
        };

        localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Failed to cache player data:', error);
    }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchOptions {
    retryCount?: number;
    skipCache?: boolean;  // If true, bypass cache check
}

export const fetchPlayerQuests = async (username: string, options: FetchOptions = {}): Promise<PlayerQuestData> => {
    // Validate username
    if (!username || typeof username !== 'string') {
        throw new Error('Please enter a valid username');
    }

    // Clean the username - remove extra spaces and special characters
    const cleanUsername = username.trim();
    if (cleanUsername.length === 0) {
        throw new Error('Username cannot be empty');
    }

    const retryCount = options.retryCount || 0;
    const skipCache = options.skipCache || false;

    // Try to get cached data first (unless skipCache is true)
    if (!skipCache) {
        const cachedData = getCachedPlayerData(cleanUsername);
        if (cachedData) {
            // Return cached data but fetch fresh data in the background
            setTimeout(() => {
                fetchPlayerQuests(cleanUsername, { retryCount: MAX_RETRIES, skipCache: true }).then(freshData => {
                    if (freshData.lastUpdated !== cachedData.lastUpdated) {
                        // Only update cache and trigger event if data is newer
                        cachePlayerData(cleanUsername, freshData);
                        window.dispatchEvent(new CustomEvent('questDataUpdated', { 
                            detail: { username: cleanUsername, data: freshData } 
                        }));
                    }
                }).catch(console.error);
            }, 0);
            return cachedData;
        }
    }

    try {
        const response = await axios.get(`${WIKI_SYNC_API}${encodeURIComponent(cleanUsername)}/STANDARD`, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }

        // More detailed validation
        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        if (!response.data.quests) {
            if (response.data.timestamp) {
                throw new Error('No quest data found. Please log into RuneLite and try again in a few minutes.');
            } else {
                throw new Error('No quest data available. Please make sure you have logged in using RuneLite recently.');
            }
        }

        // Data transformation with validation
        const quests: QuestStatus[] = Object.entries(response.data.quests)
            .filter(([name]) => name) // Filter out any empty quest names
            .map(([name, status]) => ({
                name,
                status: status === 2 ? 'COMPLETE' as const : 
                        status === 1 ? 'IN_PROGRESS' as const : 
                        'NOT_STARTED' as const
            }));

        if (quests.length === 0) {
            throw new Error('No valid quest data found. Please check if the Wiki plugin is enabled in RuneLite.');
        }

        // Get levels with validation
        const levels = response.data.levels || {};
        
        if (Object.keys(levels).length === 0) {
            console.warn('No skill levels found in the response. This might indicate incomplete data sync.');
        }

        const playerData = {
            quests,
            lastUpdated: response.data.timestamp,
            levels
        };

        // Cache the successful response
        cachePlayerData(cleanUsername, playerData);

        return playerData;
    } catch (error: any) {
        console.error('Error fetching quest data:', {
            error,
            username: cleanUsername,
            attempt: retryCount + 1,
            status: error.response?.status,
            data: error.response?.data
        });

        // Handle specific error cases
        if (error.response?.status === 400) {
            if (error.response?.data?.code === 'NO_USER_DATA') {
                throw new Error(`No data found for "${cleanUsername}". Please make sure:\n1. You have logged into RuneLite recently\n2. The Wiki plugin is enabled in RuneLite\n3. You have waited a few minutes for your data to sync`);
            }
            throw new Error(`Invalid request. Please check the username and try again.`);
        }

        if (error.response?.status === 404) {
            throw new Error(`Player "${cleanUsername}" not found. Please note:\n1. The username is case-sensitive\n2. Make sure you've synced your data using RuneLite\n3. The Wiki plugin must be enabled in RuneLite\n4. You must have logged in recently while using RuneLite`);
        }

        if (error.response?.status === 500) {
            const serverError = error.response?.data?.error || 'Internal server error';
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying after server error (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
                await sleep(RETRY_DELAY * (retryCount + 1));
                return fetchPlayerQuests(cleanUsername, { retryCount: retryCount + 1 });
            }
            throw new Error(`Server error: ${serverError}. Please try again later.`);
        }
        
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying after timeout (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
                await sleep(RETRY_DELAY * (retryCount + 1));
                return fetchPlayerQuests(cleanUsername, { retryCount: retryCount + 1 });
            }
            const cachedData = getCachedPlayerData(cleanUsername);
            if (cachedData) {
                const lastUpdateTime = new Date(cachedData.lastUpdated).toLocaleString();
                console.warn(`Using cached data from ${lastUpdateTime} due to timeout`);
                return {
                    ...cachedData,
                    lastUpdated: `${cachedData.lastUpdated} (Cached - Server Timeout)`
                };
            }
            throw new Error('Request timed out. The server might be experiencing high load. Please try again.');
        }

        if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
            const cachedData = getCachedPlayerData(cleanUsername);
            if (cachedData) {
                const lastUpdateTime = new Date(cachedData.lastUpdated).toLocaleString();
                console.warn(`Using cached data from ${lastUpdateTime} due to network error`);
                return {
                    ...cachedData,
                    lastUpdated: `${cachedData.lastUpdated} (Cached - Network Error)`
                };
            }
            throw new Error('Network error. Please check your internet connection and try again.');
        }

        if (error.response?.data?.error === 'Cannot query data for this world type.') {
            throw new Error('Please make sure you are using RuneLite on a regular OSRS world (not beta/private server).');
        }

        if (error.response?.status === 429) {
            throw new Error('Too many requests. Please wait a minute before trying again.');
        }

        // If we've tried MAX_RETRIES times and still failed, check for cached data
        if (retryCount >= MAX_RETRIES) {
            const cachedData = getCachedPlayerData(cleanUsername);
            if (cachedData) {
                const lastUpdateTime = new Date(cachedData.lastUpdated).toLocaleString();
                console.warn(`Using cached data from ${lastUpdateTime} due to API failure`);
                return {
                    ...cachedData,
                    lastUpdated: `${cachedData.lastUpdated} (Cached)`
                };
            }
            throw new Error('Unable to fetch quest data after multiple attempts. Please try again later.');
        }

        // For any other error, retry if we haven't hit the limit
        console.log(`Retrying after error (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return fetchPlayerQuests(cleanUsername, { retryCount: retryCount + 1 });
    }
};
