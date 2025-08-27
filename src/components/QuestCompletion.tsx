import { Box, Text, Stack, Center } from '@mantine/core';
import { useEffect, useState } from 'react';

interface QuestCompletionProps {
    isVisible: boolean;
    onClose?: () => void;
}

export function QuestCompletion({ isVisible, onClose }: QuestCompletionProps) {
    const [showMessage, setShowMessage] = useState(false);
    const [showArt, setShowArt] = useState(false);
    
    useEffect(() => {
        if (isVisible) {
            const timer1 = setTimeout(() => setShowMessage(true), 500);
            const timer2 = setTimeout(() => setShowArt(true), 1500);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        } else {
            // Reset state when hidden
            setShowMessage(false);
            setShowArt(false);
        }
    }, [isVisible]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    if (!isVisible) return null;

    const grassArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⢀⣴⠟⠉⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣀⢀⣾⠿⠻⢶⣄⠀⠀⣠⣶⡿⠶⣄⣠⣾⣿⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⢻⣿⣿⡿⣿⠿⣿⡿⢼⣿⣿⡿⣿⣎⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠉⠛⢛⣛⡉⠀⠀⠙⠛⠻⠛⠑⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣧⣤⣴⠿⠿⣷⣤⡤⠴⠖⠳⣄⣀⣹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣀⣟⠻⢦⣀⡀⠀⠀⠀⠀⣀⡈⠻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡿⠉⡇⠀⠀⠛⠛⠛⠋⠉⠉⠀⠀⠀⠹⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠈⠑⠪⠷⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣦⣼⠛⢦⣤⣄⡀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠢⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠲⠖⠛⠻⣿⡿⠛⠉⠉⠻⠷⣦⣽⠿⠿⠒⠚⠋⠉⠁⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣾⠛⠁⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⠀⠀⠀
⠀⠀⠀⠀⣰⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀
⠀⠀⠀⣰⣿⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣧⣄⠀⠀⠀⠀⠀⠀⢳⡀⠀
⠀⠀⠀⣿⡾⢿⣀⢀⣀⣦⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⣫⣿⡿⠟⠻⠶⠀⠀⠀⠀⠀⢳⠀
⠀⠀⢀⣿⣧⡾⣿⣿⣿⣿⣿⡷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⢀⡴⢿⣿⣧⠀⡀⠀⢀⣀⣀⢒⣤⣶⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⡾⠁⠙⣿⡈⠉⠙⣿⣿⣷⣬⡛⢿⣶⣶⣴⣶⣶⣶⣤⣤⠤⠾⣿⣿⣿⡿⠿⣿⠿⢿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⣸⠃⠀⠀⢸⠃⠀⠀⢸⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⠟⡉⠀⠀⠀⠈⠙⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⣿⠀⠀⢀⡏⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠛⠉⠁⠀⠀⠀⠀⠀⠉⠠⠿⠟⠻⠟⠋⠉⢿⣿⣦⡀⢰⡀⠀⠀⠀⠀⠀⠀⠁
⢀⣿⡆⢀⡾⠀⠀⠀⠀⣾⠏⢿⣿⣿⣿⣯⣙⢷⡄⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣿⣻⢿⣷⣀⣷⣄⠀⠀⠀⠀⢸⠀
⢸⠃⠠⣼⠃⠀⠀⣠⣾⡟⠀⠈⢿⣿⡿⠿⣿⣿⡿⠿⠿⠿⠷⣄⠈⠿⠛⠻⠶⢶⣄⣀⣀⡠⠈⢛⡿⠃⠈⢿⣿⣿⡿⠀⠀⠀⠀⠀⡀
⠟⠀⠀⢻⣶⣶⣾⣿⡟⠁⠀⠀⢸⣿⢅⠀⠈⣿⡇⠀⠀⠀⠀⠀⣷⠂⠀⠀⠀⠀⠐⠋⠉⠉⠀⢸⠁⠀⠀⠀⢻⣿⠛⠀⠀⠀⠀⢀⠇
⠀⠀⠀⠀⠹⣿⣿⠋⠀⠀⠀⠀⢸⣧⠀⠰⡀⢸⣷⣤⣤⡄⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡆⠀⠀⠀⠀⡾⠀⠀⠀⠀⠀⠀⢼⡇
⠀⠀⠀⠀⠀⠙⢻⠄⠀⠀⠀⠀⣿⠉⠀⠀⠈⠓⢯⡉⠉⠉⢱⣶⠏⠙⠛⠚⠁⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠻⠄⠀⠀⠀⢀⣿⠀⢠⡄⠀⠀⠀⣁⠁⡀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⢀⣐⡟⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⢠⡇`;

    return (
        <Box 
            onClick={handleClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer'
            }}
        >
            {/* Close button for mobile/desktop - Terminal Style */}
            <Box
                onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                }}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#888',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    userSelect: 'none',
                    letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#00ff00';
                    e.currentTarget.style.borderColor = '#00ff00';
                    e.currentTarget.style.textShadow = '0 0 5px #00ff00';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#888';
                    e.currentTarget.style.borderColor = '#444';
                    e.currentTarget.style.textShadow = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                [X] CLOSE
            </Box>

            <Center onClick={(e) => e.stopPropagation()}>
                <Stack align="center" gap="xl" style={{ maxWidth: '90vw', textAlign: 'center' }}>
                    {showMessage && (
                        <>
                            <Text 
                                size="xl" 
                                fw={700} 
                                style={{ 
                                    fontFamily: 'monospace',
                                    color: '#00ff00',
                                    textShadow: '0 0 10px #00ff00',
                                    animation: 'glow 2s ease-in-out infinite alternate',
                                    letterSpacing: '2px'
                                }}
                            >
                                ◢ QUEST LOG COMPLETE ◣
                            </Text>
                            
                            <Text 
                                size="lg" 
                                style={{ 
                                    fontFamily: 'monospace',
                                    color: '#ffff00',
                                    animation: 'typewriter 3s steps(40) 1s both'
                                }}
                            >
                                [x] STATUS: ALL_QUESTS_COMPLETED
                            </Text>
                            
                            <Text 
                                size="md" 
                                style={{ 
                                    fontFamily: 'monospace',
                                    color: '#00ffff',
                                    animation: 'typewriter 4s steps(60) 2s both'
                                }}
                            >
                                CONGRATULATIONS HERO! PLEASE TOUCH SOME GRASS!
                            </Text>
                        </>
                    )}
                    
                    {showArt && (
                        <Box 
                            style={{ 
                                fontFamily: 'monospace', 
                                fontSize: '8px',
                                lineHeight: '8px',
                                color: '#00ff00',
                                whiteSpace: 'pre',
                                textAlign: 'center',
                                animation: 'fadeInGrass 2s ease-in-out',
                                textShadow: '0 0 5px #00ff00'
                            }}
                        >
                            {grassArt}
                        </Box>
                    )}
                    
                    {showArt && (
                        <Text 
                            size="sm" 
                            style={{ 
                                fontFamily: 'monospace',
                                color: '#888',
                                marginTop: '2rem',
                                animation: 'fadeIn 3s ease-in-out 3s both',
                                letterSpacing: '0.5px'
                            }}
                        >
                            [ESC] or [TAP_ANYWHERE] to return to terminal...
                        </Text>
                    )}
                </Stack>
            </Center>
            
            <style>{`
                @keyframes glow {
                    from { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
                    to { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
                }
                
                @keyframes typewriter {
                    from { 
                        width: 0;
                        opacity: 0;
                    }
                    to { 
                        width: 100%;
                        opacity: 1;
                    }
                }
                
                @keyframes fadeInGrass {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.8);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </Box>
    );
}
