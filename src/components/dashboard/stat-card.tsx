import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
}

export default function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-4">
      <CardHeader className="flex items-center justify-between gap-4 p-0 pb-4">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-5 w-5 text-slate-400" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-3xl font-semibold text-slate-950">{value}</div>
        {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      </CardContent>
    </Card>
  )
}
