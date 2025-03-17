"use client";

import React from "react";

import "./App.css";

import { GamePlay } from "./components/GamePlay";
import { GameResult } from "./components/GameResult";
import { GameSettings } from "./components/GameSettings";
import { Header } from "./components/Header";
import { useTypingGame } from "./hooks/useTypingGame";

export default function Home() {
  const { gameState, typeStats, startGame, handleInputChange, resetGame, handleRetry } = useTypingGame();

  const {
    currentWord,
    userInput,
    mistakeCount,
    timeLeft,
    wordTimeLimit,
    wordTimeLeft,
    score,
    isGameStarted,
    isGameOver,
    lastMistakeChar,
  } = gameState;

  const onReturnToTitle = () => {
    resetGame();
  };

  return (
    <div id="gameContainer" className="container mx-auto max-w-4xl px-4 py-8">
      <Header />

      {/* ゲーム設定画面 */}
      {!isGameStarted && !isGameOver && <GameSettings onStartGame={startGame} />}

      {/* ゲーム進行画面 */}
      {isGameStarted && (
        <GamePlay
          currentWord={currentWord}
          userInput={userInput}
          mistakeCount={mistakeCount}
          timeLeft={timeLeft}
          wordTimeLimit={wordTimeLimit}
          wordTimeLeft={wordTimeLeft}
          score={score}
          combo={typeStats.combo}
          maxCombo={typeStats.maxCombo}
          accuracy={typeStats.accuracy}
          wordsCompleted={typeStats.wordsCompleted}
          lastMistakeChar={lastMistakeChar}
          onInputChange={handleInputChange}
          onReturnToTitle={onReturnToTitle}
        />
      )}

      {/* ゲーム結果画面 */}
      {isGameOver && (
        <GameResult
          score={score}
          totalQuestions={typeStats.wordsCompleted}
          typeStats={typeStats}
          onRetry={handleRetry}
          onStartGame={startGame}
          onReturnToTitle={onReturnToTitle}
        />
      )}
    </div>
  );
}
