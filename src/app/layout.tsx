// layout.tsx
export const metadata = { title: '四川农房与宅基地出租平台', description: '合规、安全、透明的农村资产流转信息平台' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">🌾 四川农房出租</h1>
          <a href="/login" className="text-sm text-gray-600 hover:text-blue-600">登录/注册</a>
        </header>
        <main className="container mx-auto max-w-5xl py-8">{children}</main>
        <footer className="bg-gray-100 p-4 text-center text-xs text-gray-600 mt-auto">
          ⚠️ 本平台仅提供信息展示。根据《民法典》第705条及《四川省农村宅基地管理办法》，宅基地仅可出租使用权，期限不得超过20年，严禁买卖、抵押、改变农业用途。
        </footer>
      </body>
    </html>
  )
}

