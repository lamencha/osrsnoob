import { Paper, Text, Badge, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import type { Quest, QuestRequirement, SkillRequirement } from '../types';
import { getStatusColor, getDifficultyColor, getDifficultyLabel } from '../utils/questUtils';

// Animated Access Status Component
function AnimatedAccessStatus({ onAccessGranted }: { onAccessGranted?: () => void }) {
    const [showDenied, setShowDenied] = useState(true); // Start with denied
    const [isVisible, setIsVisible] = useState(true);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        let blinkCount = 0;
        const maxBlinks = 4; // Blink 4 times then stop
        
        const blinkInterval = setInterval(() => {
            if (blinkCount < maxBlinks && !animationComplete) {
                setIsVisible(false);
                setTimeout(() => {
                    setIsVisible(true);
                    blinkCount++;
                    
                    // After 2 blinks, switch to granted
                    if (blinkCount === 2) {
                        setShowDenied(false); // Switch to granted
                        // Notify parent after a short delay
                        setTimeout(() => {
                            if (onAccessGranted) {
                                onAccessGranted();
                            }
                        }, 800);
                    }
                    
                    // After all blinks, stop animation
                    if (blinkCount >= maxBlinks) {
                        setAnimationComplete(true);
                        clearInterval(blinkInterval);
                    }
                }, 400); // Slower blink - increased from 200 to 400
            }
        }, 1000); // Slower interval - increased from 600 to 1000

        return () => clearInterval(blinkInterval);
    }, []); // Remove onAccessGranted from dependencies to prevent re-runs

    const currentColor = showDenied ? '#ff0000' : '#00ff41'; // Red for denied, green for granted

    return (
        <Text 
            fw={700} 
            size="lg" 
            ta="center" 
            style={{
                fontFamily: "'Courier New', monospace",
                color: `${currentColor} !important`,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: `0 0 10px ${currentColor}`,
                opacity: isVisible ? 1 : 0.3,
                transition: 'opacity 0.3s ease, color 0.3s ease',
                // Force the color to override any parent styles
                backgroundColor: 'transparent'
            }}
            className={showDenied ? 'access-denied-text' : 'access-granted-text'}
        >
            {showDenied ? '⚠ ACCESS_DENIED ⚠' : '✓ ACCESS_GRANTED ✓'}
        </Text>
    );
}

// Delayed Requirements Display Component
function DelayedRequirementsDisplay({ 
    unmetSkills, 
    unmetQuests, 
    playerLevels, 
    show 
}: { 
    unmetSkills: any[], 
    unmetQuests: string[], 
    playerLevels?: Record<string, number>,
    show: boolean 
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500); // Half second delay
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <Box style={{ 
            opacity: isVisible ? 1 : 0, 
            transition: 'opacity 0.5s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-10px)'
        }}>
            {unmetSkills.length > 0 && (
                <Box mb="md">
                    <Text 
                        fw={600} 
                        size="sm" 
                        c="red"
                        style={{ 
                            fontFamily: "'Courier New', monospace",
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 0 5px currentColor'
                        }}
                    >
                        &gt;&gt; Missing Skill Requirements:
                    </Text>
                    {unmetSkills.map((req: any) => {
                        const currentLevel = playerLevels?.[req.skill] || 1;
                        const currentYear = new Date().getFullYear();
                        
                        const handleSkillClick = () => {
                            const searchQuery = `osrs level 99 ${req.skill.toLowerCase()} guide ${currentYear}`;
                            const youtubeUrl = `youtube://results?search_query=${encodeURIComponent(searchQuery)}`;
                            const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                            
                            // Create a hidden iframe to try the YouTube app
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = youtubeUrl;
                            document.body.appendChild(iframe);
                            
                            // Open web version in new tab as fallback
                            setTimeout(() => {
                                window.open(fallbackUrl, '_blank');
                                document.body.removeChild(iframe);
                            }, 500);
                        };

                        return (
                            <Box 
                                key={req.skill} 
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', // Stack items vertically
                                    alignItems: 'center', // Center everything
                                    gap: '4px', // Reduced from 8px to bring title closer to stats
                                    width: '100%', // Full width of parent
                                    fontFamily: "'Courier New', monospace",
                                    background: 'rgba(255, 0, 0, 0.05)',
                                    border: '1px dashed #ff6b6b',
                                    borderRadius: '4px',
                                    padding: '12px',
                                    margin: '6px 0',
                                    boxSizing: 'border-box' // Include padding and border in width calculation
                                }} 
                            >
                                <Text 
                                    size="xs" 
                                    style={{ 
                                        color: '#ff6b6b',
                                        fontFamily: "'Courier New', monospace",
                                        opacity: 0.8,
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    {req.skill} Requirement
                                </Text>
                                <Box style={{ 
                                    display: 'flex', 
                                    gap: '12px', 
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'center' // Center the stats
                                }}>
                                    <Text 
                                        size="sm" 
                                        style={{ 
                                            color: '#ff6b6b',
                                            fontFamily: "'Courier New', monospace",
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        NEED: {req.level}
                                    </Text>
                                    <Text 
                                        size="sm" 
                                        style={{ 
                                            color: '#ffaa66',
                                            fontFamily: "'Courier New', monospace",
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        CURRENT: {currentLevel}
                                    </Text>
                                    <Text 
                                        size="sm" 
                                        style={{ 
                                            color: '#ff4444',
                                            fontFamily: "'Courier New', monospace",
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        DEFICIT: -{req.level - currentLevel}
                                    </Text>
                                </Box>
                                <button
                                    onClick={handleSkillClick}
                                    style={{
                                        backgroundColor: '#ff6b6b',
                                        color: '#000',
                                        border: 'none',
                                        padding: '8px 16px', // Larger padding
                                        borderRadius: '4px', // Slightly larger border radius
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: '12px', // Larger font
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        minWidth: '120px', // Wider for "Guide" text
                                        height: '36px', // Fixed height for consistency
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 0 5px rgba(255, 107, 107, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ff8888';
                                        e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.6)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ff6b6b';
                                        e.currentTarget.style.boxShadow = '0 0 5px rgba(255, 107, 107, 0.3)';
                                    }}
                                >
                                    [{req.skill} Guide]
                                </button>
                            </Box>
                        );
                    })}
                </Box>
            )}
            
            {unmetQuests.length > 0 && (
                <Box>
                    <Text 
                        fw={600} 
                        size="sm" 
                        c="red"
                        style={{ 
                            fontFamily: "'Courier New', monospace",
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 0 5px currentColor'
                        }}
                    >
                        &gt;&gt; Missing Quest Prerequisites:
                    </Text>
                    {unmetQuests.map((prereq: string) => (
                        <Box 
                            key={prereq} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                width: '100%', // Full width of parent
                                fontFamily: "'Courier New', monospace",
                                background: 'rgba(255, 0, 0, 0.05)',
                                border: '1px dashed #ff6b6b',
                                borderRadius: '4px',
                                padding: '8px',
                                margin: '6px 0',
                                boxSizing: 'border-box' // Include padding and border in width calculation
                            }}
                        >
                            <Text 
                                size="xs" 
                                style={{ 
                                    color: '#ff6b6b',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    minWidth: '60px'
                                }}
                            >
                                [QUEST]
                            </Text>
                            <Text 
                                size="sm" 
                                style={{ 
                                    color: '#ff6b6b',
                                    fontFamily: "'Courier New', monospace"
                                }}
                            >
                                REQUIRED: {prereq} | STATUS: NOT_COMPLETED
                            </Text>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

interface QuestCardProps {
    quest: Quest;
    playerLevels?: Record<string, number>;
    quests: Quest[];
    questRequirements?: QuestRequirement;
}

export function QuestCard({ quest, playerLevels, quests, questRequirements }: QuestCardProps) {
    const [showRequirements, setShowRequirements] = useState(false);
    
    // Get requirements or use empty requirements if not found
    const questReqs: QuestRequirement = questRequirements || {
        name: quest.name,
        skills: [],
        questPrerequisites: []
    };

    // Track quest info - simplified without difficulty system
    const difficulty = 2; // Default to intermediate difficulty
    const isHighLevelQuest = false; // Simplified - no longer using difficulty levels

    // Check which requirements are not met
    const unmetSkills = questReqs.skills.filter((req: SkillRequirement) => {
        const currentLevel = playerLevels?.[req.skill] || 1;
        return currentLevel < req.level;
    });

    const unmetQuests = questReqs.questPrerequisites.filter((prereq: string) => {
        const prereqQuest = quests.find(q => q.name === prereq);
        return prereqQuest?.status !== 'COMPLETE';
    });

    const handleAccessGranted = () => {
        setShowRequirements(true);
    };

    return (
        <Paper 
            shadow="sm" 
            p="0" 
            withBorder
            style={{ 
                transition: 'none',
                backgroundColor: 'var(--mantine-color-dark-6)'
            }}
        >
            <Box style={{ textAlign: 'center', padding: '1rem 1rem 0 1rem' }}>
                <Text 
                    fw={500} 
                    size="md" 
                    mb="xs" 
                    className="quest-title"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        fontFamily: "'Courier New', monospace",
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: 'var(--retro-green)',
                        textShadow: '0 0 5px currentColor',
                        position: 'relative'
                    }}
                >
                    <span style={{ opacity: 0.7 }}>[</span>
                    {quest.status === 'IN_PROGRESS' && (
                        <span style={{ 
                            color: 'var(--retro-green)', 
                            marginRight: '4px',
                            textShadow: '0 0 5px currentColor'
                        }}>
                            »
                        </span>
                    )}
                    {quest.name}
                    <span style={{ opacity: 0.7 }}>]</span>
                </Text>
                
                <Box style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
                    <Box style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Badge 
                            color={getStatusColor(quest.status)} 
                            size="lg"
                            variant="light"
                        >
                            {quest.status.replace(/_/g, ' ')}
                        </Badge>
                        <Badge
                            color={getDifficultyColor(difficulty)}
                            size="lg"
                            variant="dot"
                        >
                            {getDifficultyLabel(difficulty)}
                        </Badge>
                    </Box>
                    {isHighLevelQuest && (
                        <Text size="xs" c="yellow">
                            Challenging quest - High requirements
                        </Text>
                    )}
                </Box>
            </Box>
                
                {unmetSkills.length === 0 && unmetQuests.length === 0 ? (
                    <Paper 
                        p="md" 
                        radius="sm" 
                        mt="md" 
                        className={`nested-quest-info ${isHighLevelQuest ? "high-level-quest" : "ready-to-start-quest"}`}
                        style={{ 
                            backgroundColor: 'transparent',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexDirection: 'column' }}>
                            {isHighLevelQuest ? (
                                <>
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Badge color="yellow" size="xl" radius="sm" variant="filled">!</Badge>
                                        <Text fw={700} size="lg" c="yellow">Advanced Quest</Text>
                                    </Box>
                                    <Text size="sm" c="dimmed" mt="xs">This is a high-level quest. While you meet the requirements, it may be challenging.</Text>
                                </>
                            ) : (
                                <>
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Badge 
                                            color="pink" 
                                            size="xl" 
                                            radius="sm" 
                                            variant="filled"
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                color: 'var(--retro-pink)',
                                                border: '0',
                                                borderWidth: '0',
                                                borderStyle: 'none',
                                                borderColor: 'transparent',
                                                outline: 'none',
                                                boxShadow: 'none',
                                                textShadow: '0 0 10px var(--retro-pink), 0 0 20px var(--retro-pink), 0 0 30px var(--retro-pink)',
                                                animation: 'textGlow 2.5s ease-in-out infinite, randomFlicker1 12s infinite ease-in-out',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}
                                        >
                                            ✓
                                        </Badge>
                                        <Text fw={700} size="lg" c="green">Ready to start!</Text>
                                    </Box>
                                    {questReqs.skills.length === 0 && questReqs.questPrerequisites.length === 0 ? (
                                        <Text 
                                            size="sm" 
                                            c="dimmed" 
                                            mt="xs" 
                                            style={{ 
                                                textAlign: 'center',
                                                fontFamily: "'Courier New', monospace",
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            &gt;&gt; No requirements detected &lt;&lt;
                                        </Text>
                                    ) : (
                                        <Box mt="xs">
                                            {questReqs.skills.map((req: SkillRequirement) => {
                                                const currentYear = new Date().getFullYear();
                                                
                                                const handleSkillClick = () => {
                                                    const searchQuery = `osrs level 99 ${req.skill.toLowerCase()} guide ${currentYear}`;
                                                    const youtubeUrl = `youtube://results?search_query=${encodeURIComponent(searchQuery)}`;
                                                    const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                                                    
                                                    // Create a hidden iframe to try the YouTube app
                                                    const iframe = document.createElement('iframe');
                                                    iframe.style.display = 'none';
                                                    iframe.src = youtubeUrl;
                                                    document.body.appendChild(iframe);
                                                    
                                                    // Open web version in new tab as fallback
                                                    setTimeout(() => {
                                                        window.open(fallbackUrl, '_blank');
                                                        document.body.removeChild(iframe);
                                                    }, 500);
                                                };

                                                return (
                                                    <Box 
                                                        key={req.skill} 
                                                        style={{ 
                                                            display: 'flex', 
                                                            flexDirection: 'column', // Stack items vertically
                                                            alignItems: 'center', // Center everything
                                                            gap: '4px', // Reduced from 8px to bring title closer to stats
                                                            fontFamily: "'Courier New', monospace",
                                                            background: 'rgba(0, 255, 65, 0.05)',
                                                            border: '1px dashed var(--retro-green)',
                                                            borderRadius: '4px',
                                                            padding: '12px',
                                                            margin: '6px 0'
                                                        }}
                                                    >
                                                        <Text 
                                                            size="xs" 
                                                            style={{ 
                                                                color: 'var(--retro-green)',
                                                                fontFamily: "'Courier New', monospace",
                                                                opacity: 0.8,
                                                                textTransform: 'uppercase',
                                                                fontWeight: 'bold',
                                                                textAlign: 'center'
                                                            }}
                                                        >
                                                            {req.skill} Requirement
                                                        </Text>
                                                        <Box style={{ 
                                                            display: 'flex', 
                                                            gap: '12px', 
                                                            flexWrap: 'wrap',
                                                            alignItems: 'center',
                                                            justifyContent: 'center' // Center the stats
                                                        }}>
                                                            <Text 
                                                                size="sm" 
                                                                style={{ 
                                                                    color: 'var(--retro-green)',
                                                                    fontFamily: "'Courier New', monospace",
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                NEED: {req.level}
                                                            </Text>
                                                            <Text 
                                                                size="sm" 
                                                                style={{ 
                                                                    color: '#66ff99',
                                                                    fontFamily: "'Courier New', monospace",
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                CURRENT: {playerLevels?.[req.skill] || 1}
                                                            </Text>
                                                            <Text 
                                                                size="sm" 
                                                                style={{ 
                                                                    color: '#00ff77',
                                                                    fontFamily: "'Courier New', monospace",
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                STATUS: ✓ SATISFIED
                                                            </Text>
                                                        </Box>
                                                        <button
                                                            onClick={handleSkillClick}
                                                            style={{
                                                                backgroundColor: 'var(--retro-green)',
                                                                color: '#000',
                                                                border: 'none',
                                                                padding: '8px 16px', // Larger padding
                                                                borderRadius: '4px', // Slightly larger border radius
                                                                fontFamily: "'Courier New', monospace",
                                                                fontSize: '12px', // Larger font
                                                                fontWeight: 'bold',
                                                                textTransform: 'uppercase',
                                                                cursor: 'pointer',
                                                                minWidth: '120px', // Wider for "Guide" text
                                                                height: '36px', // Fixed height for consistency
                                                                textAlign: 'center',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: '0 0 5px rgba(0, 255, 65, 0.3)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#66ff66';
                                                                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.6)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'var(--retro-green)';
                                                                e.currentTarget.style.boxShadow = '0 0 5px rgba(0, 255, 65, 0.3)';
                                                            }}
                                                        >
                                                            [{req.skill} Guide]
                                                        </button>
                                                    </Box>
                                                );
                                            })}
                                            {questReqs.questPrerequisites.map((prereq: string) => (
                                                <Box 
                                                    key={prereq} 
                                                    style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '12px',
                                                        fontFamily: "'Courier New', monospace",
                                                        background: 'rgba(0, 255, 65, 0.05)',
                                                        border: '1px dashed var(--retro-green)',
                                                        borderRadius: '4px',
                                                        padding: '8px',
                                                        margin: '6px 0'
                                                    }}
                                                >
                                                    <Text 
                                                        size="xs" 
                                                        style={{ 
                                                            color: 'var(--retro-green)',
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase',
                                                            minWidth: '60px'
                                                        }}
                                                    >
                                                        [QUEST]
                                                    </Text>
                                                    <Text 
                                                        size="sm" 
                                                        style={{ 
                                                            color: 'var(--retro-green)',
                                                            fontFamily: "'Courier New', monospace"
                                                        }}
                                                    >
                                                        REQUIRED: {prereq} | STATUS: ✓_COMPLETED
                                                    </Text>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    <Paper p="0" radius="sm" mt="md" className="nested-quest-info" style={{ backgroundColor: 'transparent' }}>
                        <Box mb="md" px="1rem">
                            <AnimatedAccessStatus onAccessGranted={handleAccessGranted} />
                        </Box>
                        
                        <Box pb="1rem">
                            <DelayedRequirementsDisplay
                                unmetSkills={unmetSkills}
                                unmetQuests={unmetQuests}
                                playerLevels={playerLevels}
                                show={showRequirements}
                            />
                        </Box>
                    </Paper>
                )}
        </Paper>
    );
}