import React from "react";
import { Link } from "react-router-dom";

const GameScreen: React.FC = () => {
  return (
    <div className="game-screen">
      <h2>게임 화면</h2>
      <Link to="/" className="back-button">
        메인으로 돌아가기
      </Link>
    </div>
  );
};

export default GameScreen;
