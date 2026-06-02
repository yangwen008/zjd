import { createListing } from '@/actions/listings'
import { supabaseServer } from '@/lib/supabase'

export default async function VillageDash() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: drafts } = await sb.from('listings').select('*').eq('creator_id', user?.id).eq('status', 'draft')
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">村集体发布台</h1>
      <form action={createListing} className="bg-white p-4 rounded shadow space-y-3 max-w-lg">
        <input name="title" placeholder="标题" className="w-full border p-2 rounded" required />
        <textarea name="desc" placeholder="描述" className="w-full border p-2 rounded" />
        <input name="years" type="number" max={20} placeholder="年限(≤20)" className="w-full border p-2 rounded" required />
        <input name="price" type="number" placeholder="年租金(元)" className="w-full border p-2 rounded" required />
        <input type="hidden" name="region" value="510114" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">提交审核</button>
      </form>
      <h2 className="text-xl">我的草稿</h2>
      <ul className="space-y-2">{drafts?.map(d => <li key={d.id} className="bg-white p-3 rounded shadow">{d.title} - {d.status}</li>)}</ul>
    </div>
  )
}