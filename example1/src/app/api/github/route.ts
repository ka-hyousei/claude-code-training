import { NextRequest, NextResponse } from 'next/server';
import type { GitHubApiResponse, GitHubUser, GitHubRepository } from '@/types/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  // バリデーション
  if (!username || username.trim() === '') {
    return NextResponse.json<GitHubApiResponse>(
      {
        success: false,
        error: 'ユーザー名を入力してください',
      },
      { status: 400 }
    );
  }

  try {
    // GitHub API へのリクエスト（認証不要）
    const userUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const reposUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`;

    // ユーザー情報とリポジトリ情報を並列取得
    const [userResponse, reposResponse] = await Promise.all([
      fetch(userUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // 5分キャッシュ
      }),
      fetch(reposUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // 5分キャッシュ
      }),
    ]);

    // ユーザーが見つからない場合
    if (userResponse.status === 404) {
      return NextResponse.json<GitHubApiResponse>({
        success: false,
        error: 'ユーザーが見つかりませんでした',
      });
    }

    // その他のエラー
    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error(`GitHub API returned ${userResponse.status} / ${reposResponse.status}`);
    }

    const user: GitHubUser = await userResponse.json();
    const repositories: GitHubRepository[] = await reposResponse.json();

    return NextResponse.json<GitHubApiResponse>({
      success: true,
      data: {
        user,
        repositories,
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json<GitHubApiResponse>(
      {
        success: false,
        error: 'GitHub APIの呼び出しに失敗しました。しばらく待ってから再度お試しください',
      },
      { status: 500 }
    );
  }
}
