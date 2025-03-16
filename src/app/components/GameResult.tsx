import React, { useEffect } from "react";
import { TypeStats } from "../types";

interface GameResultProps {
  score: number;
  totalQuestions: number;
  typeStats: TypeStats;
  onRetry: () => void;
  onReturnToTitle: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  score,
  totalQuestions,
  typeStats,
  onRetry,
  onReturnToTitle,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        onRetry();
      } else if (event.code === "Escape") {
        onReturnToTitle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRetry, onReturnToTitle]);

  return (
    <div id="endGame" className="card">
      <div className="container result-container">
        <div className="result-header">
          <h2>RESULT</h2>
        </div>

        <div className="total-score">
          <div className="score-label">YOUR SCORE</div>
          <div className="score-value">
            {score}
            <span style={{ fontSize: "0.5em" }}> 点</span>
          </div>
        </div>

        <div className="stats-container">
          <div className="stats-row">
            <div className="stats-item">
              <div className="stats-label">正確率</div>
              <div className="stats-value">{typeStats.accuracy}%</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">タイピング速度(文字/分)</div>
              <div className="stats-value">{typeStats.typingSpeed}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">成功数 / 全{totalQuestions}問</div>
              <div className="stats-value">{typeStats.wordsCompleted}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">最大コンボ</div>
              <div className="stats-value">{typeStats.maxCombo}</div>
            </div>
          </div>
        </div>

        <div className="result-sections">
          <div className="detailed-scores">
            <h3>詳細スコア</h3>
            <table className="score-details">
              <tbody>
                <tr>
                  <td>基本スコア</td>
                  <td>{typeStats.detailedScores.baseScore}</td>
                  <td>(正確にタイプした文字数)</td>
                </tr>
                <tr>
                  <td>コンボボーナス</td>
                  <td>{typeStats.detailedScores.comboBonus}</td>
                  <td>(最大コンボ: {typeStats.maxCombo})</td>
                </tr>
                <tr>
                  <td>スピードボーナス</td>
                  <td>{typeStats.detailedScores.speedBonus}</td>
                  <td>({typeStats.typingSpeed} 文字/分)</td>
                </tr>
                <tr>
                  <td>正確性ボーナス</td>
                  <td>{typeStats.detailedScores.accuracyBonus}</td>
                  <td>(正確率: {typeStats.accuracy}%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="typing-stats">
            <h3>入力統計</h3>
            <table className="score-details">
              <tbody>
                <tr>
                  <td>入力文字数</td>
                  <td>
                    <span className="highlight">{typeStats.totalTyped}</span>
                  </td>
                </tr>
                <tr>
                  <td>正確タイプ数</td>
                  <td>
                    <span className="highlight-success">
                      {typeStats.correctTyped}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>ミスタイプ数</td>
                  <td>
                    <span className="highlight-error">
                      {typeStats.mistakeTyped}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button id="retryButton" className="button" onClick={onRetry}>
          再チャレンジ
        </button>
      </div>
    </div>
  );
};
