import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Page1.css";

type Job = "전사" | "궁수" | "마법사" | "도적";

interface DiceResult {
  job: Job;
  value: number;
  isLowest: boolean;
}

const Page1: React.FC = () => {
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobs: Job[] = ["전사", "궁수", "마법사", "도적"];

  const rollDice = () => {
    setIsRolling(true);
    setSelectedJob(null);

    // 주사위 굴리기 애니메이션
    const rollInterval = setInterval(() => {
      const tempResults = jobs.map((job) => ({
        job,
        value: Math.floor(Math.random() * 6) + 1,
        isLowest: false,
      }));
      setDiceResults(tempResults);
    }, 100);

    // 2초 후 최종 결과 결정
    setTimeout(() => {
      clearInterval(rollInterval);

      // 최종 주사위 결과
      const finalResults = jobs.map((job) => ({
        job,
        value: Math.floor(Math.random() * 6) + 1,
        isLowest: false,
      }));

      // 최저값 찾기
      const minValue = Math.min(...finalResults.map((r) => r.value));

      // 모든 값이 같은지 확인
      const allSameValue = finalResults.every(
        (r) => r.value === finalResults[0].value
      );

      // 최저값 표시 및 선택 가능 여부 설정
      const resultsWithLowest = finalResults.map((result) => ({
        ...result,
        isLowest: !allSameValue && result.value === minValue,
      }));

      setDiceResults(resultsWithLowest);
      setIsRolling(false);
    }, 2000);
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const isJobSelectable = (job: Job) => {
    const result = diceResults.find((r) => r.job === job);
    return result && !result.isLowest;
  };

  return (
    <div className="page1-container">
      <div className="job-selection-box">
        <h2>직업 선택</h2>

        <div className="dice-results">
          {diceResults.map((result) => (
            <div
              key={result.job}
              className={`dice-result ${result.isLowest ? "lowest" : ""} ${
                selectedJob === result.job ? "selected" : ""
              }`}
            >
              <div className="job-name">{result.job}</div>
              <div className={`dice-value ${isRolling ? "rolling" : ""}`}>
                {isRolling ? "?" : result.value}
              </div>
            </div>
          ))}
        </div>

        {!diceResults.length && (
          <button
            className="roll-button"
            onClick={rollDice}
            disabled={isRolling}
          >
            주사위 굴리기
          </button>
        )}

        {diceResults.length > 0 && !isRolling && !selectedJob && (
          <div className="job-buttons">
            {jobs.map((job) => (
              <button
                key={job}
                className={`job-button ${
                  !isJobSelectable(job) ? "disabled" : ""
                }`}
                onClick={() => handleJobSelect(job)}
                disabled={!isJobSelectable(job)}
              >
                {job} 선택
              </button>
            ))}
          </div>
        )}

        {selectedJob && (
          <div className="selection-result">
            <p>선택된 직업: {selectedJob}</p>
            <Link to="/page2" className="next-button">
              다음으로
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page1;
