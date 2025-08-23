/**
 * OSRS Optimal Quest Guide - Complete Quest List
 * Last Updated: August 23, 2025
 * Source: https://oldschool.runescape.wiki/w/Optimal_quest_guide#Quests
 * Wiki Version: As of August 2025 game updates
 * 
 * To update this list:
 * 1. Check the wiki link above for any new quests
 * 2. Add new quests in the correct order position
 * 3. Update the "Last Updated" date above
 * 4. Update requirements from: https://oldschool.runescape.wiki/w/Quest_requirements
 */

/**
 * Represents a quest and its requirements
 */
interface Quest {
    name: string;
    requirements?: {
        skills?: Record<string, number>;
        quests?: string[];
    };
}

/**
 * All quests in OSRS Optimal Quest Guide order
 * Array order determines quest priority - first incomplete quest will be shown
 */
export const quests: Quest[] = [
    // === TUTORIAL & VERY EARLY GAME ===
    { name: "Cook's Assistant",
        requirements: {
            quests: ["The Lost Tribe"],
            skills: { "Ranged": 13, "Thieving": 26 }
        }},
    { name: "Sheep Shearer" },
    { name: "Misthalin Mystery" },
    { name: "Prince Ali Rescue" },
    { name: "The Restless Ghost" },
    { name: "Rune Mysteries" },
    { name: "Imp Catcher" },
    { name: "Witch's Potion" },
    { name: "Gertrude's Cat" },
    { name: "Children of the Sun" },
    { name: "Natural History Quiz" },
    { name: "Daddy's Home" },
    { name: "Romeo & Juliet" },
    { name: "Ernest the Chicken" },
    { name: "Demon Slayer" },
    { name: "Vampire Slayer", requirements: { skills: { "Attack": 45 } } },

    // === EARLY COMBAT & UNLOCKS ===
    { name: "Dwarf Cannon" },
    {
        name: "Waterfall Quest",
        requirements: {
            skills: { "Attack": 30, "Strength": 30 }
        }
    },
    {
        name: "Tree Gnome Village",
        requirements: {
            skills: { "Attack": 36 }
        }
    },
    { name: "Doric's Quest" },
    {
        name: "Witch's House",
        requirements: {
            skills: { "Hitpoints": 24 }
        }
    },
    {
        name: "The Knight's Sword",
        requirements: {
            skills: { "Smithing": 29 }
        }
    },
    {
        name: "The Tourist Trap",
        requirements: {
            skills: { "Agility": 26, "Fletching": 10 }
        }
    },
    { name: "Black Knights' Fortress" },
    {
        name: "Druidic Ritual",
        requirements: {
            skills: { "Herblore": 3 }
        }
    },
    {
        name: "Recruitment Drive",
        requirements: {
            skills: { "Prayer": 14, "Herblore": 10, "Agility": 27 }
        }
    },
    { name: "Goblin Diplomacy" },
    { name: "Sleeping Giants" },
    {
        name: "Fight Arena",
        requirements: {
            skills: { "Attack": 40, "Thieving": 14 }
        }
    },
    {
        name: "Plague City",
        requirements: {
            skills: { "Mining": 18 }
        }
    },
    { name: "Monk's Friend" },
    {
        name: "Hazeel Cult",
        requirements: {
            skills: { "Thieving": 18 }
        }
    },
    { name: "Sheep Herder" },
    {
        name: "Biohazard",
        requirements: {
            quests: ["Plague City"]
        }
    },
    {
        name: "Tower of Life",
        requirements: {
            skills: { "Construction": 14 }
        }
    },
    {
        name: "Tribal Totem",
        requirements: {
            skills: { "Thieving": 24 }
        }
    },
    {
        name: "Death Plateau",
        requirements: {
            skills: { "Attack": 40 }
        }
    },
    { name: "Merlin's Crystal" },
    {
        name: "Holy Grail",
        requirements: {
            quests: ["Merlin's Crystal"],
            skills: { "Defence": 31, "Prayer": 29 }
        }
    },
    {
        name: "Murder Mystery",
        requirements: {
            skills: { "Crafting": 18 }
        }
    },
    {
        name: "The Grand Tree",
        requirements: {
            quests: ["Tree Gnome Village"],
            skills: { "Attack": 44, "Agility": 32 }
        }
    },

    // === TRANSPORTATION & EXPLORATION ===
    { name: "Rag and Bone Man I" },
    {
        name: "Priest in Peril",
        requirements: {
            skills: { "Prayer": 31 }
        }
    },
    {
        name: "Nature Spirit",
        requirements: {
            quests: ["Priest in Peril", "The Restless Ghost"],
            skills: { "Defence": 32, "Crafting": 23 }
        }
    },
    {
        name: "Ghosts Ahoy",
        requirements: {
            quests: ["Priest in Peril", "Nature Spirit"],
            skills: { "Prayer": 32, "Agility": 25, "Cooking": 20 }
        }
    },
    { name: "Making History" },
    {
        name: "The Lost Tribe",
        requirements: {
            skills: { "Agility": 13, "Thieving": 13, "Mining": 17 }
        }
    },
    {
        name: "Death to the Dorgeshuun",
        requirements: {
            quests: ["The Lost Tribe"],
            skills: { "Ranged": 13, "Thieving": 26 }
        }
    },
    { name: "Elemental Workshop I" },
    { name: "The Ribbiting Tale of a Lily Pad Labour Dispute" },
    {
        name: "Lost City",
        requirements: {
            skills: { "Crafting": 31, "Woodcutting": 36 }
        }
    },
    {
        name: "Fairytale I - Growing Pains",
        requirements: {
            quests: ["Lost City"],
            skills: { "Farming": 17 }
        }
    },
    { name: "Recipe for Disaster/Another Cook's Quest" },
    { name: "Recipe for Disaster/Freeing the Goblin generals" },
    { name: "Sea Slug" },
    { name: "Fishing Contest" },
    { name: "Recipe for Disaster/Freeing the Mountain Dwarf" },
    {
        name: "Mountain Daughter",
        requirements: {
            skills: { "Attack": 45, "Prayer": 37 }
        }
    },

    // === DESERT & ADVANCED AREAS ===
    {
        name: "Icthlarin's Little Helper",
        requirements: {
            skills: { "Woodcutting": 22, "Agility": 36, "Thieving": 30 }
        }
    },
    {
        name: "The Golem",
        requirements: {
            skills: { "Crafting": 30, "Thieving": 30 }
        }
    },
    {
        name: "Ratcatchers",
        requirements: {
            quests: ["Icthlarin's Little Helper", "The Giant Dwarf"],
            skills: { "Thieving": 33 }
        }
    },
    {
        name: "The Feud",
        requirements: {
            skills: { "Thieving": 39 }
        }
    },
    { name: "Death on the Isle" },
    { name: "Alfred Grimhand's Barcrawl" },
    {
        name: "Scorpion Catcher",
        requirements: {
            skills: { "Prayer": 31 }
        }
    },
    {
        name: "The Dig Site",
        requirements: {
            skills: { "Agility": 10, "Herblore": 10, "Thieving": 25 }
        }
    },
    { name: "Elemental Workshop II" },
    { name: "A Soul's Bane" },
    { name: "Enter the Abyss" },
    { name: "X Marks the Spot" },
    { name: "Pirate's Treasure" },
    { name: "Jungle Potion" },
    {
        name: "Shilo Village",
        requirements: {
            quests: ["Jungle Potion"],
            skills: { "Crafting": 20, "Agility": 32 }
        }
    },

    // === KOUREND & ZEAH ===
    { name: "Client of Kourend" },
    { name: "The Queen of Thieves" },
    { name: "The Depths of Despair" },
    { name: "A Porcine of Interest" },
    { name: "Wanted!" },
    { name: "Shield of Arrav" },

    // === MAJOR UNLOCKS ===
    {
        name: "Dragon Slayer I",
        requirements: {
            quests: ["Rune Mysteries"],
            skills: { "Magic": 33 }
        }
    },
    {
        name: "Bone Voyage",
        requirements: {
            skills: { "Kudos": 100 }
        }
    },
    {
        name: "Watchtower",
        requirements: {
            skills: { "Magic": 14, "Agility": 25, "Mining": 40, "Herblore": 14 }
        }
    },
    {
        name: "The Giant Dwarf",
        requirements: {
            skills: { "Magic": 33, "Firemaking": 16, "Crafting": 12, "Thieving": 33 }
        }
    },
    { name: "Forgettable Tale..." },
    { name: "Another Slice of H.A.M." },
    {
        name: "Vampire Slayer",
        requirements: {
            skills: { "Attack": 45 }
        }
    },
    { name: "Ernest the Chicken" },
    { name: "Demon Slayer" },
    { name: "Shadow of the Storm" },
    {
        name: "Horror from the Deep",
        requirements: {
            skills: { "Agility": 35 }
        }
    },
    {
        name: "Animal Magnetism",
        requirements: {
            quests: ["Ernest the Chicken", "Priest in Peril"],
            skills: { "Ranged": 30, "Woodcutting": 35, "Crafting": 19, "Slayer": 18 }
        }
    },
    { name: "Creature of Fenkenstrain" },
    {
        name: "Big Chompy Bird Hunting",
        requirements: {
            skills: { "Ranged": 30, "Cooking": 30, "Fletching": 5 }
        }
    },
    { name: "Jungle Potion" },
    {
        name: "Shilo Village",
        requirements: {
            quests: ["Jungle Potion"],
            skills: { "Crafting": 20, "Agility": 32 }
        }
    },
    {
        name: "Zogre Flesh Eaters",
        requirements: {
            quests: ["Big Chompy Bird Hunting"],
            skills: { "Ranged": 30, "Smithing": 4, "Herblore": 8 }
        }
    },
    { name: "Observatory Quest" },
    {
        name: "Spirits of the Elid",
        requirements: {
            skills: { "Magic": 33, "Ranged": 37, "Mining": 37, "Thieving": 37 }
        }
    },
    { name: "Garden of Tranquillity" },
    { name: "Enlightened Journey" },
    { name: "Tears of Guthix" },
    {
        name: "In Search of the Myreque",
        requirements: {
            quests: ["Nature Spirit"],
            skills: { "Agility": 25 }
        }
    },
    { name: "Shades of Mort'ton" },
    {
        name: "In Aid of the Myreque",
        requirements: {
            quests: ["In Search of the Myreque"],
            skills: { "Magic": 7, "Crafting": 25, "Mining": 15 }
        }
    },
    { name: "Skippy and the Mogres" },
    {
        name: "Troll Stronghold",
        requirements: {
            skills: { "Agility": 15 }
        }
    },
    {
        name: "Troll Romance",
        requirements: {
            quests: ["Troll Stronghold"],
            skills: { "Agility": 28 }
        }
    },
    {
        name: "Darkness of Hallowvale",
        requirements: {
            quests: ["In Aid of the Myreque"],
            skills: { "Construction": 5, "Mining": 20, "Thieving": 22, "Agility": 26, "Magic": 32, "Crafting": 32 }
        }
    },

    // === INTERMEDIATE TO ADVANCED ===
    {
        name: "Underground Pass",
        requirements: {
            quests: ["Biohazard"],
            skills: { "Ranged": 25 }
        }
    },
    {
        name: "Regicide",
        requirements: {
            quests: ["Underground Pass"],
            skills: { "Agility": 56 }
        }
    },
    {
        name: "Dragon Slayer I",
        requirements: {
            quests: ["Rune Mysteries"],
            skills: { "Magic": 33 }
        }
    },
    {
        name: "The Fremennik Trials",
        requirements: {
            skills: { "Fletching": 25, "Woodcutting": 40 }
        }
    },
    {
        name: "The Fremennik Isles",
        requirements: {
            quests: ["The Fremennik Trials"],
            skills: { "Construction": 20, "Agility": 40, "Woodcutting": 56 }
        }
    },
    { name: "Recipe for Disaster/Freeing Evil Dave" },
    { name: "Recipe for Disaster/Freeing Pirate Pete" },
    {
        name: "Tai Bwo Wannai Trio",
        requirements: {
            quests: ["Jungle Potion"],
            skills: { "Agility": 15, "Cooking": 30, "Fishing": 65 }
        }
    },
    {
        name: "Contact!",
        requirements: {
            skills: { "Magic": 18 }
        }
    },
    {
        name: "Temple of Ikov",
        requirements: {
            skills: { "Ranged": 40, "Thieving": 42 }
        }
    },
    { name: "The Eyes of Glouphrie" },
    { name: "Temple of the Eye" },
    { name: "One Small Favour" },
    { name: "The Ascent of Arceuus" },
    { name: "Tale of the Righteous" },
    { name: "The Forsaken Tower" },
    {
        name: "Between a Rock...",
        requirements: {
            quests: ["Fishing Contest", "Dwarf Cannon"],
            skills: { "Defence": 30, "Mining": 40, "Smithing": 50 }
        }
    },
    {
        name: "The Slug Menace",
        requirements: {
            quests: ["Wanted!", "Sea Slug"],
            skills: { "Runecraft": 30, "Thieving": 30, "Crafting": 30 }
        }
    },
    { name: "Getting Ahead" },
    { name: "Cold War" },
    { name: "The Hand in the Sand" },
    {
        name: "Enakhra's Lament",
        requirements: {
            skills: { "Crafting": 50, "Firemaking": 45, "Prayer": 43, "Magic": 39, "Mining": 45 }
        }
    },
    {
        name: "Eadgar's Ruse",
        requirements: {
            quests: ["Troll Stronghold", "Druidic Ritual"],
            skills: { "Agility": 31, "Herblore": 31 }
        }
    },
    {
        name: "My Arm's Big Adventure",
        requirements: {
            quests: ["Eadgar's Ruse", "The Feud"],
            skills: { "Farming": 29, "Woodcutting": 10 }
        }
    },
    { name: "The Garden of Death" },
    { name: "Rag and Bone Man II" },
    {
        name: "Rum Deal",
        requirements: {
            quests: ["Zogre Flesh Eaters", "Priest in Peril"],
            skills: { "Farming": 40, "Fishing": 50, "Prayer": 47, "Crafting": 42, "Slayer": 42 }
        }
    },
    {
        name: "Cabin Fever",
        requirements: {
            quests: ["Rum Deal", "Pirate's Treasure"],
            skills: { "Agility": 42, "Crafting": 45, "Smithing": 50 }
        }
    },
    { name: "Meat and Greet" },
    { name: "Recipe for Disaster/Freeing the Lumbridge Guide" },
    { name: "Recipe for Disaster/Freeing Skrach Uglogwee" },
    {
        name: "Heroes' Quest",
        requirements: {
            quests: ["Shield of Arrav", "Merlin's Crystal", "Dragon Slayer I"],
            skills: { "Quest Points": 55, "Cooking": 53, "Fishing": 53, "Herblore": 25, "Mining": 50 }
        }
    },
    {
        name: "Throne of Miscellania",
        requirements: {
            quests: ["Heroes' Quest", "The Fremennik Trials"]
        }
    },
    {
        name: "Royal Trouble",
        requirements: {
            quests: ["Throne of Miscellania"],
            skills: { "Agility": 40, "Slayer": 40 }
        }
    },
    {
        name: "Haunted Mine",
        requirements: {
            skills: { "Agility": 15, "Crafting": 35 }
        }
    },
    { name: "Lair of Tarn Razorlor" },
    {
        name: "Monkey Madness I",
        requirements: {
            quests: ["The Grand Tree", "Tree Gnome Village"],
            skills: { "Prayer": 43, "Combat Level": 60 }
        }
    },
    { name: "Ethically Acquired Antiquities" },
    { name: "Twilight's Promise" },
    {
        name: "Roving Elves",
        requirements: {
            quests: ["Regicide"],
            skills: { "Agility": 56 }
        }
    },
    {
        name: "Mourning's End Part I",
        requirements: {
            quests: ["Roving Elves"],
            skills: { "Ranged": 60, "Thieving": 50 }
        }
    },
    {
        name: "Mourning's End Part II",
        requirements: {
            quests: ["Mourning's End Part I"],
            skills: { "Agility": 60, "Thieving": 50 }
        }
    },

    // === GRANDMASTER & ENDGAME QUESTS ===
    {
        name: "Desert Treasure I",
        requirements: {
            quests: ["The Dig Site", "Temple of Ikov", "The Tourist Trap", "Troll Stronghold", "Death Plateau", "Priest in Peril"],
            skills: { "Thieving": 53, "Firemaking": 50, "Magic": 50, "Slayer": 10 }
        }
    },
    {
        name: "Family Crest",
        requirements: {
            quests: ["Heroes' Quest"],
            skills: { "Magic": 59, "Smithing": 40, "Mining": 40, "Crafting": 40 }
        }
    },
    {
        name: "What Lies Below",
        requirements: {
            skills: { "Runecraft": 35 }
        }
    },
    {
        name: "Eagles' Peak",
        requirements: {
            skills: { "Hunter": 27 }
        }
    },
    { name: "A Tail of Two Cats" },
    {
        name: "Legends' Quest",
        requirements: {
            quests: ["Family Crest", "Heroes' Quest", "Shilo Village", "Underground Pass"],
            skills: { "Quest Points": 107, "Agility": 50, "Crafting": 50, "Herblore": 45, "Magic": 56, "Mining": 52, "Prayer": 42, "Smithing": 50, "Strength": 50, "Thieving": 50, "Woodcutting": 50 }
        }
    },
    { name: "Land of the Goblins" },
    { name: "Recipe for Disaster/Freeing Sir Amik Varze" },
    { name: "Olaf's Quest" },
    { name: "A Kingdom Divided" },
    {
        name: "A Taste of Hope",
        requirements: {
            quests: ["Darkness of Hallowvale"],
            skills: { "Agility": 48, "Attack": 40, "Crafting": 38, "Herblore": 40, "Slayer": 38 }
        }
    },
    { name: "At First Light" },
    { name: "Curse of the Empty Lord" },
    { name: "The General's Shadow" },
    { name: "His Faithful Servants" },
    {
        name: "The Great Brain Robbery",
        requirements: {
            quests: ["Cabin Fever", "Creature of Fenkenstrain"],
            skills: { "Crafting": 16, "Construction": 30, "Prayer": 50 }
        }
    },
    { name: "Scrambled!" },
    {
        name: "Fairytale II - Cure a Queen",
        requirements: {
            quests: ["Fairytale I - Growing Pains"],
            skills: { "Herblore": 57, "Farming": 49, "Thieving": 40 }
        }
    },
    { name: "Recipe for Disaster/Freeing King Awowogei" },
    { name: "Recipe for Disaster/Defeating the Culinaromancer" },
    { name: "Perilous Moons" },
    { name: "The Path of Glouphrie" },
    { name: "The Heart of Darkness" },
    {
        name: "Lunar Diplomacy",
        requirements: {
            quests: ["The Fremennik Trials", "Lost City", "Rune Mysteries", "Shilo Village"],
            skills: { "Magic": 65, "Mining": 60, "Woodcutting": 55, "Firemaking": 49, "Crafting": 61, "Defence": 40 }
        }
    },
    {
        name: "King's Ransom",
        requirements: {
            quests: ["Black Knights' Fortress", "Holy Grail", "Murder Mystery", "One Small Favour"],
            skills: { "Magic": 45 }
        }
    },
    { name: "Knight Waves Training Grounds" },
    {
        name: "Swan Song",
        requirements: {
            quests: ["One Small Favour", "Garden of Tranquillity"],
            skills: { "Magic": 66, "Cooking": 62, "Fishing": 62, "Smithing": 45, "Firemaking": 42 }
        }
    },
    { name: "Below Ice Mountain" },
    {
        name: "Defender of Varrock",
        requirements: {
            quests: ["What Lies Below"],
            skills: { "Hunter": 52, "Smithing": 55, "Agility": 40 }
        }
    },
    {
        name: "Devious Minds",
        requirements: {
            quests: ["Wanted!", "Troll Stronghold", "Doric's Quest"],
            skills: { "Runecraft": 50, "Fletching": 50, "Smithing": 65 }
        }
    },
    {
        name: "Grim Tales",
        requirements: {
            quests: ["Witch's House"],
            skills: { "Agility": 59, "Farming": 45, "Herblore": 52, "Thieving": 58, "Woodcutting": 71 }
        }
    },
    {
        name: "Dream Mentor",
        requirements: {
            quests: ["Lunar Diplomacy", "Eadgar's Ruse"],
            skills: { "Hitpoints": 85, "Combat Level": 85 }
        }
    },
    {
        name: "The Fremennik Exiles",
        requirements: {
            quests: ["The Fremennik Isles", "Lunar Diplomacy", "Heroes' Quest", "Mountain Daughter"],
            skills: { "Slayer": 60, "Crafting": 65, "Smithing": 60, "Fishing": 60, "Runecraft": 55 }
        }
    },
    {
        name: "Sins of the Father",
        requirements: {
            quests: ["A Taste of Hope"],
            skills: { "Woodcutting": 62, "Fletching": 60, "Crafting": 56, "Agility": 60, "Attack": 60, "Slayer": 62, "Magic": 60 }
        }
    },
    { name: "In Search of Knowledge" },
    { name: "Hopespear's Will" },
    {
        name: "Beneath Cursed Sands",
        requirements: {
            quests: ["Contact!", "Spirits of the Elid"],
            skills: { "Firemaking": 55, "Crafting": 55, "Agility": 62 }
        }
    },
    {
        name: "Monkey Madness II",
        requirements: {
            quests: ["Monkey Madness I", "Enlightened Journey", "The Eyes of Glouphrie", "Troll Stronghold"],
            skills: { "Slayer": 69, "Crafting": 70, "Hunter": 60, "Agility": 55, "Thieving": 55, "Firemaking": 60, "Magic": 55 }
        }
    },
    { name: "Into the Tombs" },
    {
        name: "A Night at the Theatre",
        requirements: {
            quests: ["Sins of the Father"],
            skills: { "Attack": 75, "Defence": 75, "Strength": 75, "Hitpoints": 75, "Magic": 75, "Ranged": 75 }
        }
    },
    { name: "Shadows of Custodia" },
    {
        name: "Dragon Slayer II",
        requirements: {
            quests: ["Dragon Slayer I", "Legends' Quest", "Dream Mentor", "A Taste of Hope", "Client of Kourend"],
            skills: { "Magic": 75, "Smithing": 70, "Mining": 68, "Crafting": 62, "Agility": 60, "Thieving": 60, "Construction": 50, "Hitpoints": 200, "Combat Level": 100 }
        }
    },
    { name: "The Curse of Arrav" },
    {
        name: "Making Friends with My Arm",
        requirements: {
            quests: ["My Arm's Big Adventure"],
            skills: { "Firemaking": 66, "Mining": 72, "Construction": 35 }
        }
    },
    { name: "Secrets of the North" },
    { name: "The Final Dawn" },
    {
        name: "While Guthix Sleeps",
        requirements: {
            quests: ["Dream Mentor", "King's Ransom", "Defender of Varrock", "The Hand in the Sand", "Devious Minds", "The Path of Glouphrie"],
            skills: { "Attack": 75, "Defence": 75, "Strength": 75, "Magic": 75, "Ranged": 75, "Thieving": 75, "Agility": 75, "Herblore": 65, "Farming": 65, "Hunter": 60, "Summoning": 23 }
        }
    },
    {
        name: "Desert Treasure II - The Fallen Empire",
        requirements: {
            quests: ["Desert Treasure I", "Beneath Cursed Sands", "The Curse of Arrav", "Sins of the Father", "Temple of the Eye"],
            skills: { "Firemaking": 75, "Magic": 75, "Thieving": 70, "Herblore": 62, "Runecraft": 60 }
        }
    },
    {
        name: "Song of the Elves",
        requirements: {
            quests: ["Mourning's End Part II"],
            skills: { "Agility": 70, "Construction": 70, "Farming": 70, "Herblore": 70, "Hunter": 70, "Mining": 70, "Smithing": 70, "Woodcutting": 70 }
        }
    },
    { name: "Clock Tower" },
    { name: "The Corsair Curse" }
];

/**
 * Quest list metadata
 */
export const questListInfo = {
    lastUpdated: "2025-08-23",
    totalQuests: quests.length,
    sourceUrl: "https://oldschool.runescape.wiki/w/Optimal_quest_guide",
    version: "2.0.0"
};
