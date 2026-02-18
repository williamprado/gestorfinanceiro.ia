
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

const CustomScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <CustomScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
CustomScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const CustomScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors duration-300 ease-out hover:bg-orange-100/50",
      orientation === "vertical" &&
        "h-full w-3 border-l border-l-transparent p-[1px] hover:w-4",
      orientation === "horizontal" &&
        "h-3 flex-col border-t border-t-transparent p-[1px] hover:h-4",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className="relative flex-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg transition-all duration-300 ease-out hover:from-orange-500 hover:to-orange-700 hover:shadow-xl before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
CustomScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { CustomScrollArea, CustomScrollBar }
