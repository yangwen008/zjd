'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isReg, setIsReg] = useState(false)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [role, setRole] = useState('renter')
  const [region, setRegion] = useState('510114')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr('')
    try {
      if (isReg) {
        const { error } = await supabaseBrowser.auth.signUp({ email, password: pwd, options: { data: { role, region_code: region, real_name: email.split('@')[0] } } })
        if (error) throw error
        alert('注册成功，请查收验证邮件')
      } else {
        const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password: pwd })
        if (error) throw error
        document.cookie = `region_code=${region};path=/;max-age=2592000`
        router.push('/dashboard')
      }
    } catch (e: any) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow space-y-3">
        <h2 className="text-xl font-bold text-center">{isReg ? '注册' : '登录'}</h2>
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <input className="w-full border p-2 rounded" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="密码(≥6)" value={pwd} onChange={e => setPwd(e.target.value)} minLength={6} required />
        {isReg && (
          <>
            <select className="w-full border p-2 rounded" value={role} onChange={e => setRole(e.target.value)}>
              <option value="village">村集体</option><option value="operator">运营商</option><option value="gov">政府</option><option value="renter">租客</option>
            </select>
            <select className="w-full border p-2 rounded" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="510114">新都区</option><option value="510300">自贡市</option><option value="510600">德阳市</option>
            </select>
          </>
        )}
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50">{loading ? '处理中...' : isReg ? '注册' : '登录'}</button>
        <p className="text-center text-sm text-gray-500 cursor-pointer" onClick={() => setIsReg(!isReg)}>{isReg ? '已有账号？去登录' : '没有账号？去注册'}</p>
      </form>
    </div>
  )
}