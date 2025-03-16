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
    const loadRankings = async () => {
      try {
        // ランキングデータを取得して上位10位までに制限
        const allRankings = await getRankings();
        const top10Rankings = allRankings.slice(0, 10);
        setRankings(top10Rankings);
        console.log("ランキングデータを読み込みました:", top10Rankings);
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
        <div className="mb-4 text-center">
          <h2>ランキング TOP 10</h2>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <p>ランキングデータを読み込み中...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="py-8 text-center">
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
                  <tr key={entry.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-slate-100"}>
                    <td className="px-4 py-2">
                      {index === 0 ? (
                        <span className="text-xl font-bold text-yellow-500">🥇1位</span>
                      ) : index === 1 ? (
                        <span className="text-xl font-bold text-gray-400">🥈2位</span>
                      ) : index === 2 ? (
                        <span className="text-xl font-bold text-amber-700">🥉3位</span>
                      ) : (
                        <span className="text-xl">{`${index + 1}位`}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xl font-medium">{entry.nickname}</td>
                    <td className="px-4 py-2 text-right text-xl font-bold">{entry.score}</td>
                    <td className="px-4 py-2 text-right text-xl">{entry.accuracy}%</td>
                    <td className="px-4 py-2 text-right text-xl">{entry.typingSpeed}</td>
                    <td className="px-4 py-2 text-right text-sm text-gray-600">{formatDate(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <button className="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
