import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "ghost" | "outline" | "secondary"

type ButtonSize = "default" | "icon" | "sm"

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-slate-950 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-950 hover:bg-slate-100",
  outline: "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
  secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200",
}

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-4 py-2 text-sm",
  icon: "h-10 w-10 p-0",
  sm: "h-9 px-3 text-sm",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
