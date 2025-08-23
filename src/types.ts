export interface Quest {
    name: string;
    status: 'COMPLETE' | 'IN_PROGRESS' | 'NOT_STARTED';
}

export interface RequirementStatus {
    met: boolean;
    skillsMet: boolean;
    questsMet: boolean;
}

export interface SkillRequirement {
    skill: string;
    level: number;
}

export interface QuestRequirement {
    name: string;
    skills: SkillRequirement[];
    questPrerequisites: string[];
}
