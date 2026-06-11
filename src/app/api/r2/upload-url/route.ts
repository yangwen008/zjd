import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { supabaseServer } from '@/lib/supabase'

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export async function POST(req: NextRequest) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { filename, contentType, size } = await req.json()
  if (!ALLOWED_TYPES.includes(contentType)) return NextResponse.json({ error: '仅支持 MP4/WebM/MOV' }, { status: 400 })
  if (size > MAX_SIZE) return NextResponse.json({ error: '视频不能超过 50MB' }, { status: 400 })

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! }
  })

  const key = `videos/${Date.now()}-${filename.replace(/\s/g, '_')}`
  const cmd = new PutObjectCommand({ Bucket: 'rural-rental', Key: key, ContentType: contentType, ACL: 'public-read' })
  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 })
  return NextResponse.json({ url, key })
}
