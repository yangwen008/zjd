import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { filename, contentType } = await req.json()
  const s3 = new S3Client({ region: 'auto', endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } })
  const cmd = new PutObjectCommand({ Bucket: 'rural-rental', Key: `videos/${Date.now()}-${filename}`, ContentType: contentType, ACL: 'public-read' })
  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 })
  return NextResponse.json({ url, key: `videos/${Date.now()}-${filename}` })
}