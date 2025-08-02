import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Lock, Play, Puzzle, BookOpen, Search } from 'lucide-react';

const GameSelectScreen = ({ onGameSelect }) => {
  const games = [
    {
      id: 'game1',
      title: 'Word Formation Challenge',
      description: 'Find all possible words that can be formed from a given set of letters.',
      icon: <Puzzle className="w-8 h-8" />,
      status: 'coming_soon',
      features: ['Multiple word discovery', 'Progressive difficulty', 'Bilingual support']
    },
    {
      id: 'game2', 
      title: 'Category Word Guess',
      description: 'Guess the correct word based on clues from various categories.',
      icon: <BookOpen className="w-8 h-8" />,
      status: 'coming_soon',
      features: ['Topic-based clues', 'Multiple categories', 'Educational content']
    },
    {
      id: 'game3',
      title: 'Clue-Driven Word Find',
      description: 'Find the hidden word by unscrambling letters using the provided clue.',
      icon: <Search className="w-8 h-8" />,
      status: 'active',
      features: ['Scrambled letters', 'Helpful clues', 'Hint system']
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Power<span className="text-blue-600">Letter</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Challenge your mind with our collection of word puzzle games. 
            Choose your preferred game mode and start your linguistic adventure!
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                game.status === 'active' 
                  ? 'hover:scale-105 cursor-pointer border-blue-200' 
                  : 'opacity-75'
              }`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 text-blue-600">
                  {game.icon}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold text-left flex-1">
                    {game.title}
                  </CardTitle>
                  {getStatusBadge(game.status)}
                </div>
                <CardDescription className="text-sm text-gray-600 text-left">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {game.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => onGameSelect(game.id)}
                    disabled={game.status !== 'active'}
                    variant={game.status === 'active' ? 'default' : 'secondary'}
                  >
                    {game.status === 'active' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>More games and features coming soon! Stay tuned for updates.</p>
        </div>
      </div>
    </div>
  );
};

export default GameSelectScreen;

