// Game3Manager.js - Manages Game 3 (Clue-Driven Word Find) logic

class Game3Manager {
  constructor() {
    this.currentLevel = null;
    this.playerAnswer = '';
    this.hintsUsed = 0;
    this.isComplete = false;
    this.scrambledLetters = [];
  }

  // Initialize a new level
  initializeLevel(levelData) {
    this.currentLevel = levelData;
    this.playerAnswer = '';
    this.hintsUsed = 0;
    this.isComplete = false;
    this.scrambledLetters = this.shuffleLetters(levelData.scrambled_letters);
    return this.getGameState();
  }

  // Shuffle the letters for display
  shuffleLetters(lettersString) {
    const letters = lettersString.split(' ').filter(letter => letter.trim() !== '');
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }

  // Add a letter to the player's answer
  addLetter(letter) {
    if (this.isComplete) return this.getGameState();
    
    this.playerAnswer += letter;
    return this.getGameState();
  }

  // Remove the last letter from the player's answer
  removeLetter() {
    if (this.isComplete) return this.getGameState();
    
    this.playerAnswer = this.playerAnswer.slice(0, -1);
    return this.getGameState();
  }

  // Clear the entire answer
  clearAnswer() {
    if (this.isComplete) return this.getGameState();
    
    this.playerAnswer = '';
    return this.getGameState();
  }

  // Check if the current answer is correct
  checkAnswer() {
    if (!this.currentLevel) return false;
    
    const normalizedAnswer = this.playerAnswer.toLowerCase().trim();
    const normalizedSolution = this.currentLevel.solution.toLowerCase().trim();
    
    const isCorrect = normalizedAnswer === normalizedSolution;
    
    if (isCorrect) {
      this.isComplete = true;
    }
    
    return isCorrect;
  }

  // Get a hint (returns the next available hint)
  getHint() {
    if (!this.currentLevel || !this.currentLevel.hints) return null;
    
    if (this.hintsUsed < this.currentLevel.hints.length) {
      const hint = this.currentLevel.hints[this.hintsUsed];
      this.hintsUsed++;
      return hint;
    }
    
    return null;
  }

  // Show the solution
  showSolution() {
    if (!this.currentLevel) return null;
    
    this.playerAnswer = this.currentLevel.solution;
    this.isComplete = true;
    return this.currentLevel.solution;
  }

  // Get the current game state
  getGameState() {
    return {
      currentLevel: this.currentLevel,
      playerAnswer: this.playerAnswer,
      scrambledLetters: this.scrambledLetters,
      hintsUsed: this.hintsUsed,
      isComplete: this.isComplete,
      availableHints: this.currentLevel ? this.currentLevel.hints.length - this.hintsUsed : 0,
      canGetHint: this.currentLevel && this.hintsUsed < this.currentLevel.hints.length
    };
  }

  // Reset the game manager
  reset() {
    this.currentLevel = null;
    this.playerAnswer = '';
    this.hintsUsed = 0;
    this.isComplete = false;
    this.scrambledLetters = [];
  }

  // Get available letters (letters that haven't been used yet)
  getAvailableLetters() {
    if (!this.currentLevel) return [];
    
    const allLetters = this.currentLevel.scrambled_letters.split(' ').filter(letter => letter.trim() !== '');
    const usedLetters = this.playerAnswer.split('');
    
    return allLetters.filter(letter => {
      const letterCount = allLetters.filter(l => l === letter).length;
      const usedCount = usedLetters.filter(l => l === letter).length;
      return usedCount < letterCount;
    });
  }

  // Check if a letter can be used
  canUseLetter(letter) {
    const availableLetters = this.getAvailableLetters();
    return availableLetters.includes(letter);
  }
}

export default Game3Manager;

