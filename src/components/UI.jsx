import React from 'react';
import { formatAddress } from '../utils/web3';

const UI = ({ account, score, highScore, lives, coins, gamePaused, onPauseToggle }) => {
  return (
    <div className="game-ui">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="wallet-info">
          {account ? (
            <span className="wallet-address">
              {formatAddress(account)}
            </span>
          ) : (
            <span className="wallet-not-connected">Not Connected</span>
          )}
        </div>
        
        <div className="score-display">
          <div className="score-item">
            <span className="label">Score:</span>
            <span className="value">{score}</span>
          </div>
          <div className="score-item">
            <span className="label">High Score:</span>
            <span className="value">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Lives and Coins */}
      <div className="status-bar">
        <div className="lives-display">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className={`life ${index < lives ? 'active' : 'inactive'}`}
            />
          ))}
        </div>
        
        <div className="coins-display">
          <span className="coins-icon">🪙</span>
          <span className="coins-count">{coins}</span>
        </div>
      </div>

      {/* Pause Menu */}
      {gamePaused && (
        <div className="pause-menu">
          <h2>Game Paused</h2>
          <button className="resume-button" onClick={onPauseToggle}>
            Resume
          </button>
          <button className="quit-button">
            Quit to Menu
          </button>
        </div>
      )}

      {/* Mobile Controls (only visible on mobile devices) */}
      <div className="mobile-controls">
        <div className="d-pad">
          <button className="control-btn up" onClick={() => {}}>↑</button>
          <div className="middle-row">
            <button className="control-btn left" onClick={() => {}}>←</button>
            <button className="control-btn right" onClick={() => {}}>→</button>
          </div>
          <button className="control-btn down" onClick={() => {}}>↓</button>
        </div>
        <div className="action-buttons">
          <button className="action-btn pause" onClick={onPauseToggle}>
            ⏸
          </button>
          <button className="action-btn jump">
            JUMP
          </button>
        </div>
      </div>
    </div>
  );
};

export default UI;