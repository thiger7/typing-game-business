import React, { useEffect, useState } from "react";

import { getRankings } from "../services/rankingService";
import { RankingEntry } from "../types";

interface RankingProps {
  onClose: () => void;
}

export const Ranking: React.FC<RankingProps> = ({ onClose }) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRankings = () => {
      try {
        const data = getRankings();
        setRankings(data);
      } catch (error) {
        console.error("ランキングデータの読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // キーボードイベントの処理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="card">
      <div className="container">
        <div className="text-center mb-4">
          <h2>ランキング</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>ランキングデータを読み込み中...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-8">
            <p>ランキングデータがまだありません。</p>
            <p>プレイして最初のランキングに名前を刻みましょう！</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-sm">順位</th>
                  <th className="px-4 py-2 text-sm">ニックネーム</th>
                  <th className="px-4 py-2 text-sm">スコア</th>
                  <th className="px-4 py-2 text-sm">正確率</th>
                  <th className="px-4 py-2 text-sm">速度</th>
                  <th className="px-4 py-2 text-sm">日時</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2">
                      {index === 0 ? (
                        <span className="font-bold text-yellow-500 text-xl">🥇1位</span>
                      ) : index === 1 ? (
                        <span className="font-bold text-gray-400 text-xl">🥈2位</span>
                      ) : index === 2 ? (
                        <span className="font-bold text-amber-700 text-xl">🥉3位</span>
                      ) : (
                        `${index + 1}位`
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-xl">{entry.nickname}</td>
                    <td className="px-4 py-2 text-right font-bold text-xl">{entry.score}</td>
                    <td className="px-4 py-2 text-right text-xl">{entry.accuracy}%</td>
                    <td className="px-4 py-2 text-right text-xl">{entry.typingSpeed}</td>
                    <td className="px-4 py-2 text-right text-sm text-gray-600">{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-6">
          <button className="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
