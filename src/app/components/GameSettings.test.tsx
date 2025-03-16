import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GameSettings } from "./GameSettings";

describe("GameSettings", () => {
  const mockQuestionLimitChange = vi.fn();
  const mockStartGame = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("適切に描画されること", () => {
    render(
      <GameSettings
        questionLimit={10}
        onQuestionLimitChange={mockQuestionLimitChange}
        onStartGame={mockStartGame}
      />,
    );

    // 要素が存在することを確認
    expect(
      screen.getByLabelText("出題数を選んでください:"),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "開始" })).toBeInTheDocument();
  });

  it("出題数が変更されたときにonQuestionLimitChangeが呼ばれること", () => {
    render(
      <GameSettings
        questionLimit={10}
        onQuestionLimitChange={mockQuestionLimitChange}
        onStartGame={mockStartGame}
      />,
    );

    // セレクトボックスの値を変更
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });

    // コールバック関数が正しい引数で呼ばれたことを確認
    expect(mockQuestionLimitChange).toHaveBeenCalledWith(20);
  });

  it("開始ボタンをクリックするとonStartGameが呼ばれること", () => {
    render(
      <GameSettings
        questionLimit={10}
        onQuestionLimitChange={mockQuestionLimitChange}
        onStartGame={mockStartGame}
      />,
    );

    // 開始ボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "開始" }));

    // コールバック関数が呼ばれたことを確認
    expect(mockStartGame).toHaveBeenCalled();
  });
});
