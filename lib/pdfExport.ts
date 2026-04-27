"use client"

// Dynamic imports — never bundled into the initial chunk
export async function exportTestPDF(testId: string): Promise<void> {
  const element = document.getElementById("pdf-template")
  if (!element) throw new Error("PDF template element not found")

  const [html2canvas, { jsPDF }] = await Promise.all([
    import("html2canvas").then((m) => m.default),
    import("jspdf"),
  ])

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
  })

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)

  const date = new Date().toISOString().split("T")[0]!
  pdf.save(`hellobhaiya-${testId.slice(0, 8)}-${date}.pdf`)
}
