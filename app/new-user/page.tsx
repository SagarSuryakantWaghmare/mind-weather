import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Ensure a corresponding row exists in our database
  const match = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress ?? undefined,
      },
    })
  }

  // After creating (or confirming) the user, navigate to journal
  redirect('/journal')
}