import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Page3.css";

interface LocationState {
  selectedEquipment?: string;
}

interface BattleState {
  playerHits: number;
  monsterHits: number;
  isPlayerTurn: boolean;
  isGameOver: boolean;
  playerWon: boolean;
  storyShown: boolean;
}

const Page3: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const equipment = state?.selectedEquipment || "평범한 장비";

  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isTurnTransitioning, setIsTurnTransitioning] = useState(false);
  const [battleState, setBattleState] = useState<BattleState>({
    playerHits: 0,
    monsterHits: 0,
    isPlayerTurn: true,
    isGameOver: false,
    playerWon: false,
    storyShown: false,
  });
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const getDiceRange = (equipment: string): [number, number] => {
    switch (equipment) {
      case "용사의 장비":
        return [3, 6];
      case "반짝반짝 장비":
        return [2, 6];
      case "꼬마가 준 장비":
        return [1, 4];
      default: // 평범한 장비
        return [1, 6];
    }
  };

  const rollDice = (): number => {
    const [min, max] = getDiceRange(equipment);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    setDiceValue(value);
    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
    }, 2000);

    return value;
  };

  const handlePlayerTurn = () => {
    const [min, max] = getDiceRange(equipment);
    const diceValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setDiceValue(diceValue);
    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
      setBattleLog((prev) => [...prev, `주사위: ${diceValue}`]);

      if (diceValue === 6) {
        setBattleLog((prev) => [...prev, "치명타! 몬스터를 처치했습니다!"]);
        setBattleState((prev) => ({
          ...prev,
          monsterHits: 2,
          isGameOver: true,
          playerWon: true,
        }));
      } else if (diceValue >= 3) {
        setBattleLog((prev) => [...prev, "공격 성공!"]);
        setBattleState((prev) => {
          const newHits = prev.monsterHits + 1;
          return {
            ...prev,
            monsterHits: newHits,
            isGameOver: newHits >= 2,
            playerWon: newHits >= 2,
          };
        });
        if (battleState.monsterHits + 1 >= 2) {
          setBattleLog((prev) => [...prev, "몬스터를 처치했다!"]);
        }
      } else {
        setBattleLog((prev) => [...prev, "공격 실패..."]);
      }

      setIsTurnTransitioning(true);
      setTimeout(() => {
        setBattleState((prev) => ({
          ...prev,
          isPlayerTurn: false,
        }));
        setIsTurnTransitioning(false);
      }, 1000);
    }, 2000);
  };

  const handleMonsterTurn = () => {
    const diceValue = Math.floor(Math.random() * 4) + 1;
    setDiceValue(diceValue);
    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
      setBattleLog((prev) => [...prev, `몬스터의 주사위: ${diceValue}`]);

      if (diceValue === 3 || diceValue === 4) {
        setBattleLog((prev) => [...prev, "몬스터의 공격 성공!"]);
        setBattleState((prev) => {
          const newHits = prev.playerHits + 1;
          return {
            ...prev,
            playerHits: newHits,
            isGameOver: newHits >= 2,
            playerWon: false,
          };
        });
        if (battleState.playerHits + 1 >= 2) {
          setBattleLog((prev) => [...prev, "당신은 패배했습니다..."]);
        }
      } else {
        setBattleLog((prev) => [...prev, "몬스터의 공격 실패!"]);
      }

      setIsTurnTransitioning(true);
      setTimeout(() => {
        setBattleState((prev) => ({
          ...prev,
          isPlayerTurn: true,
        }));
        setIsTurnTransitioning(false);
      }, 1000);
    }, 2000);
  };

  const handleRollClick = () => {
    if (isRolling || battleState.isGameOver || isTurnTransitioning) return;

    if (battleState.isPlayerTurn) {
      setBattleLog((prev) => [...prev, "당신의 턴입니다!"]);
      handlePlayerTurn();
    } else {
      setBattleLog((prev) => [...prev, "몬스터의 턴입니다!"]);
      handleMonsterTurn();
    }
  };

  const startBattle = () => {
    setBattleState((prev) => ({
      ...prev,
      storyShown: true,
    }));
  };

  return (
    <div className="page3-container">
      <div className="battle-box">
        <h2>몬스터와의 전투</h2>
        <div className="equipment-info">현재 장비: {equipment}</div>

        {!battleState.storyShown ? (
          <div className="story-section">
            <div className="story-text">
              <p>마을을 나온 용사는 마왕의 성으로 가던 중</p>
              <p>갑자기 나타난 몬스터와 조우했다!</p>
            </div>
            <button className="start-battle-button" onClick={startBattle}>
              전투 시작
            </button>
          </div>
        ) : (
          !battleState.isGameOver && (
            <>
              <div className="battle-status">
                <div className="health-status">
                  <span className="status-label">플레이어</span>
                  <div className="hearts">
                    {[...Array(2)].map((_, index) => (
                      <span
                        key={index}
                        className={`heart ${
                          index < 2 - battleState.playerHits ? "full" : "empty"
                        }`}
                      >
                        ♥️
                      </span>
                    ))}
                  </div>
                </div>
                <div className="health-status">
                  <span className="status-label">몬스터</span>
                  <div className="hearts">
                    {[...Array(2)].map((_, index) => (
                      <span
                        key={index}
                        className={`heart ${
                          index < 2 - battleState.monsterHits ? "full" : "empty"
                        }`}
                      >
                        ♥️
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="turn-info">
                {battleState.isPlayerTurn
                  ? "당신의 턴입니다!"
                  : "몬스터의 턴입니다!"}
              </div>

              {diceValue && (
                <div className="dice-result">
                  <div className="dice-title">
                    {battleState.isPlayerTurn ? "플레이어" : "몬스터"}의 주사위
                  </div>
                  <div className={`dice-value ${isRolling ? "rolling" : ""}`}>
                    {isRolling ? "?" : diceValue}
                  </div>
                </div>
              )}

              <button
                className="roll-button"
                onClick={handleRollClick}
                disabled={
                  isRolling || battleState.isGameOver || isTurnTransitioning
                }
              >
                주사위 굴리기
              </button>
            </>
          )
        )}

        <div className="battle-log">
          {battleLog.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>

        {battleState.isGameOver && (
          <div className="game-over">
            <h3>{battleState.playerWon ? "승리!" : "Game Over"}</h3>
            {battleState.playerWon ? (
              <Link to="/page4" className="next-button" state={{ equipment }}>
                다음으로
              </Link>
            ) : (
              <Link to="/" className="home-button">
                홈으로
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page3;
