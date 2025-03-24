import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRewards } from "../context/RewardsContext";
import "../styles/Page5.css";

interface LocationState {
  equipment?: string;
}

interface BattleState {
  playerHealth: number;
  monsterHealth: number;
  isPlayerTurn: boolean;
  isGameOver: boolean;
  playerWon: boolean;
  storyShown: boolean;
}

interface BattleLog {
  message: string;
  timestamp: number;
}

const Page5: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const equipment = state?.equipment || "평범한 장비";
  const { rewards, setRewards } = useRewards();

  // 히든 이벤트 조건 체크
  const hasHiddenEvent =
    equipment === "꼬마가 준 장비" && rewards.hasChildCourage;

  // 초기 체력 설정
  const initialPlayerHealth = rewards.hasHeart ? 3 : 2;

  const [battleState, setBattleState] = useState<BattleState>({
    playerHealth: initialPlayerHealth,
    monsterHealth: 3,
    isPlayerTurn: true,
    isGameOver: false,
    playerWon: false,
    storyShown: false,
  });

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayDiceValue, setDisplayDiceValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string | JSX.Element>("");
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);

  const addBattleLog = (message: string) => {
    setBattleLog((prev) =>
      [{ message, timestamp: Date.now() }, ...prev].slice(0, 8)
    );
  };

  // 장비별 주사위 범위 설정
  const getDiceRange = () => {
    switch (equipment) {
      case "용사의 장비":
        return Array.from({ length: 4 }, (_, i) => i + 3); // [3,4,5,6]
      case "반짝반짝 장비":
        return Array.from({ length: 5 }, (_, i) => i + 2); // [2,3,4,5,6]
      case "꼬마가 준 장비":
        return Array.from({ length: 4 }, (_, i) => i + 1); // [1,2,3,4]
      default: // 평범한 장비
        return Array.from({ length: 6 }, (_, i) => i + 1); // [1,2,3,4,5,6]
    }
  };

  const rollDice = (isPlayer: boolean) => {
    if (isPlayer) {
      const range = getDiceRange();
      return range[Math.floor(Math.random() * range.length)];
    } else {
      return Math.floor(Math.random() * 6) + 1; // 마왕은 1-6
    }
  };

  const startBattle = () => {
    setBattleState((prev) => ({ ...prev, storyShown: true }));
    setMessage("당신의 턴입니다!");
    addBattleLog("전투가 시작되었습니다!");
  };

  const handleDiceRoll = () => {
    if (isRolling || battleState.isGameOver) return;

    setIsRolling(true);
    setDisplayDiceValue(null);
    setMessage("");

    // 주사위 굴리기 애니메이션
    const rollInterval = setInterval(() => {
      setDisplayDiceValue(rollDice(battleState.isPlayerTurn));
    }, 100);

    // 2초 후 결과 표시
    setTimeout(() => {
      clearInterval(rollInterval);
      setIsRolling(false);

      const value = rollDice(battleState.isPlayerTurn);
      setDiceValue(value);
      setDisplayDiceValue(value);

      if (battleState.isPlayerTurn) {
        handlePlayerTurn(value);
      } else {
        handleMonsterTurn(value);
      }
    }, 2000);
  };

  const calculatePlayTime = () => {
    if (!rewards.gameStartTime) return "00:00";

    const endTime = Date.now();
    const playTimeInSeconds = Math.floor(
      (endTime - rewards.gameStartTime) / 1000
    );
    const minutes = Math.floor(playTimeInSeconds / 60);
    const seconds = playTimeInSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayerTurn = (value: number) => {
    let newState = { ...battleState };
    let logMessage = `플레이어의 주사위: ${value}`;

    if (hasHiddenEvent) {
      // 히든 이벤트 발동
      newState.monsterHealth = 0;
      newState.isGameOver = true;
      newState.playerWon = true;
      setMessage(
        <span className="hidden-event-message">
          꼬마의 순수한 마음이 마왕의 심장을 울렸다!
          <br />
          마왕이 더 이상 싸울 수 없게 되었다!
        </span>
      );
      logMessage =
        "꼬마의 장비와 용기가 만나 특별한 힘을 발휘했다! 마왕이 감화되어 물러났다!";
      addBattleLog(logMessage);
    } else {
      if (value === 6) {
        newState.monsterHealth -= 2;
        setMessage("플레이어의 크리티컬 공격! 마왕의 체력이 2칸 감소했습니다!");
        logMessage += " - 크리티컬 공격! 마왕의 체력 2 감소";
      } else if (value >= 3 && value <= 5) {
        newState.monsterHealth -= 1;
        setMessage("플레이어의 공격이 성공했습니다!");
        logMessage += " - 공격 성공! 마왕의 체력 1 감소";
      } else {
        setMessage("플레이어의 공격이 빗나갔습니다!");
        logMessage += " - 공격 실패";
      }

      addBattleLog(logMessage);

      // 게임 종료 조건 체크
      if (newState.monsterHealth <= 0) {
        newState.isGameOver = true;
        newState.playerWon = true;
        setMessage("축하합니다! 마왕을 물리쳤습니다!");
        addBattleLog("플레이어가 마왕을 물리쳤습니다!");
      } else {
        newState.isPlayerTurn = false;
        setTimeout(() => {
          setMessage("마왕의 턴입니다!");
        }, 1500);
      }
    }

    setBattleState(newState);
  };

  const handleMonsterTurn = (value: number) => {
    let newState = { ...battleState };
    let logMessage = `마왕의 주사위: ${value}`;

    if (value === 6) {
      newState.playerHealth -= 2;
      setMessage("마왕의 크리티컬 공격! 플레이어의 체력이 2칸 감소했습니다!");
      logMessage += " - 크리티컬 공격! 플레이어의 체력 2 감소";
    } else if (value >= 3 && value <= 5) {
      newState.playerHealth -= 1;
      setMessage("마왕의 공격이 성공했습니다!");
      logMessage += " - 공격 성공! 플레이어의 체력 1 감소";
    } else {
      setMessage("마왕의 공격이 빗나갔습니다!");
      logMessage += " - 공격 실패";
    }

    addBattleLog(logMessage);

    // 게임 종료 조건 체크
    if (newState.playerHealth <= 0) {
      newState.isGameOver = true;
      newState.playerWon = false;
      setMessage("마왕에게 패배했습니다...");
      addBattleLog("플레이어가 마왕에게 패배했습니다...");
    } else {
      newState.isPlayerTurn = true;
      setTimeout(() => {
        setMessage("당신의 턴입니다!");
      }, 1500);
    }

    setBattleState(newState);
  };

  const handleGameOver = () => {
    const endTime = Date.now();
    const playTime = calculatePlayTime();

    setRewards((prev) => ({
      ...prev,
      gameEndTime: endTime,
      playTime: playTime,
    }));

    if (battleState.playerWon) {
      navigate("/ending");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page5-container">
      <div className="battle-box">
        {!battleState.storyShown ? (
          <div className="story-section">
            <div className="story-text">
              <p>마을을 지나 어느덧 마왕의 성까지 도달했다.</p>
              {hasHiddenEvent && (
                <p className="hidden-event-text">
                  꼬마의 순수한 마음이 가슴 속에서 반짝인다...
                </p>
              )}
            </div>
            <button className="battle-start-button" onClick={startBattle}>
              전투 개시
            </button>
          </div>
        ) : (
          <>
            <h2>마왕과의 전투</h2>
            <div className="equipment-info">현재 장비: {equipment}</div>
            <div className="battle-status">
              <div className="health-status">
                <span>플레이어 체력: </span>
                <div className="hearts">
                  {Array.from({ length: initialPlayerHealth }).map((_, i) => (
                    <span
                      key={i}
                      className={`heart ${
                        i >= battleState.playerHealth ? "empty" : "full"
                      }`}
                    >
                      {i >= battleState.playerHealth ? "♡" : "❤️"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="health-status">
                <span>마왕 체력: </span>
                <div className="hearts">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={`heart ${
                        i >= battleState.monsterHealth ? "empty" : "full"
                      }`}
                    >
                      {i >= battleState.monsterHealth ? "♡" : "❤️"}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {message && <div className="battle-message">{message}</div>}

            {!battleState.isGameOver ? (
              <div className="dice-section">
                <button
                  className={`roll-button ${isRolling ? "rolling" : ""}`}
                  onClick={handleDiceRoll}
                  disabled={isRolling}
                >
                  주사위 굴리기
                </button>
                {displayDiceValue && (
                  <div className={`dice-result ${isRolling ? "rolling" : ""}`}>
                    주사위: {displayDiceValue}
                  </div>
                )}
              </div>
            ) : (
              <button className="game-over-button" onClick={handleGameOver}>
                {battleState.playerWon ? "엔딩 보기" : "처음으로"}
              </button>
            )}

            <div className="battle-log">
              <h3>전투 기록</h3>
              <div className="log-entries">
                {battleLog.map((log, index) => (
                  <div key={log.timestamp} className="log-entry">
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page5;
