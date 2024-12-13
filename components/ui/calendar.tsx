"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  fullHeight?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fullHeight = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className, { "h-full": fullHeight })}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 items-center justify-center",
        month: "space-y-4 items-center justify-center",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center justify-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-transparent mt-1 p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center h-20",
        head_cell:
          "[&:nth-child(1)]:text-red-500 text-muted-foreground rounded-md w-10 font-normal text-[2rem] text-center m-5 ",
        row: "flex w-full mt-2 justify-center",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-grow justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-20 w-20 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
