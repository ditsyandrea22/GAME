export const initGame = (canvas, ctx) => {
  // Game state
  const gameState = {
    player: {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 50,
      height: 50,
      speed: 5,
      jumping: false,
      jumpHeight: 100,
      jumpCount: 0
    },
    obstacles: [],
    score: 0,
    gameOver: false,
    keys: {},
    lastObstacleTime: 0,
    obstacleInterval: 2000,
    animationId: null
  };

  // Event listeners
  canvas.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;
  });

  canvas.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
  });

  // Focus canvas for keyboard events
  canvas.focus();

  return gameState;
};

export const startGameLoop = (canvas, ctx, gameState, onScoreUpdate, onGameEnd) => {
  // Game assets
  const playerImg = new Image();
  playerImg.src = '/assets/images/characters/player.png';
  
  const obstacleImgs = {
    car: new Image(),
    log: new Image(),
    water: new Image()
  };
  obstacleImgs.car.src = '/assets/images/obstacles/car.png';
  obstacleImgs.log.src = '/assets/images/obstacles/log.png';
  obstacleImgs.water.src = '/assets/images/obstacles/water.png';

  const backgroundImg = new Image();
  backgroundImg.src = '/assets/images/background.png';

  // Game functions
  const drawPlayer = () => {
    ctx.drawImage(
      playerImg,
      gameState.player.x - gameState.player.width / 2,
      gameState.player.y - gameState.player.height,
      gameState.player.width,
      gameState.player.height
    );
  };

  const drawObstacles = () => {
    gameState.obstacles.forEach(obstacle => {
      ctx.drawImage(
        obstacleImgs[obstacle.type],
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    });
  };

  const drawBackground = () => {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  };

  const drawScore = () => {
    ctx.fillStyle = 'white';
    ctx.font = '24px game-font';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
  };

  const updatePlayer = () => {
    // Movement
    if (gameState.keys['ArrowLeft'] && gameState.player.x > gameState.player.width / 2) {
      gameState.player.x -= gameState.player.speed;
    }
    if (gameState.keys['ArrowRight'] && gameState.player.x < canvas.width - gameState.player.width / 2) {
      gameState.player.x += gameState.player.speed;
    }
    if (gameState.keys['ArrowUp'] && !gameState.player.jumping) {
      gameState.player.jumping = true;
      gameState.player.jumpCount = 0;
    }

    // Jumping
    if (gameState.player.jumping) {
      const jumpProgress = gameState.player.jumpCount / gameState.player.jumpHeight;
      const jumpValue = Math.sin(jumpProgress * Math.PI) * 10;
      
      gameState.player.y -= jumpValue;
      gameState.player.jumpCount += 2;
      
      if (gameState.player.jumpCount >= gameState.player.jumpHeight) {
        gameState.player.jumping = false;
      }
    } else if (gameState.player.y < canvas.height - 100) {
      gameState.player.y += 5; // Gravity
    }
  };

  const updateObstacles = () => {
    const now = Date.now();
    
    // Add new obstacles
    if (now - gameState.lastObstacleTime > gameState.obstacleInterval) {
      const type = Math.random() > 0.5 ? 'car' : 'log';
      const obstacle = {
        type,
        x: type === 'car' ? canvas.width : -100,
        y: canvas.height - 150 + Math.random() * 50,
        width: type === 'car' ? 80 : 120,
        height: type === 'car' ? 50 : 30,
        speed: 3 + Math.random() * 3 * (1 + gameState.score / 100)
      };
      
      if (type === 'log') {
        obstacle.x = -obstacle.width;
      }
      
      gameState.obstacles.push(obstacle);
      gameState.lastObstacleTime = now;
      
      // Increase difficulty
      gameState.obstacleInterval = Math.max(500, 2000 - gameState.score * 10);
    }
    
    // Move obstacles
    gameState.obstacles.forEach((obstacle, index) => {
      if (obstacle.type === 'car') {
        obstacle.x -= obstacle.speed;
      } else {
        obstacle.x += obstacle.speed;
      }
      
      // Remove off-screen obstacles
      if (
        (obstacle.type === 'car' && obstacle.x + obstacle.width < 0) ||
        (obstacle.type === 'log' && obstacle.x > canvas.width)
      ) {
        gameState.obstacles.splice(index, 1);
        gameState.score += 1;
        onScoreUpdate(gameState.score);
      }
    });
  };

  const checkCollisions = () => {
    const player = gameState.player;
    
    // Check boundaries
    if (player.y > canvas.height - 50) {
      player.y = canvas.height - 50;
    }
    
    // Check obstacle collisions
    for (const obstacle of gameState.obstacles) {
      if (
        player.x + player.width / 2 > obstacle.x &&
        player.x - player.width / 2 < obstacle.x + obstacle.width &&
        player.y < obstacle.y + obstacle.height &&
        player.y - player.height > obstacle.y
      ) {
        gameState.gameOver = true;
        return;
      }
    }
  };

  // Game loop
  const gameLoop = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update game state
    if (!gameState.gameOver) {
      updatePlayer();
      updateObstacles();
      checkCollisions();
    }
    
    // Draw everything
    drawBackground();
    drawObstacles();
    drawPlayer();
    drawScore();
    
    // Continue loop or end game
    if (!gameState.gameOver) {
      gameState.animationId = requestAnimationFrame(gameLoop);
    } else {
      onGameEnd(gameState.score);
    }
  };
  
  // Start the game loop
  gameState.animationId = requestAnimationFrame(gameLoop);
  
  return gameLoop;
};

export const cleanUpGame = (gameLoop, gameState) => {
  cancelAnimationFrame(gameState.animationId);
  // Remove event listeners if needed
};