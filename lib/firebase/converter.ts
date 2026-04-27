import type {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore"
import type { UserProfile, DailyGoal } from "@/types/student"
import type { Question } from "@/types/question"

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(profile: UserProfile): DocumentData {
    return { ...profile }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): UserProfile {
    return snapshot.data(options) as UserProfile
  },
}

export const dailyGoalConverter: FirestoreDataConverter<DailyGoal> = {
  toFirestore(goal: DailyGoal): DocumentData {
    return { ...goal }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): DailyGoal {
    return snapshot.data(options) as DailyGoal
  },
}

export const questionConverter: FirestoreDataConverter<Question> = {
  toFirestore(question: Question): DocumentData {
    return { ...question }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Question {
    return snapshot.data(options) as Question
  },
}
