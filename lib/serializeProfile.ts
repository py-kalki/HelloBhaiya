import type { UserProfile, PlainUserProfile } from "@/types/student"

/** Convert Firebase Admin Timestamp fields to plain numbers for Server→Client prop passing. */
export function serializeProfile(profile: UserProfile): PlainUserProfile {
  return {
    uid:                  profile.uid,
    email:                profile.email,
    name:                 profile.name,
    photo_url:            profile.photo_url,
    exam:                 profile.exam,
    prep_level:           profile.prep_level,
    level:                profile.level,
    xp_total:             profile.xp_total,
    xp_this_week:         profile.xp_this_week,
    streak_current:       profile.streak_current,
    streak_max:           profile.streak_max,
    streak_freezes:       profile.streak_freezes,
    chapter_health:       profile.chapter_health,
    subject_accuracy:     profile.subject_accuracy,
    wrong_questions:      profile.wrong_questions,
    weak_subjects:        profile.weak_subjects,
    onboarding_complete:  profile.onboarding_complete,
    goal_refreshes_today: profile.goal_refreshes_today,
    city:                 profile.city,
    invite_code:          profile.invite_code,
    friend_codes:         profile.friend_codes,
    target_date:          profile.target_date.toDate().getTime(),
    last_active:          profile.last_active.toDate().getTime(),
    goal_refresh_date:    profile.goal_refresh_date.toDate().getTime(),
    created_at:           profile.created_at.toDate().getTime(),
  }
}
