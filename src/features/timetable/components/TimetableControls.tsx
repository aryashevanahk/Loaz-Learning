"use client";

import { Button } from "@/components/ui/button";

interface TimetableControlsProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function TimetableControls({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}: TimetableControlsProps) {
  const getWeekRange = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return `${start.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Button variant="secondary" size="sm" onClick={onPrevWeek}>
        ◀ Previous
      </Button>
      <div className="flex items-center gap-4">
        <span className="font-medium dark:text-white text-sm md:text-base">
          {getWeekRange()}
        </span>
        <Button variant="secondary" size="sm" onClick={onToday}>
          Today
        </Button>
      </div>
      <Button variant="secondary" size="sm" onClick={onNextWeek}>
        Next ▶
      </Button>
    </div>
  );
}
