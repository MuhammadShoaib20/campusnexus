import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  type: string
  message: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3 p-4">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activities</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                <p className="mt-1 text-xs text-slate-500">{activity.type} · {activity.time}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
