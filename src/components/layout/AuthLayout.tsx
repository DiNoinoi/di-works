import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '../../constants/app';

/**
 * 認証ページ用レイアウト
 * シンプルな中央配置レイアウトでロゴを含む
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 px-4">
        {/* ロゴ部分 */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              漢
            </div>
            <span className="text-2xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>
        </div>

        {/* 認証フォームエリア */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}