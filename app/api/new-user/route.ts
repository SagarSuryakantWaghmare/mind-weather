import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

const CLERK_SECRET = process.env.CLERK_SECRET_KEY || process.env.NEXT_PUBLIC_CLERK_SECRET_KEY || process.env.CLERK_SECRET

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  try {
    const body = await req.json()
    const { displayName, bio } = body

    if (!CLERK_SECRET) {
      return NextResponse.json({ message: 'Server misconfigured (missing CLERK_SECRET_KEY)' }, { status: 500 })
    }

    // Use Clerk REST API to update the user (server-side)
    const res = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CLERK_SECRET}`,
      },
      body: JSON.stringify({
        public_metadata: { ...(user.publicMetadata || {}), bio: bio || '' },
        first_name: displayName || user.firstName || undefined,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('Clerk update failed:', body)
      return NextResponse.json({ message: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('new-user error', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}