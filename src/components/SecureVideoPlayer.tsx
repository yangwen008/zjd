'use client'
import { useEffect, useRef, useState } from 'react'

export default function SecureVideo({ src, userId, className = '' }: { src: string; userId: string; className?: string }) {
  const vid = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)
  const txt = `UID:${userId.slice(0, 8)} | ${new Date().toLocaleString()}`

  useEffect(() => {
    const v = vid.current; if (!v) return
    const stop = (e: Event) => e.preventDefault()
    v.addEventListener('contextmenu', stop)
    v.addEventListener('touchstart', stop, { passive: false })
    return () => { v.removeEventListener('contextmenu', stop); v.removeEventListener('touchstart', stop) }
  }, [])

  return (
    <div className={`relative rounded overflow-hidden bg-black ${className}`}>
      <video ref={vid} src={src} controls controlsList="nodownload nofullscreen" disablePictureInPicture playsInline className="w-full" onLoadedData={() => setLoad(true)} />
      <div className="absolute inset-0 pointer-events-none select-none opacity-25" style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='100'><text x='50' y='50' font-size='16' fill='white' transform='rotate(-15 150 50)'>${encodeURIComponent(txt)}</text></svg>")`, backgroundSize: '300px 100px' }} />
      {!load && <div className="absolute inset-0 flex items-center justify-center text-white">加载中...</div>}
    </div>
  )
}