import { FC } from "react";

type CalendarCell = { date: Date; inCurrentMonth: boolean; count: number };

interface CalendarProps {
  cells: CalendarCell[];
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}

const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const Calendar: FC<CalendarProps> = ({ cells, selectedDate, onSelectDate }) => {
  return (
    <div className="rounded-lg border p-3">
      {/* Header row */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500">
        {dayNames.map((n) => (
          <div key={n} className="py-2">{n}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          const isSelected = c.date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={c.date.toISOString()}
              onClick={() => onSelectDate(new Date(c.date))}
              className={[
                "rounded p-2 text-left transition border",
                c.inCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.date.getDate()}</span>
                {c.count > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 text-xs text-blue-700">
                    {c.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
