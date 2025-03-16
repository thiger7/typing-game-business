import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GamePlay } from "./GamePlay";

describe("GamePlay", () => {
  const mockInputChange = vi.fn();
  const defaultProps = {
    currentWord: { japanese: "テスト", roman: "tesuto" },
    userInput: "",
    mistakeCount: 0,
    questionsRemaining: 5,
    score: 3,
    onInputChange: mockInputChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("適切に描画されること", () => {
    render(<GamePlay {...defaultProps} />);

    // 現在の単語が表示されていることを確認
    expect(screen.getByText("テスト")).toBeInTheDocument();
    expect(screen.getByText("tesuto")).toBeInTheDocument();

    // スコアと残り問題数が表示されていることを確認
    expect(screen.getByText("スコア: 3")).toBeInTheDocument();
    expect(screen.getByText("残りの出題数: 5")).toBeInTheDocument();
    expect(screen.getByText("ミス: 0")).toBeInTheDocument();

    // 入力欄が存在することを確認
    expect(
      screen.getByPlaceholderText("ここにタイピングしてください"),
    ).toBeInTheDocument();
  });

  it("入力が変更されたときにonInputChangeが呼ばれること", () => {
    render(<GamePlay {...defaultProps} />);

    // テキスト入力フィールドに入力
    fireEvent.change(
      screen.getByPlaceholderText("ここにタイピングしてください"),
      {
        target: { value: "te" },
      },
    );

    // コールバック関数が正しい引数で呼ばれたことを確認
    expect(mockInputChange).toHaveBeenCalledWith("te");
  });

  it("propが更新されると表示も更新されること", () => {
    const { rerender } = render(<GamePlay {...defaultProps} />);

    // 初期表示の確認
    expect(screen.getByText("テスト")).toBeInTheDocument();
    expect(screen.getByText("ミス: 0")).toBeInTheDocument();

    // propsを更新して再レンダリング
    rerender(
      <GamePlay
        {...defaultProps}
        currentWord={{ japanese: "新しい単語", roman: "atarashii" }}
        mistakeCount={2}
      />,
    );

    // 更新後の表示を確認
    expect(screen.getByText("新しい単語")).toBeInTheDocument();
    expect(screen.getByText("atarashii")).toBeInTheDocument();
    expect(screen.getByText("ミス: 2")).toBeInTheDocument();
  });

  it("コンポーネントがマウントされるとinput要素にフォーカスが当たること", () => {
    render(<GamePlay {...defaultProps} />);

    // 入力フィールドがフォーカスされていることを確認
    expect(document.activeElement).toBe(
      screen.getByPlaceholderText("ここにタイピングしてください"),
    );
  });
});
