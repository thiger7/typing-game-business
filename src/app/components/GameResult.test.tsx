import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GameResult } from "./GameResult";

describe("GameResult", () => {
  const mockRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正しくスコアと問題数を表示すること", () => {
    render(<GameResult score={8} totalQuestions={10} onRetry={mockRetry} />);

    // スコアと問題数が表示されていることを確認（id属性を使用）
    const correctAnswers = screen.getByTestId("correctAnswers");
    const totalQuestions = screen.getByTestId("totalQuestions");

    expect(correctAnswers).toHaveTextContent("8");
    expect(totalQuestions).toHaveTextContent("10");

    // finalScoreコンテナ内で適切なテキストが含まれていることを確認
    const finalScore = screen.getByTestId("finalScore");
    expect(finalScore).toHaveTextContent("あなたのスコアは");
    expect(finalScore).toHaveTextContent("点");
    expect(finalScore).toHaveTextContent("問でした");
  });

  it("再チャレンジボタンをクリックするとonRetryが呼ばれること", () => {
    render(<GameResult score={8} totalQuestions={10} onRetry={mockRetry} />);

    // 再チャレンジボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "再チャレンジ" }));

    // コールバックが呼ばれたことを確認
    expect(mockRetry).toHaveBeenCalled();
  });

  it("異なるスコアでも正しく表示されること", () => {
    const { rerender } = render(
      <GameResult score={0} totalQuestions={10} onRetry={mockRetry} />,
    );

    // 初期表示を確認
    expect(screen.getByTestId("correctAnswers")).toHaveTextContent("0");

    // 別のスコアで再レンダリング
    rerender(<GameResult score={10} totalQuestions={10} onRetry={mockRetry} />);

    // 更新されたスコアが表示されていることを確認
    expect(screen.getByTestId("correctAnswers")).toHaveTextContent("10");
  });
});
