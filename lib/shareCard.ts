"use client"

export async function generateShareCard(
  score: number,
  maxScore: number,
  accuracy: number,
  xp: number,
  level: number,
  levelTitle: string,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext("2d")!

  // Background
  ctx.fillStyle = "#0E0E0F"
  ctx.fillRect(0, 0, 1080, 1920)

  // Brand header
  ctx.fillStyle = "#E8E8E8"
  ctx.font = "bold 60px Inter, Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("HelloBhaiya", 540, 200)

  ctx.font = "32px Inter, Arial, sans-serif"
  ctx.fillStyle = "#888888"
  ctx.fillText("Study harder. Level up.", 540, 260)

  // Score
  ctx.font = "bold 160px Inter, Arial, sans-serif"
  ctx.fillStyle = accuracy >= 75 ? "#90D4A8" : accuracy >= 50 ? "#E0C078" : "#E09090"
  ctx.textAlign = "center"
  ctx.fillText(`${score}`, 540, 700)

  ctx.font = "48px Inter, Arial, sans-serif"
  ctx.fillStyle = "#888888"
  ctx.fillText(`/ ${maxScore}`, 540, 780)

  ctx.font = "bold 72px Inter, Arial, sans-serif"
  ctx.fillStyle = "#E8E8E8"
  ctx.fillText(`${accuracy}% accuracy`, 540, 900)

  // XP
  ctx.font = "bold 56px Inter, Arial, sans-serif"
  ctx.fillStyle = "#E0C078"
  ctx.fillText(`+${xp} XP`, 540, 1050)

  // Level
  ctx.fillStyle = "#E8E8E8"
  ctx.font = "bold 44px Inter, Arial, sans-serif"
  ctx.fillText(`Level ${level} · ${levelTitle}`, 540, 1150)

  // Footer
  ctx.font = "28px Inter, Arial, sans-serif"
  ctx.fillStyle = "#444444"
  ctx.fillText("hellobhaiya.vercel.app", 540, 1800)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Failed to generate share card"))
    }, "image/png")
  })
}

export async function shareOrDownloadCard(blob: Blob, filename: string): Promise<void> {
  if (navigator.share && navigator.canShare({ files: [new File([blob], filename, { type: "image/png" })] })) {
    await navigator.share({
      files: [new File([blob], filename, { type: "image/png" })],
      title: "HelloBhaiya — My test result",
    })
  } else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
}
