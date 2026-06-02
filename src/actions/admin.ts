// src/actions/admin.ts
'use server'
import { supabaseServer } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
async function checkAdmin() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || !['admin','gov'].includes(user.user_metadata.role as string)) throw new Error('权限不足')
  return { sb, user }
}
export async function updateListingStatus(id: string, status: 'published' | 'rejected') {
  const { sb } = await checkAdmin()
  await sb.from('listings').update({ status }).eq('id', id)
  revalidatePath('/admin/listings')
}
export async function reviewScraped(id: string, action: 'approved' | 'rejected') {
  const { sb, user } = await checkAdmin()
  await sb.from('scraped_data').update({ status: action }).eq('id', id)
  if (action === 'approved') {
    const { data: item } = await sb.from('scraped_data').select('*').eq('id', id).single()
    if (item) await sb.from('listings').insert({ creator_id: user.id, region_code: item.matched_region_code || '510000', title: item.title?.slice(0,100), description: item.content, price: 0, lease_years: 20, status: 'pending' })
  }
  revalidatePath('/admin/scraped')
}// src/actions/admin.ts
'use server'
import { supabaseServer } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
async function checkAdmin() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user || !['admin','gov'].includes(user.user_metadata.role as string)) throw new Error('权限不足')
  return { sb, user }
}
export async function updateListingStatus(id: string, status: 'published' | 'rejected') {
  const { sb } = await checkAdmin()
  await sb.from('listings').update({ status }).eq('id', id)
  revalidatePath('/admin/listings')
}
export async function reviewScraped(id: string, action: 'approved' | 'rejected') {
  const { sb, user } = await checkAdmin()
  await sb.from('scraped_data').update({ status: action }).eq('id', id)
  if (action === 'approved') {
    const { data: item } = await sb.from('scraped_data').select('*').eq('id', id).single()
    if (item) await sb.from('listings').insert({ creator_id: user.id, region_code: item.matched_region_code || '510000', title: item.title?.slice(0,100), description: item.content, price: 0, lease_years: 20, status: 'pending' })
  }
  revalidatePath('/admin/scraped')
}