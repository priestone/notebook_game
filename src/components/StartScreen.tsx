import React from "react";
import { Link } from "react-router-dom";
import { useRewards } from "../context/RewardsContext";
import "../styles/StartScreen.css";

const StartScreen: React.FC = () => {
  const { setRewards } = useRewards();

  const handleGameStart = () => {
    setRewards({
      hasHeart: false,
      hasChildCourage: false,
      canRerollEquipment: false,
      gameStartTime: Date.now(),
      gameEndTime: null,
      playTime: "00:00",
    });
  };

  return (
    <div className="start-screen">
      <h1 className="game-title">공책 게임</h1>
      <Link to="/page1" className="start-button" onClick={handleGameStart}>
        시작하기
      </Link>
    </div>
  );
};

export default StartScreen;
