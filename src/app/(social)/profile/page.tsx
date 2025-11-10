
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

export default async function ProfileRootPage() {
	// Resolve the current user's session on the server and redirect to their profile.
	const session = await getServerSession(authOptions)
	const username = session?.user?.username

	if (username) {
		// Redirect to the canonical profile route for the signed-in user
		redirect(`/profile/${username}`)
	}

	// If not signed in, send them to the login page
	redirect('/auth/login')
}
