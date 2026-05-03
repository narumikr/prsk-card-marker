import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">ページが見つかりません</p>
      <Link to="/" className="text-blue-500 underline">
        トップへ戻る
      </Link>
    </main>
  );
}
