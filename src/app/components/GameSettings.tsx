import React, { useEffect, useState } from "react";

import { Ranking } from "./Ranking";

interface GameSettingsProps {
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onStartGame }) => {
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !showRanking) {
        onStartGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onStartGame, showRanking]);

  return (
    <>
      {showRanking ? (
        <Ranking onClose={() => setShowRanking(false)} />
      ) : (
        <div id="settings" className="card">
          <div className="container">
            <div className="settings-section">
              <h2>- Typing Game -</h2>
              <p style={{ fontSize: "0.5em" }}>ビジネス用語をタイピングしてスコアを競おう！</p>
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              <button id="startButton" className="button" onClick={onStartGame}>
                タイピング開始
              </button>

              <button className="button bg-indigo-500 hover:bg-indigo-600" onClick={() => setShowRanking(true)}>
                ランキングを見る
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>スペースキーを押してゲーム開始</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
