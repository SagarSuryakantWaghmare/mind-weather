"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function NewUserPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [displayName, setDisplayName] = useState(user?.fullName || "")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) return <div>Loading...</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ displayName, bio })
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body?.message || 'Failed to save')
      }

      // After successful save, navigate to /journal
      router.push('/journal')
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-4">Welcome — one last step</h1>
        <p className="text-white/70 mb-6">Tell us a bit about yourself to get started.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5"
              placeholder="What do people call you?"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Short bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/5"
              placeholder="A line or two about you"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              {saving ? 'Saving…' : 'Save and continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}