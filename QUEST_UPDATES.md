# Quest List Management

This document explains how to keep the quest list up-to-date.

## Current System

- **File**: `src/data/quests.ts`
- **Order**: Array order determines quest priority
- **Source**: [OSRS Wiki Optimal Quest Guide](https://oldschool.runescape.wiki/w/Optimal_quest_guide)

## How to Update

### 1. Check for New Quests
```bash
npm run check-quests
```

### 2. Manual Update Process
1. Visit the [OSRS Wiki Optimal Quest Guide](https://oldschool.runescape.wiki/w/Optimal_quest_guide#Quests)
2. Look for any new quests in the table
3. Note their position in the optimal order
4. Add them to `src/data/quests.ts` in the correct array position
5. Update the "Last Updated" date in the file header
6. Add quest requirements from the [Quest Requirements page](https://oldschool.runescape.wiki/w/Quest_requirements)

### 3. Quest Requirements Format
```typescript
{
    name: "Quest Name",
    requirements: {
        skills: {
            "Skill Name": level,
            "Another Skill": level
        },
        quests: ["Required Quest 1", "Required Quest 2"]
    }
}
```

### 4. Verify Changes
```bash
npm run check-quests
```

## When to Update

- **New Quest Release**: Usually every 3-6 months
- **Quest Rework**: When requirements change
- **Wiki Updates**: When optimal order changes

## Quest Categories

The current list is organized into:

1. **Early Game** (Tutorial - Level ~30)
2. **Combat & Transportation Unlocks**
3. **Mid Game - Morytania & Transportation** 
4. **Desert & Exploration**
5. **Advanced Quests**
6. **Kourend & Zeah**
7. **Major Unlocks**
8. **Late Game Major Quests**
9. **Endgame**

## Notes

- Array order is critical - first incomplete quest will be shown
- Quest names must match exactly what the OSRS API returns
- Requirements should match current game state
- Version info is tracked in `questListInfo` object
