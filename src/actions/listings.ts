// src/actions/listings.ts
'use server'
import { supabaseServer } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
export async function createListing(fd: FormData) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('未登录')
  const years = parseInt(fd.get('years') as string)
  if (years > 20) throw new Error('⚠️ 租赁期限依法不得超过20年')
  const { error } = await sb.from('listings').insert({
    creator_id: user.id, region_code: fd.get('region') as string,
    title: fd.get('title') as string, description: fd.get('desc') as string,
    lease_years: years, price: parseFloat(fd.get('price') as string), status: 'pending'
  })
  if (error) throw error
  revalidatePath('/dashboard/village')
  return { success: true }
}

