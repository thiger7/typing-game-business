import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTypingGame } from "./useTypingGame";

// データのモック
vi.mock("../data/words", () => ({
  words: [
    { japanese: "テスト", roman: "tesuto" },
    { japanese: "サンプル", roman: "sanpuru" },
  ],
}));

describe("useTypingGame", () => {
  beforeEach(() => {
    // Math.randomをモック化して、常に最初の単語が選ばれるようにする
    vi.spyOn(global.Math, "random").mockReturnValue(0);
  });

  it("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => useTypingGame());

    expect(result.current.gameState.isGameStarted).toBe(false);
    expect(result.current.gameState.isGameOver).toBe(false);
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.mistakeCount).toBe(0);
    expect(result.current.gameState.questionLimit).toBe(10);
  });

  it("startGameを呼び出すとゲームが開始されること", () => {
    const { result } = renderHook(() => useTypingGame());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameState.isGameStarted).toBe(true);
    expect(result.current.gameState.isGameOver).toBe(false);
    expect(result.current.gameState.questionsRemaining).toBe(10);
    expect(result.current.gameState.currentWord.japanese).toBe("テスト");
    expect(result.current.gameState.currentWord.roman).toBe("tesuto");
  });

  it("正しい入力をするとスコアが増加すること", () => {
    const { result } = renderHook(() => useTypingGame());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.handleInputChange("tesuto");
    });

    expect(result.current.gameState.score).toBe(1);
    expect(result.current.gameState.questionsRemaining).toBe(9);
  });

  it("間違った入力をすると間違いカウントが増加すること", () => {
    const { result } = renderHook(() => useTypingGame());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.handleInputChange("tez");
    });

    expect(result.current.gameState.mistakeCount).toBe(1);
  });

  it("設定を更新できること", () => {
    const { result } = renderHook(() => useTypingGame());

    act(() => {
      result.current.updateSettings(20);
    });

    expect(result.current.gameState.questionLimit).toBe(20);
  });

  it("リトライボタンを押すとゲームがリセットされること", () => {
    const { result } = renderHook(() => useTypingGame(2)); // 質問数を少なく設定

    // ゲームを開始
    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameState.isGameStarted).toBe(true);
    expect(result.current.gameState.questionsRemaining).toBe(2);

    // 1問目に回答
    act(() => {
      result.current.handleInputChange("tesuto");
    });

    expect(result.current.gameState.score).toBe(1);
    expect(result.current.gameState.questionsRemaining).toBe(1);
    expect(result.current.gameState.isGameStarted).toBe(true);

    // 2問目に回答してゲーム終了
    act(() => {
      result.current.handleInputChange("tesuto");
    });

    // ここでゲームオーバーになっているはず
    expect(result.current.gameState.isGameStarted).toBe(false);
    expect(result.current.gameState.isGameOver).toBe(true);
    expect(result.current.gameState.score).toBe(2);
    expect(result.current.gameState.questionsRemaining).toBe(0);

    // リトライ
    act(() => {
      result.current.handleRetry();
    });

    // ゲームがリセットされていることを確認
    expect(result.current.gameState.isGameStarted).toBe(false);
    expect(result.current.gameState.isGameOver).toBe(false);
  });
});
