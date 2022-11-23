import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

const BIRD_SIZE = 50;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 80;
const OBSTACLE_WIDTH = 80;
const OBSTACLE_GAP = 170;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(50);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition(birdPosition => birdPosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [gameHasStarted, birdPosition]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft(obstacleLeft => obstacleLeft - 8);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      if (gameHasStarted) {
        setScore(score => score + 1);
      }
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObstacle =
      birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle =
      birdPosition >= GAME_HEIGHT - bottomObstacleHeight - BIRD_SIZE &&
      birdPosition < GAME_HEIGHT - BIRD_SIZE;
    const hasCollidedWithBottom = birdPosition >= GAME_HEIGHT - BIRD_SIZE;

    if (hasCollidedWithBottom) {
      setGameHasStarted(false);
      setBirdPosition(250);

      setGameOver(true);
    }
    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
    ) {
      setGameHasStarted(false);

      setGameOver(true);
    }
  }, [birdPosition, obstacleLeft, obstacleHeight, bottomObstacleHeight]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else if (newBirdPosition < 0) {
      newBirdPosition = 0;
    } else {
      setBirdPosition(newBirdPosition);
    }
    if (gameOver) {
      setGameOver(false);
      setScoreBoard(scoreBoard => [...scoreBoard, score]);
      setScore(0);
    }
  };

  const scoreBoardOrdered = scoreBoard.sort((a, b) => b - a);

  return (
    <FullContent>
      <BigBox onClick={handleClick}>
        <Sky>
          <Obstacle
            top={0}
            width={OBSTACLE_WIDTH}
            height={obstacleHeight}
            left={obstacleLeft}
          />

          <Bird size={BIRD_SIZE} top={birdPosition} />
          <Obstacle
            top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
            width={OBSTACLE_WIDTH}
            height={bottomObstacleHeight}
            left={obstacleLeft}
          />
        </Sky>
        <span>{score}</span>
      </BigBox>
      <Board>
        <h1>Flappy Bird</h1>
        <p>Click to start</p>
        {scoreBoardOrdered.map((score, index) => {
          return (
            <p key={index}>
              {index + 1}°: {score}
            </p>
          );
        })}
      </Board>
    </FullContent>
  );
}

export default App;

const FullContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #f0f0f0;
`;

const Board = styled.div`
  width: ${GAME_WIDTH}px;
  height: ${GAME_HEIGHT}px;
  background-color: #000;
  margin-top: 40px;
  color: antiquewhite;
  padding: 5px;
`;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  top: ${props => props.top}px;
  border-radius: 50%;
`;

const Sky = styled.div`
  background-color: skyblue;
  width: ${GAME_WIDTH}px;
  height: ${GAME_HEIGHT}px;
  overflow: hidden;
`;

const BigBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  & span {
    font-size: 50px;
    color: white;
    position: absolute;
  }
`;

const Obstacle = styled.div`
  position: relative;
  background-color: green;
  height: ${props => props.height}px;
  width: ${OBSTACLE_WIDTH}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
`;
