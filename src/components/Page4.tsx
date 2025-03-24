import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRewards } from "../context/RewardsContext";
import "../styles/Page4.css";
import bagImage from "../assets/bag.jpg";

interface LocationState {
  equipment?: string;
}

const Page4: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const equipment = state?.equipment || "평범한 장비";

  const { rewards, setRewards } = useRewards();
  const [showStory, setShowStory] = useState(true);
  const [showBags, setShowBags] = useState(false);
  const [selectedBag, setSelectedBag] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [reward, setReward] = useState<string>("");
  const [additionalMessage, setAdditionalMessage] = useState<string>("");
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [newEquipment, setNewEquipment] = useState<string>("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [displayDiceValue, setDisplayDiceValue] = useState<number | null>(null);

  const rewardOptions = ["하트", "꼬마의 용기", "장비 다시뽑기"];

  const handleConfirm = () => {
    setShowStory(false);
    setShowBags(true);
  };

  const handleNextPage = () => {
    // 장비 다시뽑기의 경우 새로운 장비를 가지고 이동
    if (reward === "장비 다시뽑기" && newEquipment) {
      navigate("/page5", { state: { equipment: newEquipment } });
    } else {
      navigate("/page5", { state: { equipment } });
    }
  };

  const rollDiceForEquipment = () => {
    setIsRolling(true);
    setDisplayDiceValue(null);

    // 주사위 굴리기 애니메이션 동안 임시 값 표시
    const rollInterval = setInterval(() => {
      setDisplayDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // 2초 후 최종 결과 표시
    setTimeout(() => {
      clearInterval(rollInterval);
      setIsRolling(false);

      const value = Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      setDisplayDiceValue(value);

      // 현재 장비를 제외한 나머지 장비들 중에서 선택
      const availableEquipments = [
        "용사의 장비",
        "반짝반짝 장비",
        "평범한 장비",
        "꼬마가 준 장비",
      ].filter((eq) => eq !== equipment);

      let selectedEquipment: string;
      if (value <= 2) {
        // 가장 하위 장비
        selectedEquipment = availableEquipments[availableEquipments.length - 1];
      } else if (value <= 4) {
        // 중간 장비
        selectedEquipment =
          availableEquipments[Math.floor(availableEquipments.length / 2)];
      } else {
        // 상위 장비
        selectedEquipment = availableEquipments[0];
      }

      setNewEquipment(selectedEquipment);
      setShowNextButton(true);
    }, 2000);
  };

  const handleBagSelect = (bagNumber: number) => {
    const randomIndex = Math.floor(Math.random() * rewardOptions.length);
    const selectedReward = rewardOptions[randomIndex];
    setReward(selectedReward);
    setSelectedBag(bagNumber);
    setShowResult(true);

    // 보상 상태 업데이트 및 추가 메시지 설정
    switch (selectedReward) {
      case "하트":
        setRewards({ ...rewards, hasHeart: true });
        setAdditionalMessage("전투에서의 체력이 1칸 늘어난다");
        setShowNextButton(true);
        break;
      case "꼬마의 용기":
        setRewards({ ...rewards, hasChildCourage: true });
        setAdditionalMessage("어디에 쓰는지 잘 모르겠다");
        setShowNextButton(true);
        break;
      case "장비 다시뽑기":
        setRewards({ ...rewards, canRerollEquipment: true });
        setShowDiceRoll(true);
        break;
    }
  };

  const getBagImage = (bagNumber: number) => {
    return bagImage;
  };

  return (
    <div className="page4-container">
      <div className="reward-box">
        <h2>보상 선택</h2>

        {showStory && (
          <div className="story-section">
            <div className="story-text">
              <p>
                근처 마을의 촌장이 몬스터를 처치해줘서 고맙다고 보상을 줍니다.
              </p>
              <p>3개의 보따리 중 하나를 골라주세요</p>
            </div>
            <button className="confirm-button" onClick={handleConfirm}>
              확인
            </button>
          </div>
        )}

        {showBags && !showResult && (
          <div className="bags-section">
            <div className="bags-container">
              {[1, 2, 3].map((bagNumber) => (
                <div
                  key={bagNumber}
                  className={`bag ${
                    selectedBag === bagNumber ? "selected" : ""
                  }`}
                  onClick={() => handleBagSelect(bagNumber)}
                >
                  <img
                    src={getBagImage(bagNumber)}
                    alt={`보따리 ${bagNumber}`}
                    className="bag-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {showResult && selectedBag && (
          <div className="result-section">
            <h3>선택한 보상</h3>
            <div className="reward-result">{reward}</div>
            {additionalMessage && (
              <div className="additional-message">{additionalMessage}</div>
            )}
            {showDiceRoll && !showNextButton && (
              <div className="dice-roll-section">
                <p>새로운 장비를 뽑기 위해 주사위를 굴립니다</p>
                <button
                  className={`roll-button ${isRolling ? "rolling" : ""}`}
                  onClick={rollDiceForEquipment}
                  disabled={isRolling}
                >
                  주사위 굴리기
                </button>
              </div>
            )}
            {displayDiceValue && (
              <div className={`dice-result ${isRolling ? "rolling" : ""}`}>
                <p>주사위: {displayDiceValue}</p>
                {!isRolling && <p>새로운 장비: {newEquipment}</p>}
              </div>
            )}
            {showNextButton && (
              <button className="next-button" onClick={handleNextPage}>
                다음으로
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page4;
