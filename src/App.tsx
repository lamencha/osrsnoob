import { useState, useEffect } from 'react';
import { 
  MantineProvider, 
  Container, 
  Button, 
  Title, 
  Text, 
  Alert,
  Paper,
  Box,
  Loader,
  Checkbox
} from '@mantine/core';
import { IconTerminal } from '@tabler/icons-react';
import { QuestList } from './components/QuestList';
import { QuestCompletion } from './components/QuestCompletion';
import { fetchPlayerQuests } from './services/wikiSync';
import type { PlayerQuestData } from './services/wikiSync';
import { useQuestRequirements } from './hooks/useQuestRequirements';
import { quests } from './data/quests';
import { filterOutMiniQuests } from './data/miniQuests';
import './App.css';

// Version info
const APP_VERSION = '1.0.0';

interface TypewriterState {
  step: number; // 0: not started, 1: title, 2: last updated, 3: sort by, 4: quest cards
  titleText: string;
  lastUpdatedText: string;
  sortByText: string;
  showQuestCards: boolean;
}

export default function App() {
  const [username, setUsername] = useState('');
  const [rememberUsername, setRememberUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questData, setQuestData] = useState<PlayerQuestData | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Load saved username and remember setting on app start
  useEffect(() => {
    const savedUsername = localStorage.getItem('osrsnoob-username');
    const savedRememberSetting = localStorage.getItem('osrsnoob-remember-username');
    
    if (savedUsername && savedRememberSetting === 'true') {
      setUsername(savedUsername);
      setRememberUsername(true);
    }
  }, []);
  
  // Typewriter effect state
  const [typewriter, setTypewriter] = useState<TypewriterState>({
    step: 0,
    titleText: '',
    lastUpdatedText: '',
    sortByText: '',
    showQuestCards: false
  });

  // Typewriter effect hook
  useEffect(() => {
    if (!questData || typewriter.step === 0) return;

    const targetTitle = `Find Next Quest for ${username}`;

    const typeText = (text: string, currentText: string, callback: (newText: string) => void) => {
      if (currentText.length < text.length) {
        const nextChar = text.charAt(currentText.length);
        const newText = currentText + nextChar;
        callback(newText);
      }
    };

    const interval = setInterval(() => {
      setTypewriter(prev => {
        const newState = { ...prev };
        
        if (prev.step === 1) {
          // Type the title
          typeText(targetTitle, prev.titleText, (newText) => {
            newState.titleText = newText;
            if (newText === targetTitle) {
              setTimeout(() => {
                setTypewriter(s => ({ 
                  ...s, 
                  step: 2,
                  lastUpdatedText: `Last updated: ${new Date(questData.lastUpdated).toLocaleString()}`,
                  sortByText: 'Sort by: Optimal Order'
                }));
              }, 500); // Pause before showing other elements
            }
          });
        } else if (prev.step === 2) {
          // Show quest cards after a brief delay
          setTimeout(() => {
            setTypewriter(s => ({ ...s, step: 3, showQuestCards: true }));
          }, 300);
          return { ...prev, step: 3 }; // Skip to step 3
        }
        
        return newState;
      });
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [questData, username, typewriter.step]);

  // Focus input on mount
  useEffect(() => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    input?.focus();
  }, []);
  const { requirements: questRequirements, loading: loadingRequirements } = useQuestRequirements();

  // Check if all quests are completed
  const checkAllQuestsComplete = (questData: PlayerQuestData): boolean => {
    if (!questData || !questData.quests) return false;
    
    // Use the same logic as QuestList - filter out mini quests and find next quest
    const trackableQuests = filterOutMiniQuests(quests);
    const nextQuest = trackableQuests.find(orderedQuest => {
        const playerQuest = questData.quests.find(pq => pq.name === orderedQuest.name);
        // If the player doesn't have this quest in their list, or it's not completed, show it
        return !playerQuest || playerQuest.status !== 'COMPLETE';
    });

    // If no next quest found, all quests are complete!
    return !nextQuest;
  };

  // Effect to check for completion when quest data changes
  useEffect(() => {
    if (questData) {
      const isComplete = checkAllQuestsComplete(questData);
      console.log('Quest completion check:', isComplete);
      console.log('Player has', questData.quests.length, 'quests');
      
      if (isComplete) {
        console.log('All quests completed! Showing completion screen...');
        // Delay showing completion screen for dramatic effect
        setTimeout(() => {
          setShowCompletion(true);
        }, 2000);
      } else {
        setShowCompletion(false);
      }
    }
  }, [questData]);

  // Handle escape key to close completion screen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCompletion) {
        setShowCompletion(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showCompletion]);

  // Easter egg: Konami code or special combination to show completion screen
  useEffect(() => {
    const handleKeyCombo = (event: KeyboardEvent) => {
      // Ctrl + Shift + G for "Grass" 🌱
      if (event.ctrlKey && event.shiftKey && event.key === 'G') {
        console.log('Manual grass trigger activated!');
        setShowCompletion(true);
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyCombo);
    return () => window.removeEventListener('keydown', handleKeyCombo);
  }, []);

  // Listen for background updates to quest data
  useEffect(() => {
    const handleQuestDataUpdate = (event: CustomEvent<{ username: string, data: PlayerQuestData }>) => {
      const { username: updatedUsername, data } = event.detail;
      // Only update if it's for the current user
      if (username.toLowerCase() === updatedUsername.toLowerCase()) {
        setQuestData(data);
      }
    };

    window.addEventListener('questDataUpdated', handleQuestDataUpdate as EventListener);
    return () => {
      window.removeEventListener('questDataUpdated', handleQuestDataUpdate as EventListener);
    };
  }, [username]);

  // Handle remember username functionality
  const handleRememberUsernameChange = (checked: boolean) => {
    setRememberUsername(checked);
    localStorage.setItem('osrsnoob-remember-username', checked.toString());
    
    if (checked && username) {
      // Save current username
      localStorage.setItem('osrsnoob-username', username);
    } else if (!checked) {
      // Clear saved username
      localStorage.removeItem('osrsnoob-username');
    }
  };

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    
    // If remember is enabled, save immediately
    if (rememberUsername) {
      localStorage.setItem('osrsnoob-username', newUsername);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    // Save username if remember is enabled
    if (rememberUsername) {
      localStorage.setItem('osrsnoob-username', username);
    }

    setLoading(true);
    setError(null);
    setQuestData(null);
    // Reset typewriter state
    setTypewriter({
      step: 0,
      titleText: '',
      lastUpdatedText: '',
      sortByText: '',
      showQuestCards: false
    });
    
    try {
      const data = await fetchPlayerQuests(username);
      if (data && data.quests && data.quests.length > 0) {
        setQuestData(data);
        // Start typewriter effect
        setTimeout(() => {
          setTypewriter(prev => ({ ...prev, step: 1 }));
        }, 300);
      } else {
        setError('No quest data received from the server');
        setQuestData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setQuestData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider theme={{ primaryColor: 'blue' }}>
      <Container size="sm" py="xl" px="md">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Box mb="3rem" style={{ textAlign: 'center' }}>
            <Title order={1} mb="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              ◢ OSRS NOOB ◣
            </Title>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <Box mb="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Hidden input for form submission */}
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                style={{ position: 'absolute', left: '-9999px' }}
                autoComplete="off"
              />
              {/* Custom terminal-style input display */}
              <div
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  input?.focus();
                }}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  marginBottom: '1rem',
                  padding: '1.5rem 1rem',
                  background: 'var(--terminal-bg)',
                  border: '2px solid var(--retro-green)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1.1rem',
                  fontFamily: "'Courier New', monospace",
                  color: username.length > 0 ? 'var(--terminal-green)' : 'rgba(0, 255, 65, 0.6)',
                  cursor: 'text',
                  textAlign: 'center',
                  boxShadow: 'inset 0 0 10px rgba(50, 7, 7, 0.1), 0 0 5px rgba(50, 7, 7, 0.3)',
                  textShadow: '0 0 5px currentColor'
                }}
              >
                {username.length > 0 ? username : 'Enter your username'}
                <span className="terminal-cursor" style={{ color: 'var(--retro-green)' }}>_</span>
              </div>
              
              {/* Remember username checkbox with label on top */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                <Text 
                  size="sm" 
                  mb="xs" 
                  style={{ 
                    color: 'var(--retro-green)', 
                    fontFamily: "'Courier New', monospace",
                    textShadow: '0 0 3px var(--retro-green)'
                  }}
                >
                  Remember username
                </Text>
                <Checkbox
                  checked={rememberUsername}
                  onChange={(event) => handleRememberUsernameChange(event.currentTarget.checked)}
                  label=""
                />
              </div>
              
              <Button 
                type="submit" 
                loading={loading} 
                size="md"
                style={{
                  maxWidth: '400px',
                  width: '100%'
                }}
              >
                Run
              </Button>
            </Box>
          </form>

          {error && (
            <Alert 
              color="red" 
              title={error.includes('500') ? 'Server Error' : 'Error'} 
              mb="lg"
            >
              {error}
              <Box mt="md">
                {(error.includes('not found') || error.includes('data sync') || error.includes('wiki plugin')) && (
                  <>
                    <Text size="sm" fw={500}>To use this tracker:</Text>
                    <Text size="sm" component="div" mt="xs">
                      1. Install RuneLite if you haven't already
                    </Text>
                    <Text size="sm" component="div">
                      2. Enable the "Wiki" plugin in RuneLite settings
                    </Text>
                    <Text size="sm" component="div">
                      3. Log into OSRS through RuneLite
                    </Text>
                    <Text size="sm" component="div">
                      4. Wait a few minutes for your data to sync
                    </Text>
                  </>
                )}
                {error.includes('network') && (
                  <Text size="sm" fw={500}>
                    Please check your internet connection and try again.
                  </Text>
                )}
                {error.includes('timeout') && (
                  <>
                    <Text size="sm" fw={500}>The server is taking longer than expected to respond.</Text>
                    <Text size="sm">This might be due to high server load. Please try again in a few moments.</Text>
                  </>
                )}
                {error.includes('server error') && (
                  <>
                    <Text size="sm" fw={500}>The server is experiencing technical difficulties.</Text>
                    <Text size="sm">We're automatically retrying your request. If the problem persists, please try again later.</Text>
                  </>
                )}
              </Box>
            </Alert>
          )}

          {loadingRequirements ? (
            <Box ta="center">
              <Loader size="lg" />
              <Text mt="md">Loading quest requirements...</Text>
            </Box>
          ) : loading ? (
            <Box ta="center">
              <Text size="lg" fw={500} mb="md">Loading quest data...</Text>
              <Text size="sm" c="dimmed">This may take a few moments</Text>
            </Box>
          ) : questData ? (
            <Box>
              {/* Typewriter effect display */}
              {typewriter.step >= 1 && (
                <Box ta="center" mb="lg">
                  <Title order={3} mb="xs" className="typewriter-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <IconTerminal size={24} />
                    {typewriter.titleText}
                    {typewriter.step === 1 && typewriter.titleText.length < `Find Next Quest for ${username}`.length && (
                      <span className="terminal-cursor">_</span>
                    )}
                  </Title>
                </Box>
              )}
              
              {typewriter.step >= 2 && (
                <Box ta="center" mb="lg">
                  <Text size="sm" className="typewriter-text">
                    Last updated: <span className="date-text">{new Date(questData.lastUpdated).toLocaleString()}</span>
                  </Text>
                </Box>
              )}
              
              {typewriter.step >= 2 && (
                <Box ta="center" mb="lg">
                  <Text size="sm" className="typewriter-text">
                    Sort by: <span className="date-text">Optimal Order</span>
                  </Text>
                </Box>
              )}
              
              {typewriter.showQuestCards && questData.quests.length > 0 && (
                <QuestList 
                  quests={questData.quests} 
                  playerLevels={questData.levels}
                  questRequirements={questRequirements}
                />
              )}
              
              {typewriter.showQuestCards && questData.quests.length === 0 && (
                <Box ta="center">
                  <Text>No quest data available.</Text>
                </Box>
              )}
            </Box>
          ) : error ? null : (
            <Box ta="center" mt="xl">
              <Text size="sm" c="dimmed">Enter your RuneScape username to see your next quest</Text>
            </Box>
          )}
        </Paper>
      </Container>
      
      {/* Version Display */}
      <div className="version-display">
        {APP_VERSION}
      </div>

      {/* Quest Completion Screen */}
      <QuestCompletion 
        isVisible={showCompletion} 
        onClose={() => setShowCompletion(false)} 
      />
    </MantineProvider>
  )
}
