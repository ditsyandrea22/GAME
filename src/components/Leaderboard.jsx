import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../utils/web3';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setScores(leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScores();
  }, []);

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol>
          {scores.map((entry, index) => (
            <li key={index}>
              <span className="address">{entry.address.substring(0, 6)}...{entry.address.substring(38)}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;