import { useState, useEffect } from 'react';
import { initializeQuestRequirements } from '../services/wikiQuests';
import type { QuestRequirement } from '../types';

export function useQuestRequirements() {
    const [requirements, setRequirements] = useState<Record<string, QuestRequirement>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // Track if component is still mounted

        async function loadRequirements() {
            try {
                setLoading(true);
                const data = await initializeQuestRequirements();
                
                // Only update state if component is still mounted
                if (isMounted) {
                    setRequirements(data);
                    setError(null);
                }
            } catch (err) {
                console.error('Failed to load quest requirements:', err);
                if (isMounted) {
                    setError('Failed to load quest requirements from the Wiki. Requirements may be incomplete.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadRequirements();

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array is intentional and stable

    return { requirements, loading, error };
}
