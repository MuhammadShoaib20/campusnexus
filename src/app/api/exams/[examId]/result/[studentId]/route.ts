import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ examId: string; studentId: string }> }
) {
  void _req
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { examId, studentId } = await params

  const student = await prisma.student.findUnique({ where: { id: studentId } })
  if (!student || student.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      examSubjects: {
        include: {
          subject: true,
          marks: { where: { studentId }, select: { obtainedMarks: true } },
        },
      },
    },
  })
  if (!exam || exam.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 })
  }

  // Prepare labels and data for chart
  const labels: string[] = []
  const data: number[] = []
  const maxMarks: number[] = []
  exam.examSubjects.forEach(es => {
    labels.push(es.subject.name)
    maxMarks.push(es.maxMarks)
    const obtained = es.marks[0]?.obtainedMarks ?? 0
    data.push(obtained)
  })

  // Build QuickChart URL
  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Obtained', data },
        { label: 'Max', data: maxMarks },
      ],
    },
    options: {
      plugins: { title: { display: true, text: `${student.firstName} ${student.lastName} - ${exam.name}` } },
    },
  }
  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`

  // Fetch chart image
  const imgRes = await fetch(chartUrl)
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
  const imgBase64 = imgBuffer.toString('base64')

  // Create PDF
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(`Result Card`, 20, 20)
  doc.setFontSize(12)
  doc.text(`Student: ${student.firstName} ${student.lastName}`, 20, 30)
  doc.text(`Exam: ${exam.name} (${exam.type})`, 20, 37)
  doc.text(`Date: ${new Date(exam.date).toLocaleDateString()}`, 20, 44)

  // Add chart image
  doc.addImage(`data:image/png;base64,${imgBase64}`, 'PNG', 15, 50, 180, 100)

  // Add subject table
  let y = 160
  doc.setFontSize(10)
  exam.examSubjects.forEach(es => {
    const obtained = es.marks[0]?.obtainedMarks ?? 0
    doc.text(`${es.subject.name}: ${obtained} / ${es.maxMarks}`, 20, y)
    y += 7
  })

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=result_${studentId}.pdf`,
    },
  })
}