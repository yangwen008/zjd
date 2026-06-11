'use client'
import { useState } from 'react'
import { createListing } from '@/actions/listings'
import { supabaseBrowser } from '@/lib/supabase'

export default function VillageDash() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  const handleUpload = async () => {
    if (!videoFile) return
    setUploading(true)
    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      const res = await fetch('/api/r2/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ filename: videoFile.name, contentType: videoFile.type, size: videoFile.size })
      })
      const { url, key } = await res.json()
      await fetch(url, { method: 'PUT', body: videoFile })
      setVideoUrl(`https://${process.env.NEXT_PUBLIC_CF_R2_PUBLIC_URL}/${key}`)
    } catch (e) {
      alert('上传失败')
    } finally { setUploading(false) }
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <h1 className="text-2xl font-bold">发布农房/宅基地</h1>
      <form action={createListing} className="bg-white p-4 rounded shadow space-y-3">
        <input name="title" placeholder="标题" className="w-full border p-2 rounded" required />
        <textarea name="desc" placeholder="详细描述（面积、位置、配套等）" className="w-full border p-2 rounded" required />
        <div className="flex gap-2 items-center">
          <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="text-sm" />
          <button type="button" onClick={handleUpload} disabled={uploading || !videoFile} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50">
            {uploading ? '上传中...' : '上传视频'}
          </button>
        </div>
        {videoUrl && <input type="hidden" name="video_url" value={videoUrl} />}
        <input name="years" type="number" max={20} placeholder="租赁年限(≤20)" className="w-full border p-2 rounded" required />
        <input name="price" type="number" placeholder="年租金(元)" className="w-full border p-2 rounded" required />
        <input type="hidden" name="region" value="510114" />
        <button className="w-full bg-green-600 text-white p-2 rounded">提交审核</button>
      </form>
    </div>
  )
}
