/**
 * Mini quests and activities that cannot be tracked via RuneLite Wiki plugin
 * These should be filtered out or marked as "always available" since their 
 * completion status cannot be reliably determined from the API
 */

export const MINI_QUESTS = [
    // Museum miniquests
    "Natural History Quiz",
    "Children of the Sun", // Fort Forinthry miniquest
    
    // Other miniquests that don't track completion
    "Daddy's Home", // Fort Forinthry miniquest
    "Alfred Grimhand's Barcrawl", // Barbarian miniquest
    "A Soul's Bane", // Miniquest in Tolna's rift
    "Lair of Tarn Razorlor", // Miniquest in Haunted Mine
    "Curse of the Empty Lord", // Miniquest
    "The General's Shadow", // Miniquest
    "Knight Waves Training Grounds", // Training activity/miniquest
    
    // Add more as needed
];

/**
 * Check if a quest is a mini quest that can't be tracked
 */
export function isMiniQuest(questName: string): boolean {
    return MINI_QUESTS.includes(questName);
}

/**
 * Filter out mini quests from a quest list
 */
export function filterOutMiniQuests<T extends { name: string }>(quests: T[]): T[] {
    return quests.filter(quest => !isMiniQuest(quest.name));
}
