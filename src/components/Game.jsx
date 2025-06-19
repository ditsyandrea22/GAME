import React, { useEffect, useRef, useState } from 'react';
import { initGame, startGameLoop, cleanUpGame } from '../utils/gameLogic';
import { recordScore } from '../utils/web3';
import UI from './UI'; // Make sure to import your UI component

const Game = ({ account, onGameEnd, setScore }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    // Load high score from localStorage or other persistence
    const savedHighScore = localStorage.getItem('highScore') || 0;
    setHighScore(parseInt(savedHighScore));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize game
    const gameState = initGame(canvas, ctx);
    
    // Start game loop
    const gameLoop = startGameLoop(
      canvas, 
      ctx, 
      gameState, 
      (newScore, newLives, newCoins, isPaused) => {
        setCurrentScore(newScore);
        setScore(newScore);
        setLives(newLives);
        setCoins(newCoins);
        setGamePaused(isPaused);
        
        // Update high score if current score exceeds it
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('highScore', newScore);
        }
      }, 
      () => {
        setGameOver(true);
        onGameEnd(gameState.score);
        if (account) {
          recordScore(account, gameState.score);
        }
      }
    );

    // Cleanup
    return () => {
      cleanUpGame(gameLoop, gameState);
    };
  }, [account, onGameEnd, setScore, highScore]);

  const togglePause = () => {
    setGamePaused(!gamePaused);
    // You'll need to implement pause functionality in your game loop
  };

  const handleRestart = () => {
    setGameOver(false);
    setCurrentScore(0);
    setLives(3);
    setCoins(0);
    onGameEnd(currentScore);
  };

  return (
    <div className="game-container">
      <div className="game">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600}
          tabIndex="0" // Make canvas focusable for keyboard events
        />
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-modal">
              <h2>Game Over!</h2>
              <p>Your Score: {currentScore}</p>
              <p>High Score: {highScore}</p>
              <button onClick={handleRestart}>Play Again</button>
            </div>
          </div>
        )}
      </div>
      
      <UI 
        account={account}
        score={currentScore}
        highScore={highScore}
        lives={lives}
        coins={coins}
        gamePaused={gamePaused}
        onPauseToggle={togglePause}
      />
    </div>
  );
};

export default Game;