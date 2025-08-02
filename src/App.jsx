import React, { useState } from 'react';
import GameSelectScreen from './views/GameSelectScreen.jsx';
import ClueGameScreen from './views/ClueGameScreen.jsx';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    
    // Navigate to the appropriate game screen
    switch (gameId) {
      case 'game3':
        setCurrentScreen('clue-game');
        break;
      case 'game1':
      case 'game2':
        // These games are not yet implemented, show coming soon message
        alert('This game is coming soon! Please try Game 3: Clue-Driven Word Find.');
        break;
      default:
        console.warn('Unknown game selected:', gameId);
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedGame(null);
  };

  // Render the appropriate screen based on current state
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <GameSelectScreen onGameSelect={handleGameSelect} />;
      case 'clue-game':
        return <ClueGameScreen onBack={handleBackToMenu} />;
      default:
        return <GameSelectScreen onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;

