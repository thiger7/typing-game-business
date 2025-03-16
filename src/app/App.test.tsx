import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// useTypingGameフックのモック
vi.mock("./hooks/useTypingGame", () => ({
  useTypingGame: vi.fn(() => ({
    gameState: {
      currentWord: { japanese: "テスト", roman: "tesuto" },
      userInput: "",
      mistakeCount: 0,
      questionsRemaining: 5,
      questionLimit: 10,
      score: 0,
      isGameStarted: false,
      isGameOver: false,
    },
    startGame: vi.fn(),
    handleInputChange: vi.fn(),
    handleRetry: vi.fn(),
    updateSettings: vi.fn(),
  })),
}));

// コンポーネントのモック
vi.mock("./components/Header", () => ({
  Header: () => <div data-testid="header">ヘッダーモック</div>,
}));

vi.mock("./components/GameSettings", () => ({
  GameSettings: (props: any) => (
    <div data-testid="game-settings">ゲーム設定モック</div>
  ),
}));

vi.mock("./components/GamePlay", () => ({
  GamePlay: (props: any) => (
    <div data-testid="game-play">ゲームプレイモック</div>
  ),
}));

vi.mock("./components/GameResult", () => ({
  GameResult: (props: any) => (
    <div data-testid="game-result">ゲーム結果モック</div>
  ),
}));

import { useTypingGame } from "./hooks/useTypingGame";

describe("App", () => {
  // テスト毎にモックをリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態では設定画面が表示されること", () => {
    // モックの戻り値を設定
    (useTypingGame as any).mockReturnValue({
      gameState: {
        currentWord: { japanese: "テスト", roman: "tesuto" },
        userInput: "",
        mistakeCount: 0,
        questionsRemaining: 5,
        questionLimit: 10,
        score: 0,
        isGameStarted: false, // ゲーム開始前
        isGameOver: false, // ゲーム終了前
      },
      startGame: vi.fn(),
      handleInputChange: vi.fn(),
      handleRetry: vi.fn(),
      updateSettings: vi.fn(),
    });

    render(<App />);

    // ヘッダーと設定画面が表示されていることを確認
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("game-settings")).toBeInTheDocument();

    // ゲームプレイ画面とリザルト画面は表示されていないことを確認
    expect(screen.queryByTestId("game-play")).not.toBeInTheDocument();
    expect(screen.queryByTestId("game-result")).not.toBeInTheDocument();
  });

  it("ゲーム中はゲームプレイ画面が表示されること", () => {
    // ゲーム中の状態をモック
    (useTypingGame as any).mockReturnValue({
      gameState: {
        currentWord: { japanese: "テスト", roman: "tesuto" },
        userInput: "",
        mistakeCount: 0,
        questionsRemaining: 5,
        questionLimit: 10,
        score: 0,
        isGameStarted: true, // ゲーム中
        isGameOver: false, // ゲーム終了前
      },
      startGame: vi.fn(),
      handleInputChange: vi.fn(),
      handleRetry: vi.fn(),
      updateSettings: vi.fn(),
    });

    render(<App />);

    // ヘッダーとゲームプレイ画面が表示されていることを確認
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("game-play")).toBeInTheDocument();

    // 設定画面とリザルト画面は表示されていないことを確認
    expect(screen.queryByTestId("game-settings")).not.toBeInTheDocument();
    expect(screen.queryByTestId("game-result")).not.toBeInTheDocument();
  });

  it("ゲーム終了時はリザルト画面が表示されること", () => {
    // ゲーム終了の状態をモック
    (useTypingGame as any).mockReturnValue({
      gameState: {
        currentWord: { japanese: "テスト", roman: "tesuto" },
        userInput: "",
        mistakeCount: 0,
        questionsRemaining: 0,
        questionLimit: 10,
        score: 8,
        isGameStarted: false, // ゲーム開始前
        isGameOver: true, // ゲーム終了
      },
      startGame: vi.fn(),
      handleInputChange: vi.fn(),
      handleRetry: vi.fn(),
      updateSettings: vi.fn(),
    });

    render(<App />);

    // ヘッダーとリザルト画面が表示されていることを確認
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("game-result")).toBeInTheDocument();

    // 設定画面とゲームプレイ画面は表示されていないことを確認
    expect(screen.queryByTestId("game-settings")).not.toBeInTheDocument();
    expect(screen.queryByTestId("game-play")).not.toBeInTheDocument();
  });
});
