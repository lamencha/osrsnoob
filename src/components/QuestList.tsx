import { Box, Text } from '@mantine/core';
import { quests } from '../data/quests';
import type { Quest, QuestRequirement } from '../types';
import { QuestCard } from './QuestCard';

interface QuestListProps {
    quests: Quest[];
    playerLevels?: Record<string, number>;
    questRequirements: Record<string, QuestRequirement>;
}

export function QuestList({ quests: playerQuests, playerLevels, questRequirements }: QuestListProps) {
    // Find the first quest from our ordered quest list that the player hasn't completed
    const nextQuest = quests.find(orderedQuest => {
        // Find the corresponding quest in the player's quest list
        const playerQuest = playerQuests.find(pq => pq.name === orderedQuest.name);
        
        // If the player doesn't have this quest in their list, or it's not completed, show it
        return !playerQuest || playerQuest.status !== 'COMPLETE';
    });

    if (!nextQuest) {
        return (
            <Box className="quest-list">
                <Box ta="center" mb="lg">
                    <Text size="lg" c="green">
                        All tracked quests completed!
                    </Text>
                </Box>
            </Box>
        );
    }

    // Find the player's quest data for this next quest (if it exists)
    const playerQuestData = playerQuests.find(pq => pq.name === nextQuest.name) || {
        name: nextQuest.name,
        status: 'NOT_STARTED' as const
    };

    return (
        <Box className="quest-list">
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <QuestCard
                    key={nextQuest.name}
                    quest={playerQuestData}
                    playerLevels={playerLevels}
                    quests={playerQuests}
                    questRequirements={questRequirements[nextQuest.name]}
                />
            </Box>
        </Box>
    );
}