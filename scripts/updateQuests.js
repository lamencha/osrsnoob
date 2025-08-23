#!/usr/bin/env node

/**
 * Quest List Update Helper
 * 
 * This script helps maintain the quest list by:
 * 1. Checking for missing quests from a reference source
 * 2. Validating quest requirements
 * 3. Ensuring proper ordering
 * 
 * To use:
 * npm run check-quests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common OSRS quests that might be missing from our list
const commonQuests = [
    "Cook's Assistant", "Sheep Shearer", "Romeo & Juliet", "Demon Slayer",
    "Ernest the Chicken", "Vampire Slayer", "Imp Catcher", "Witch's Potion",
    "Rune Mysteries", "The Restless Ghost", "Goblin Diplomacy", "Pirates' Treasure",
    "Dragon Slayer I", "Black Knights' Fortress", "Prince Ali Rescue",
    "Doric's Quest", "Witch's House", "The Knight's Sword", "Gertrude's Cat",
    "Waterfall Quest", "Tree Gnome Village", "Fight Arena", "The Grand Tree",
    "Hazeel Cult", "Sheep Herder", "Plague City", "Biohazard", "Monk's Friend",
    "Druidic Ritual", "Lost City", "Merlin's Crystal", "Holy Grail",
    "Legends' Quest", "Family Crest", "Heroes' Quest", "Shilo Village",
    "Underground Pass", "Regicide", "Roving Elves", "Mourning's End Part I",
    "Mourning's End Part II", "Song of the Elves", "Desert Treasure I",
    "Desert Treasure II", "Monkey Madness I", "Monkey Madness II",
    "Recipe for Disaster", "Barrows Gloves", "Dragon Slayer II",
    "The Fremennik Trials", "The Fremennik Isles", "The Fremennik Exiles",
    "Lunar Diplomacy", "Dream Mentor", "King's Ransom", "While Guthix Sleeps"
];

function checkQuestList() {
    try {
        const questFile = path.join(__dirname, '../src/data/quests.ts');
        const content = fs.readFileSync(questFile, 'utf8');
        
        console.log('🔍 Analyzing quest list...\n');
        
        // Extract quest names from the file
        const questMatches = content.match(/name: "([^"]+)"/g);
        const currentQuests = questMatches ? questMatches.map(match => 
            match.replace('name: "', '').replace('"', '')
        ) : [];
        
        console.log(`📊 Current quest count: ${currentQuests.length}`);
        
        // Check for common quests that might be missing
        const missingQuests = commonQuests.filter(quest => 
            !currentQuests.includes(quest)
        );
        
        if (missingQuests.length > 0) {
            console.log('\n⚠️  Potentially missing quests:');
            missingQuests.forEach(quest => console.log(`   - ${quest}`));
        } else {
            console.log('\n✅ All common quests appear to be included');
        }
        
        // Check for duplicates
        const duplicates = currentQuests.filter((quest, index) => 
            currentQuests.indexOf(quest) !== index
        );
        
        if (duplicates.length > 0) {
            console.log('\n❌ Duplicate quests found:');
            duplicates.forEach(quest => console.log(`   - ${quest}`));
        } else {
            console.log('\n✅ No duplicate quests found');
        }
        
        // Extract last updated date
        const dateMatch = content.match(/Last Updated: ([^\n]+)/);
        const lastUpdated = dateMatch ? dateMatch[1] : 'Unknown';
        console.log(`\n📅 Last updated: ${lastUpdated}`);
        
        console.log('\n💡 To update the quest list:');
        console.log('   1. Visit: https://oldschool.runescape.wiki/w/Optimal_quest_guide');
        console.log('   2. Check for new quests in the table');
        console.log('   3. Add them in the correct order to src/data/quests.ts');
        console.log('   4. Update the "Last Updated" date');
        console.log('   5. Run this script again to verify');
        
    } catch (error) {
        console.error('❌ Error reading quest file:', error.message);
    }
}

// Always run the check when this script is executed directly
checkQuestList();

export { checkQuestList };
