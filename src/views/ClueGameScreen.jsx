import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  ArrowLeft, 
  Lightbulb, 
  Eye, 
  RotateCcw, 
  Delete, 
  CheckCircle, 
  XCircle,
  Trophy,
  Target
} from 'lucide-react';
import levelLoader from '../game-engine/LevelLoader.js';
import Game3Manager from '../game-engine/Game3Manager.js';

const ClueGameScreen = ({ onBack }) => {
  const [gameManager] = useState(() => new Game3Manager());
  const [gameState, setGameState] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Load levels on component mount
  useEffect(() => {
    const loadLevels = async () => {
      setLoading(true);
      try {
        const loadedLevels = await levelLoader.loadGameLevels('game3');
        setLevels(loadedLevels);
        if (loadedLevels.length > 0) {
          const initialState = gameManager.initializeLevel(loadedLevels[0]);
          setGameState(initialState);
        }
      } catch (error) {
        console.error('Failed to load levels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [gameManager]);

  // Handle letter click
  const handleLetterClick = (letter) => {
    if (gameState?.isComplete) return;
    
    if (gameManager.canUseLetter(letter)) {
      const newState = gameManager.addLetter(letter);
      setGameState(newState);
      setShowResult(false);
    }
  };

  // Handle removing last letter
  const handleRemoveLetter = () => {
    const newState = gameManager.removeLetter();
    setGameState(newState);
    setShowResult(false);
  };

  // Handle clearing answer
  const handleClearAnswer = () => {
    const newState = gameManager.clearAnswer();
    setGameState(newState);
    setShowResult(false);
    setShowHint(false);
  };

  // Handle checking answer
  const handleCheckAnswer = () => {
    if (!gameState?.playerAnswer) return;
    
    const correct = gameManager.checkAnswer();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const newState = gameManager.getGameState();
      setGameState(newState);
    }
  };

  // Handle getting hint
  const handleGetHint = () => {
    const hint = gameManager.getHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
      const newState = gameManager.getGameState();
      setGameState(newState);
    }
  };

  // Handle showing solution
  const handleShowSolution = () => {
    gameManager.showSolution();
    const newState = gameManager.getGameState();
    setGameState(newState);
    setIsCorrect(true);
    setShowResult(true);
  };

  // Handle next level
  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
      const newState = gameManager.initializeLevel(levels[nextIndex]);
      setGameState(newState);
      setShowResult(false);
      setShowHint(false);
      setCurrentHint('');
    }
  };

  // Handle level selection
  const handleLevelSelect = (index) => {
    setCurrentLevelIndex(index);
    const newState = gameManager.initializeLevel(levels[index]);
    setGameState(newState);
    setShowResult(false);
    setShowHint(false);
    setCurrentHint('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading levels...</p>
        </div>
      </div>
    );
  }

  if (!gameState || levels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No levels available</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  const currentLevel = gameState.currentLevel;
  const isRTL = currentLevel?.language === 'arabic';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Clue-Driven Word Find</h1>
            <p className="text-sm text-gray-600">Level {currentLevelIndex + 1} of {levels.length}</p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {levels.map((_, index) => (
              <Button
                key={index}
                variant={index === currentLevelIndex ? "default" : "outline"}
                size="sm"
                onClick={() => handleLevelSelect(index)}
                className="w-10 h-10 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="space-y-6">
          {/* Clue Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Clue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {currentLevel.clue}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  Difficulty: {currentLevel.difficulty}
                </Badge>
                <Badge variant="outline">
                  Language: {currentLevel.language}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Answer Area */}
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`min-h-16 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {gameState.playerAnswer ? (
                  <span className="text-2xl font-bold text-blue-600 tracking-wider">
                    {gameState.playerAnswer}
                  </span>
                ) : (
                  <span className="text-gray-400 text-lg">
                    Click letters below to form your answer...
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveLetter}
                  disabled={!gameState.playerAnswer || gameState.isComplete}
                >
                  <Delete className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearAnswer}
                  disabled={!gameState.playerAnswer || gameState.isComplete}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button 
                  onClick={handleCheckAnswer}
                  disabled={!gameState.playerAnswer || gameState.isComplete}
                >
                  Check Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scrambled Letters */}
          <Card>
            <CardHeader>
              <CardTitle>Available Letters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {gameState.scrambledLetters.map((letter, index) => {
                  const canUse = gameManager.canUseLetter(letter);
                  return (
                    <Button
                      key={index}
                      variant={canUse ? "outline" : "secondary"}
                      className={`w-12 h-12 text-xl font-bold ${
                        canUse ? 'hover:bg-blue-50 border-blue-300' : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => handleLetterClick(letter)}
                      disabled={!canUse || gameState.isComplete}
                    >
                      {letter}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Helper System */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleGetHint}
                  disabled={!gameState.canGetHint || gameState.isComplete}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint ({gameState.availableHints} left)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShowSolution}
                  disabled={gameState.isComplete}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Show Solution
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hint Display */}
          {showHint && currentHint && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
                <strong>Hint:</strong> {currentHint}
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {showResult && (
            <Alert className={isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              {isCorrect ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                {isCorrect ? (
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">
                      🎉 Correct! Well done!
                    </span>
                    {currentLevelIndex < levels.length - 1 && (
                      <Button size="sm" onClick={handleNextLevel}>
                        Next Level
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-red-700 font-medium">
                    Not quite right. Try again!
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Completion Message */}
          {gameState.isComplete && currentLevelIndex === levels.length - 1 && (
            <Alert className="border-yellow-500 bg-yellow-50">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <span className="text-yellow-700 font-medium">
                  🏆 Congratulations! You've completed all available levels!
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClueGameScreen;

