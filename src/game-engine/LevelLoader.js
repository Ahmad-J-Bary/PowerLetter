// LevelLoader.js - Dynamically loads game levels from centralized data

import { game1Levels, game2Levels, game3Levels, gameStatus } from './LevelData.js';

class LevelLoader {
  constructor() {
    this.levels = new Map();
    this.loadedGames = new Set();
  }

  // Load all levels for a specific game type
  async loadGameLevels(gameType) {
    if (this.loadedGames.has(gameType)) {
      return this.getLevelsForGame(gameType);
    }

    try {
      let levels = [];
      
      // Load levels based on game type
      switch (gameType) {
        case 'game1':
          levels = [...game1Levels];
          break;
        case 'game2':
          levels = [...game2Levels];
          break;
        case 'game3':
          levels = [...game3Levels];
          break;
        default:
          console.warn(`Unknown game type: ${gameType}`);
          return [];
      }

      // Sort levels by ID
      levels.sort((a, b) => a.id - b.id);
      
      // Store levels in map
      this.levels.set(gameType, levels);
      this.loadedGames.add(gameType);
      
      return levels;
    } catch (error) {
      console.error(`Failed to load levels for ${gameType}:`, error);
      return [];
    }
  }

  // Get levels for a specific game
  getLevelsForGame(gameType) {
    return this.levels.get(gameType) || [];
  }

  // Get a specific level by game type and level ID
  getLevel(gameType, levelId) {
    const gameLevels = this.getLevelsForGame(gameType);
    return gameLevels.find(level => level.id === levelId);
  }

  // Get total number of levels for a game
  getLevelCount(gameType) {
    return this.getLevelsForGame(gameType).length;
  }

  // Check if a level exists
  hasLevel(gameType, levelId) {
    return this.getLevel(gameType, levelId) !== undefined;
  }
}

// Create singleton instance
const levelLoader = new LevelLoader();

export default levelLoader;

