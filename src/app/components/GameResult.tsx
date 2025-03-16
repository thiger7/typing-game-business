import React, { useEffect, useState } from "react";

import { Ranking } from "@/app/components/Ranking";

import { registerRanking } from "../services/rankingService";
import { TypeStats } from "../types";
import { cp } from "fs";

interface GameResultProps {
  score: number;
  totalQuestions: number;
  typeStats: TypeStats;
  onRetry: () => void;
  onStartGame: () => void;
  onReturnToTitle: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  score,
  totalQuestions,
  typeStats,
  onRetry,
  onStartGame,
  onReturnToTitle,
}) => {
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        onRetry();
      } else if (event.code === "Escape") {
        console.log("ランキング画面を閉じます");
        setShowRanking(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRetry, onStartGame, onReturnToTitle]);

  // ランキングに登録する関数
  const handleRegisterRanking = async () => {
    if (!nickname.trim()) {
      setRegistrationError("ニックネームを入力してください");
      return;
    }

    // 5文字以内かどうかチェック
    if (nickname.trim().length > 5) {
      setRegistrationError("ニックネームは5文字以内で入力してください");
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
    <>
      {showRanking ? (
        <Ranking onClose={() => setShowRanking(false)} />
      ) : (
        <div id="endGame" className="card">
          <div className="result-container container">
            <div className="mb-4 pb-2 text-center">
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

            {/* ランキング登録フォーム - カスタムクラスをTailwindクラスに置き換え */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-3 text-lg font-bold">ランキングに登録する</h3>

              {!isRegistered ? (
                <>
                  <div className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="w-full md:w-2/3">
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="ニックネーム (5文字以内)"
                        disabled={isRegistering}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={5}
                      />
                      {registrationError && <p className="mt-1 text-sm text-red-500">{registrationError}</p>}
                      <p className="mt-1 text-xs text-gray-500">{nickname.length}/5文字</p>
                    </div>
                    <button onClick={handleRegisterRanking} disabled={isRegistering} className="button w-full md:w-1/3">
                      {isRegistering ? "登録中..." : "ランキングに登録"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    ※スコア、正確率、タイピング速度がランキングに登録されます
                  </p>
                </>
              ) : (
                <div className="py-2 text-center">
                  <p className="font-bold text-green-600">ランキングに登録しました！</p>
                  <p className="mt-1 text-sm">ニックネーム: {nickname}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <button id="retryButton" className="button" onClick={onRetry}>
                再チャレンジ
              </button>
              <button className="button" onClick={onReturnToTitle}>
                タイトルに戻る
              </button>
              <button className="button bg-indigo-500 hover:bg-indigo-600" onClick={() => setShowRanking(true)}>
                ランキングを見る
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
