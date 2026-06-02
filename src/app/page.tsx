// page.tsx
import { supabaseServer } from '@/lib/supabase'
export default async function Home() {
  const sb = await supabaseServer()
  const { data } = await sb.from('listings').select('*').eq('status', 'published').limit(6)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">最新发布房源</h2>
      {data?.length === 0 ? <p className="text-gray-500">暂无已发布房源</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map(l => (
            <div key={l.id} className="bg-white p-4 rounded shadow border">
              <h3 className="font-bold text-lg">{l.title}</h3>
              <p className="text-sm text-gray-500 mt-1">地区: {l.region_code} | 租金: ¥{l.price}/年</p>
              {l.video_url && <p className="text-xs text-blue-600 mt-2">🎥 含视频</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}