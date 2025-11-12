以下の手順でテストを実行してください：

1. 現在のファイルに対するテストファイルを探す
2. テストが存在する場合は実行する
3. テストが存在しない場合は、適切なテストファイルを作成する
4. テスト結果を報告する

Next.jsプロジェクトなので、Jest/Vitestを使用してください。

## テストファイルの命名規則

以下のいずれかのパターンでテストファイルを探してください：

- `[filename].test.ts(x)` - 同じディレクトリ内
- `[filename].spec.ts(x)` - 同じディレクトリ内
- `__tests__/[filename].test.ts(x)` - __tests__ディレクトリ内
- `__tests__/[filename].spec.ts(x)` - __tests__ディレクトリ内

## テストファイル作成時の注意事項

新しいテストファイルを作成する場合：

- React コンポーネントの場合は `@testing-library/react` と `@testing-library/jest-dom` を使用
- ファイル拡張子は元のファイルに合わせる（.ts または .tsx）
- 適切なテストケースを含める（最低限のrender/snapshot/動作テスト）
- Next.js の App Router を考慮する（Server Components / Client Components）

## テスト実行コマンド

- example1 ディレクトリで実行: `npm test`
- 特定のファイルのみ: `npm test -- [test-file-path]`
- ウォッチモード: `npm run test:watch`
