import React from "react";
import { useNavigate } from "react-router-dom";
import { useRewards } from "../context/RewardsContext";
import "../styles/Ending.css";

const Ending: React.FC = () => {
  const navigate = useNavigate();
  const { rewards } = useRewards();

  return (
    <div className="ending-container">
      <div className="ending-content">
        <h1>축하합니다!</h1>
        <div className="play-time">클리어 시간: {rewards.playTime}</div>
        <div className="ending-message">
          지금까지 추억이 깃든 공책게임 이었습니다.
          <br />
          자신의 운을 시험해 기록을 단축해보세요!
        </div>
        <div className="hidden-ending-hint">
          게임 내 히든엔딩이 숨겨져있습니다.
        </div>
        <button className="home-button" onClick={() => navigate("/")}>
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default Ending;
