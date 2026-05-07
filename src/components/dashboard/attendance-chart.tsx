"use client"

interface AttendanceData {
  date: string
  present: number
  absent: number
}

interface AttendanceChartProps {
  data: AttendanceData[]
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  const maxCount = Math.max(...data.flatMap((item) => [item.present, item.absent]), 1)

  return (
    <div className="space-y-4 p-4">
      {data.map((item) => (
        <div key={item.date} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{item.date}</span>
            <span>{item.present} present · {item.absent} absent</span>
          </div>
          <div className="space-y-1">
            <div className="h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${(item.present / maxCount) * 100}%` }}
              />
            </div>
            <div className="h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${(item.absent / maxCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
