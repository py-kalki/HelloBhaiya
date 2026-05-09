import { StudyRoomUI } from "@/components/study-room/StudyRoomUI"

export default async function StudyRoomPage({
  params,
}: {
  params: Promise<{ roomCode: string }>
}) {
  const roomCode = (await params).roomCode

  return (
    <div className="w-full">
      <StudyRoomUI roomCode={roomCode} />
    </div>
  )
}
