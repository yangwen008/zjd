import { reviewScraped } from '@/actions/admin'
import { supabaseServer } from '@/lib/supabase'

export default async function ScrapedReview() {
  const sb = await supabaseServer()
  const { data } = await sb.from('scraped_data').select('*').eq('status', 'pending').order('scraped_at', { ascending: false })
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">采集数据审核台</h1>
      {data?.length === 0 && <p className="text-gray-500">暂无待审数据</p>}
      <div className="space-y-4">{data?.map(item => (
        <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
          <div>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-1">来源: {item.source_url} | 地区: {item.matched_region_code}</p>
            <pre className="mt-2 bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap max-h-32 overflow-auto">{item.content}</pre>
          </div>
          <div className="flex gap-2 mt-2">
            <button formAction={async () => reviewScraped(item.id, 'approved')} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">通过</button>
            <button formAction={async () => reviewScraped(item.id, 'rejected')} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">驳回</button>
          </div>
        </div>
      ))}</div>
    </div>
  )
}