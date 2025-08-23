import type { Quest, QuestRequirement, SkillRequirement } from '../types';

export interface RequirementStatus {
    met: boolean;
    skillsMet: boolean;
    questsMet: boolean;
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'COMPLETE':
            return 'green';
        case 'IN_PROGRESS':
            return 'yellow';
        case 'NOT_STARTED':
            return 'gray';
        default:
            return 'blue';
    }
};

export const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
        case 1: return 'green';    // Novice
        case 2: return 'blue';     // Intermediate
        case 3: return 'yellow';   // Experienced
        case 4: return 'orange';   // Master
        case 5: return 'red';      // Grandmaster
        default: return 'gray';
    }
};

export const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
        case 1: return 'Novice';
        case 2: return 'Intermediate';
        case 3: return 'Experienced';
        case 4: return 'Master';
        case 5: return 'Grandmaster';
        default: return 'Unknown';
    }
};

export const checkRequirementsMet = (
    quest: Quest, 
    quests: Quest[], 
    playerLevels?: Record<string, number>,
    requirements?: QuestRequirement
): RequirementStatus => {
    // If quest not found in requirements, use empty requirements
    const questReqs: QuestRequirement = requirements || { 
        name: quest.name,
        skills: [],
        questPrerequisites: []
    };

    // Check skill requirements
    const skillsMet = questReqs.skills.length === 0 ? true :
        questReqs.skills.every((req: SkillRequirement) => 
            (playerLevels?.[req.skill] ?? 1) >= req.level
        );

    // Check quest prerequisites
    const questsMet = questReqs.questPrerequisites.length === 0 ? true :
        questReqs.questPrerequisites.every((prereq: string) => 
            quests.find(q => q.name === prereq)?.status === 'COMPLETE'
        );

    return {
        met: skillsMet && questsMet,
        skillsMet,
        questsMet
    };
};
