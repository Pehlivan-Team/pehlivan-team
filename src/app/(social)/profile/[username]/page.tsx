import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import FloatingPostButton from '@/components/post/FloatingPostButton'
import EditProfileButton from '@/components/profile/EditProfileButton'
import FollowButton from '@/components/profile/FollowButton'
import ProfileTabs from '@/components/profile/ProfileTabs'
import QuickStats from '@/components/profile/QuickStats'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { UserProfile } from '@/types/profile'


// Sunucu tarafında veriyi çek
async function getProfile(username: string): Promise<UserProfile | null> {
  try {
    const usersRef = firestoreAdmin.collection('users')
    const q = usersRef.where('username', '==', username).limit(1)
    const querySnapshot = await q.get()

    if (querySnapshot.empty) {
      return null
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    const publicProfile: UserProfile = {
      username: userData.username,
      name: userData.name,
      bio: userData.bio,
      team: userData.team,
      profilePictureUrl: userData.profilePictureUrl,
      socialLinks: userData.socialLinks,
      email: '',
      image: '',
    }

    return publicProfile
  } catch (error) {
    console.error('Profil getirme hatası:', error)
    return null
  }
}

async function getLatestPosts(username: string) {
  try {
    const q = firestoreAdmin
      .collection('posts')
      .where('authorUsername', '==', username)
      .orderBy('createdAt', 'desc')
      .limit(3)
    const snap = await q.get()
    return snap.docs.map((d) => {
      const data: any = d.data()
      return {
        id: d.id,
        content: data?.content ?? '',
        imageUrl: data?.imageUrl ?? undefined,
        likeCount: data?.likeCount ?? 0,
        commentCount: data?.commentCount ?? 0,
      }
    })
  } catch (e) {
    console.error('Son postlar getirilemedi', e)
    return [] as any[]
  }
}

async function getLatestBlogsByAuthor(authorName: string) {
  try {
    const q = firestoreAdmin
      .collection('posts')
      .where('author', '==', authorName)
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(3)
    const snap = await q.get()
    return snap.docs.map((d) => {
      const data: any = d.data()
      return {
        slug: data?.slug ?? d.id,
        title: data?.title ?? 'Untitled',
      }
    })
  } catch (e) {
    console.error('Son bloglar getirilemedi', e)
    return [] as any[]
  }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username)
  if (!profile) {
    notFound()
  }

  const latestPosts = await getLatestPosts(profile.username)
  const latestBlogs = await getLatestBlogsByAuthor(profile.name)

  const socials = [
    {
      name: 'GitHub',
      url: `https://github.com/${profile.socialLinks?.github}`,
      username: profile.socialLinks?.github,
      Icon: Github,
    },
    {
      name: 'LinkedIn',
      url: `https://linkedin.com/in/${profile.socialLinks?.linkedin}`,
      username: profile.socialLinks?.linkedin,
      Icon: Linkedin,
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/${profile.socialLinks?.twitter}`,
      username: profile.socialLinks?.twitter,
      Icon: Twitter,
    },
  ].filter((social) => social.username)

  return (
    <>
      {/* Cover + Avatar */}
      <div className="relative mb-12">
        {/* Cover */}
        <div className="relative h-48 w-full rounded-2xl bg-gradient-to-r from-emerald-700/60 via-teal-600/50 to-slate-700/60 backdrop-blur-sm shadow-inner border border-emerald-600/30">
          {/* Text overlay stays inside the rect */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full pb-4 pr-4 pl-[7.5rem] md:pl-[11rem]">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">{profile.name}</h1>
              <div className="mt-2 flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="text-sm font-mono text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded-md border border-emerald-700/40">
                  @{profile.username}
                </span>
                {profile.team ? (
                  <Badge className="bg-red-600/90 hover:bg-red-600 text-white shadow">{profile.team}</Badge>
                ) : null}
                <FollowButton targetUsername={profile.username} />
              </div>
            </div>
          </div>
        </div>
        {/* Avatar overlaps cover and stays partially outside */}
        <div className="absolute -bottom-8 md:-bottom-10 left-4 md:left-8">
          <EditProfileButton
            profileUsername={profile.username}
            profilePicture={profile.profilePictureUrl || profile.image || ''}
          />
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-8">
        {/* Bio & socials */}
        <div className="md:col-span-2 space-y-6">
          <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap">
            {profile.bio || 'Henüz bir biyografi eklenmemiş.'}
          </p>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-100"
                  asChild
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <social.Icon className="mr-2 h-4 w-4" />
                    {social.name}
                  </Link>
                </Button>
              ))}
              {profile.socialLinks?.website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-100"
                  asChild
                >
                  <Link
                    href={profile.socialLinks.website.startsWith('http')
                      ? profile.socialLinks.website
                      : `https://${profile.socialLinks.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Site
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
        {/* Quick stats summary (live) */}
        <QuickStats username={profile.username} initialPostCount={latestPosts.length} />
      </div>

      {/* Tabs for Posts & Blogs */}
      <div className="mt-12">
        <ProfileTabs posts={latestPosts} blogs={latestBlogs} username={profile.username} name={profile.name} />
      </div>

      <FloatingPostButton />
    </>
  )
}
