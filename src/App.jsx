import React, { useState } from 'react';
import Game from './components/Game';
import WalletConnector from './components/WalletConnector';
import Leaderboard from './components/Leaderboard';
import './styles.css';

function App() {
  const [account, setAccount] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleGameStart = () => {
    if (account) {
      setGameStarted(true);
      setScore(0);
    }
  };

  const handleGameEnd = (finalScore) => {
    setGameStarted(false);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Crossy Fluffle</h1>
        <WalletConnector setAccount={setAccount} />
      </header>
      
      <div className="game-container">
        {!gameStarted ? (
          <div className="menu">
            <div className="score-display">
              <p>High Score: {highScore}</p>
              {account ? (
                <button onClick={handleGameStart}>Start Game</button>
              ) : (
                <p>Connect your wallet to play</p>
              )}
            </div>
            <Leaderboard />
          </div>
        ) : (
          <Game 
            account={account} 
            onGameEnd={handleGameEnd} 
            setScore={setScore}
          />
        )}
      </div>
    </div>
  );
}

export default App;