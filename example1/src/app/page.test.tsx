import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  it("ページタイトルが表示される", () => {
    render(<Home />);
    expect(screen.getByText("Claude Code Training Project")).toBeInTheDocument();
  });

  it("説明文が表示される", () => {
    render(<Home />);
    expect(
      screen.getByText(/このプロジェクトでは、Claude Codeを使った開発を体験できます/)
    ).toBeInTheDocument();
  });

  it("Next.jsロゴが表示される", () => {
    render(<Home />);
    const logo = screen.getByAltText("Next.js logo");
    expect(logo).toBeInTheDocument();
  });

  it("天気予報リンクが表示される", () => {
    render(<Home />);
    const weatherLink = screen.getByRole("link", { name: /天気予報/ });
    expect(weatherLink).toBeInTheDocument();
    expect(weatherLink).toHaveAttribute("href", "/weather");
  });

  it("ジオコーディングリンクが表示される", () => {
    render(<Home />);
    const geocodingLink = screen.getByRole("link", { name: /ジオコーディング/ });
    expect(geocodingLink).toBeInTheDocument();
    expect(geocodingLink).toHaveAttribute("href", "/geocoding");
  });

  it("通貨換算リンクが表示される", () => {
    render(<Home />);
    const currencyLink = screen.getByRole("link", { name: /通貨換算/ });
    expect(currencyLink).toBeInTheDocument();
    expect(currencyLink).toHaveAttribute("href", "/currency");
  });

  it("GitHub検索リンクが表示される", () => {
    render(<Home />);
    const githubLink = screen.getByRole("link", { name: /GitHub検索/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "/github");
  });

  it("TODOリストリンクが表示される", () => {
    render(<Home />);
    const todoLink = screen.getByRole("link", { name: /TODOリスト/ });
    expect(todoLink).toBeInTheDocument();
    expect(todoLink).toHaveAttribute("href", "/todo");
  });

  it("Markdownリンクが表示される", () => {
    render(<Home />);
    const markdownLink = screen.getByRole("link", { name: /Markdown/ });
    expect(markdownLink).toBeInTheDocument();
    expect(markdownLink).toHaveAttribute("href", "/markdown");
  });

  it("画像検索リンクが表示される", () => {
    render(<Home />);
    const galleryLink = screen.getByRole("link", { name: /画像検索/ });
    expect(galleryLink).toBeInTheDocument();
    expect(galleryLink).toHaveAttribute("href", "/gallery");
  });

  it("すべての機能リンクが表示される（7つ）", () => {
    render(<Home />);
    const links = screen.getAllByRole("link");
    // Next.jsロゴを除いた機能リンクの数を確認
    const featureLinks = links.filter((link) => link.getAttribute("href")?.startsWith("/"));
    expect(featureLinks.length).toBeGreaterThanOrEqual(7);
  });
});
