import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Page2.css";

type Equipment =
  | "용사의 장비"
  | "반짝반짝 장비"
  | "평범한 장비"
  | "꼬마가 준 장비";

interface DiceResult {
  value: number;
}

const Page2: React.FC = () => {
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const equipments: Equipment[] = [
    "용사의 장비",
    "반짝반짝 장비",
    "평범한 장비",
    "꼬마가 준 장비",
  ];

  const rollDice = () => {
    setIsRolling(true);
    setSelectedEquipment(null);

    // 주사위 굴리기 애니메이션
    const rollInterval = setInterval(() => {
      setDiceResult({
        value: Math.floor(Math.random() * 6) + 1,
      });
    }, 100);

    // 2초 후 최종 결과 결정
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceResult({ value: finalValue });
      setIsRolling(false);
    }, 2000);
  };

  const isEquipmentSelectable = (equipment: Equipment): boolean => {
    if (!diceResult) return false;

    const value = diceResult.value;

    switch (equipment) {
      case "용사의 장비":
        return value === 6;
      case "반짝반짝 장비":
        return value >= 5;
      case "평범한 장비":
        return value >= 2;
      case "꼬마가 준 장비":
        return true; // 항상 선택 가능
      default:
        return false;
    }
  };

  const handleEquipmentSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  return (
    <div className="page2-container">
      <div className="equipment-selection-box">
        <h2>장비 선택</h2>

        {diceResult && (
          <div className="dice-result">
            <div className="dice-title">주사위 결과</div>
            <div className={`dice-value ${isRolling ? "rolling" : ""}`}>
              {isRolling ? "?" : diceResult.value}
            </div>
          </div>
        )}

        {!diceResult && (
          <button
            className="roll-button"
            onClick={rollDice}
            disabled={isRolling}
          >
            주사위 굴리기
          </button>
        )}

        {diceResult && !isRolling && !selectedEquipment && (
          <div className="equipment-list">
            {equipments.map((equipment) => (
              <button
                key={equipment}
                className={`equipment-button ${
                  !isEquipmentSelectable(equipment) ? "disabled" : ""
                }`}
                onClick={() => handleEquipmentSelect(equipment)}
                disabled={!isEquipmentSelectable(equipment)}
              >
                {equipment}
                {equipment === "꼬마가 준 장비" && (
                  <span className="always-available">(항상 선택 가능)</span>
                )}
              </button>
            ))}
          </div>
        )}

        {selectedEquipment && (
          <div className="selection-result">
            <p>선택된 장비: {selectedEquipment}</p>
            <Link
              to="/page3"
              className="next-button"
              state={{ selectedEquipment }}
            >
              다음으로
            </Link>
          </div>
        )}

        <div className="equipment-rules">
          <h3>주사위 규칙</h3>
          <ul>
            <li>6: 모든 장비 선택 가능</li>
            <li>5: 용사의 장비를 제외한 모든 장비</li>
            <li>2~4: 평범한 장비와 꼬마가 준 장비</li>
            <li>1: 꼬마가 준 장비만 선택 가능</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page2;
