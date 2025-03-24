export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    health: number;
  };
  inventory: Item[];
  equipment: {
    weapon?: Item;
    armor?: Item;
    accessory?: Item;
  };
}

export interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory" | "consumable";
  description: string;
  stats?: {
    strength?: number;
    agility?: number;
    intelligence?: number;
    health?: number;
  };
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface GameState {
  character: Character;
  currentLocation: string;
  quests: Quest[];
  gold: number;
  day: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requirements: {
    level?: number;
    items?: Item[];
  };
  rewards: {
    experience: number;
    gold: number;
    items?: Item[];
  };
  isCompleted: boolean;
}
