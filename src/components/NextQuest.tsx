import { quests } from '../data/quests';

interface NextQuestProps {
    completedQuests: string[];
}

export const NextQuest = ({ completedQuests }: NextQuestProps) => {
    // Get first incomplete quest from our ordered list
    const nextQuest = quests.find(quest => !completedQuests.includes(quest.name));

    if (!nextQuest) {
        return <div>All quests completed!</div>;
    }

    return (
        <div>
            <h3>Next Quest: {nextQuest.name}</h3>
            {nextQuest.requirements && (
                <div>
                    <h4>Requirements:</h4>
                    {nextQuest.requirements.skills && (
                        <div>
                            <h5>Skills:</h5>
                            <ul>
                                {Object.entries(nextQuest.requirements.skills).map(([skill, level]) => (
                                    <li key={skill}>{skill}: Level {level}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {nextQuest.requirements.quests && (
                        <div>
                            <h5>Quests:</h5>
                            <ul>
                                {nextQuest.requirements.quests.map(quest => (
                                    <li key={quest}>{quest}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
