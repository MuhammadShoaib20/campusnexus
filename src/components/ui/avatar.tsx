import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-100", className)} {...props} />
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex h-full w-full items-center justify-center text-sm font-medium text-slate-700", className)} {...props} />
}

export function AvatarImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("h-full w-full object-cover", className)} {...props} />
}
