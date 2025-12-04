import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>Claude Code Training Project - Biome CI</h1>
          <p>このプロジェクトでは、Claude Codeを使った開発を体験できます。</p>
        </div>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/weather">
            <span className="text-2xl">🌤️</span>
            天気予報
          </Link>
          <Link className={styles.secondary} href="/geocoding">
            <span className="text-2xl">📍</span>
            ジオコーディング
          </Link>
          <Link className={styles.secondary} href="/currency">
            <span className="text-2xl">💱</span>
            通貨換算
          </Link>
          <Link className={styles.secondary} href="/github">
            <span className="text-2xl">🐙</span>
            GitHub検索
          </Link>
          <Link className={styles.secondary} href="/todo">
            <span className="text-2xl">✅</span>
            TODOリスト
          </Link>
          <Link className={styles.secondary} href="/markdown">
            <span className="text-2xl">📝</span>
            Markdown
          </Link>
          <Link className={styles.secondary} href="/gallery">
            <span className="text-2xl">🖼️</span>
            画像検索
          </Link>
        </div>
      </main>
    </div>
  );
}
