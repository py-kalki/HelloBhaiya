import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminApp } from "@/lib/firebase/admin"
import { lookupLevel } from "@/lib/scoring"
import type { LeaderboardEntry } from "@/components/leaderboard/LeaderboardTable"
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable"
import { InviteLink } from "@/components/leaderboard/InviteLink"
import Link from "next/link"

async function getUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) redirect("/login")
  try {
    return await getAuth(adminApp).verifySessionCookie(sessionCookie, true)
  } catch {
    redirect("/login")
  }
}

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const { tab = "weekly" } = await searchParams
  const decoded = await getUser()
  const db = getFirestore(adminApp)

  const [currentUserDoc, weeklySnap] = await Promise.all([
    db.collection("users").doc(decoded.uid).get(),
    db.collection("leaderboard").doc("weekly").collection("entries")
      .orderBy("xp_this_week", "desc")
      .limit(50)
      .get(),
  ])

  const me = currentUserDoc.data()

  function buildEntry(uid: string, data: FirebaseFirestore.DocumentData, rank: number): LeaderboardEntry {
    const lvl = lookupLevel(data.xp_total ?? 0)
    return {
      uid,
      name:           data.name ?? "Unknown",
      photo_url:      data.photo_url ?? "",
      level:          lvl.level,
      level_title:    lvl.title,
      xp_this_week:   data.xp_this_week ?? 0,
      streak_current: data.streak_current ?? 0,
      city:           data.city ?? "",
      rank,
      isCurrentUser:  uid === decoded.uid,
    }
  }

  const weeklyEntries: LeaderboardEntry[] = weeklySnap.docs.map((doc, i) =>
    buildEntry(doc.id, doc.data(), i + 1)
  )

  const currentUserWeeklyEntry: LeaderboardEntry | null = me
    ? buildEntry(decoded.uid, me, weeklyEntries.findIndex((e) => e.isCurrentUser) + 1 || weeklyEntries.length + 1)
    : null

  const friendCodes: string[] = me?.friend_codes ?? []
  const inviteCode: string = me?.invite_code ?? ""

  let friendEntries: LeaderboardEntry[] = []
  if (friendCodes.length > 0) {
    const friendDocs = await Promise.all(
      friendCodes.slice(0, 20).map((uid) => db.collection("users").doc(uid).get())
    )
    friendEntries = friendDocs
      .filter((d) => d.exists)
      .map((d, i) => buildEntry(d.id, d.data()!, i + 1))
      .sort((a, b) => b.xp_this_week - a.xp_this_week)
      .map((e, i) => ({ ...e, rank: i + 1 }))

    if (!friendEntries.find((e) => e.isCurrentUser) && me) {
      friendEntries.push(buildEntry(decoded.uid, me, friendEntries.length + 1))
    }
  }

  let cityEntries: LeaderboardEntry[] = []
  const userCity: string = me?.city ?? ""
  if (userCity) {
    const citySnap = await db.collection("leaderboard").doc("weekly").collection("entries")
      .where("city", "==", userCity)
      .orderBy("xp_this_week", "desc")
      .limit(50)
      .get()
    cityEntries = citySnap.docs.map((doc, i) => buildEntry(doc.id, doc.data(), i + 1))
  }

  const tabs = [
    { id: "weekly", label: "Top 50" },
    { id: "city",   label: userCity ? userCity : "My City" },
    { id: "friends", label: "Friends" },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Weekly XP resets every Monday</p>
        </div>

        <div className="flex gap-1 border-b border-border">
          {tabs.map(({ id, label }) => (
            <Link
              key={id}
              href={`/leaderboard?tab=${id}`}
              className={`flex-1 pb-3 px-1 text-xs font-medium text-center transition-colors border-b-2 ${
                tab === id
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {tab === "weekly" && (
          <LeaderboardTable entries={weeklyEntries} currentUserEntry={currentUserWeeklyEntry} />
        )}
        {tab === "city" && (
          <>
            {!userCity ? (
              <p className="text-sm text-text-secondary text-center py-8">
                City detection unavailable
              </p>
            ) : (
              <LeaderboardTable entries={cityEntries} currentUserEntry={null} />
            )}
          </>
        )}
        {tab === "friends" && (
          <div className="space-y-4">
            {inviteCode && <InviteLink inviteCode={inviteCode} />}
            {friendEntries.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">
                Invite friends to start competing
              </p>
            ) : (
              <LeaderboardTable entries={friendEntries} currentUserEntry={null} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
