import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import StatCard from "@/components/dashboard/stat-card"
import AttendanceChart from "@/components/dashboard/attendance-chart"
import RecentActivity from "@/components/dashboard/recent-activity"
import { Users, Banknote, CalendarCheck, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getAttendanceTrend(campusId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const trend = []

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const present = await prisma.attendance.count({
      where: { campusId, date, status: "PRESENT" },
    })
    const absent = await prisma.attendance.count({
      where: { campusId, date, status: "ABSENT" },
    })
    trend.push({ date: formatted, present, absent })
  }

  return trend
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const campusId = session.user.campusId
  const totalStudents = await prisma.student.count({ where: { campusId } })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const presentCount = await prisma.attendance.count({ where: { campusId, date: today, status: "PRESENT" } })
  const totalToday = await prisma.attendance.count({ where: { campusId, date: today } })
  const attendancePercent = totalToday ? Math.round((presentCount / totalToday) * 100) : 0

  const feeCollection = await prisma.feeVoucher.aggregate({
    where: {
      campusId,
      isPaid: true,
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    },
    _sum: { totalAmount: true },
  })

  const pendingAdmissions = await prisma.admission.count({ where: { campusId, status: "PENDING" } })
  const attendanceTrend = await getAttendanceTrend(campusId)

  const recentAdmissions = await prisma.admission.findMany({
    where: { campusId },
    orderBy: { createdAt: "desc" },
    take: 4,
  })

  const recentPayments = await prisma.payment.findMany({
    where: { campusId },
    orderBy: { paidAt: "desc" },
    take: 4,
  })

  const activities = [
    ...recentAdmissions.map((admission) => ({
      id: admission.id,
      type: "Admission",
      message: `New admission: ${admission.firstName} ${admission.lastName}`,
      time: new Date(admission.createdAt).toLocaleDateString(),
    })),
    ...recentPayments.map((payment) => ({
      id: payment.id,
      type: "Payment",
      message: `Payment received: PKR ${payment.amount}`,
      time: new Date(payment.paidAt).toLocaleDateString(),
    })),
  ].sort((a, b) => (a.time > b.time ? -1 : 1))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} />
        <StatCard title="Today's Attendance" value={`${attendancePercent}%`} description="Present ratio" icon={CalendarCheck} />
        <StatCard title="This Month Fees" value={`PKR ${feeCollection._sum.totalAmount ?? 0}`} description="Paid vouchers" icon={Banknote} />
        <StatCard title="Pending Admissions" value={pendingAdmissions} icon={GraduationCap} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AttendanceChart data={attendanceTrend} />
          </CardContent>
        </Card>

        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
