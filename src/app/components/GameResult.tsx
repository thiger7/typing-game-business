import React, { useEffect, useState } from "react";

import { registerRanking } from "../services/rankingService";
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
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

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

  // ランキングに登録する関数
  const handleRegisterRanking = async () => {
    if (!nickname.trim()) {
      setRegistrationError("ニックネームを入力してください");
      return;
    }

    setIsRegistering(true);
    setRegistrationError("");

    try {
      // ランキングサービスを使用して登録
      await registerRanking({
        nickname: nickname.trim(),
        score,
        accuracy: typeStats.accuracy,
        typingSpeed: typeStats.typingSpeed,
      });

      setIsRegistered(true);
      console.log("ランキング登録成功:", { nickname, score, stats: typeStats });
    } catch (error) {
      setRegistrationError("ランキング登録に失敗しました。後でもう一度お試しください。");
      console.error("ランキング登録エラー:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div id="endGame" className="card">
      <div className="result-container container">
        <div className="text-center mb-4 pb-2">
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
                    <span className="highlight-success">{typeStats.correctTyped}</span>
                  </td>
                </tr>
                <tr>
                  <td>ミスタイプ数</td>
                  <td>
                    <span className="highlight-error">{typeStats.mistakeTyped}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ランキング登録フォーム */}
        <div className="ranking-registration mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold mb-3">ランキングに登録する</h3>

          {!isRegistered ? (
            <>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="w-full md:w-2/3">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="ニックネーム"
                    disabled={isRegistering}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={15}
                  />
                  {registrationError && <p className="text-red-500 text-sm mt-1">{registrationError}</p>}
                </div>
                <button onClick={handleRegisterRanking} disabled={isRegistering} className="button w-full md:w-1/3">
                  {isRegistering ? "登録中..." : "ランキングに登録"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">※スコア、正確率、タイピング速度がランキングに登録されます</p>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-green-600 font-bold">ランキングに登録しました！</p>
              <p className="text-sm mt-1">ニックネーム: {nickname}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button id="retryButton" className="button" onClick={onRetry}>
            再チャレンジ
          </button>
          <button className="button" onClick={onReturnToTitle}>
            タイトルに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
