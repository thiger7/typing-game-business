import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("タイトルと画像が表示されること", () => {
    render(<Header />);

    // タイトルが表示されていることを確認
    expect(screen.getByText("タイピングゲーム")).toBeInTheDocument();

    // 画像が表示されていることを確認
    const image = screen.getByAltText("タイピングゲーム");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("computer_typing_hayai.png"),
    );
  });

  it("サブテキストが表示されること", () => {
    render(<Header />);

    // サブテキストが表示されていることを確認
    expect(
      screen.getByText("プログラミングに挑戦してみよう！"),
    ).toBeInTheDocument();
  });
});
