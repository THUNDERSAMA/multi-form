"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

interface DayCell {
  day: number
  outside: boolean
  date: Date
}

interface Week {
  number: number
  cells: DayCell[]
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function buildWeeks(year: number, month: number): Week[] {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: DayCell[] = []
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    cells.push({ day, outside: true, date: new Date(year, month - 1, day) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, date: new Date(year, month, d) })
  }
  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, outside: true, date: new Date(year, month + 1, nextDay) })
    nextDay++
  }

  const weeks: Week[] = []
  for (let i = 0; i < cells.length; i += 7) {
    const row = cells.slice(i, i + 7)
    weeks.push({ number: getWeekNumber(row[0].date), cells: row })
  }
  return weeks
}

function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export interface CalendarProps {
  /** Currently selected date (controlled). Defaults to uncontrolled internal state if omitted. */
  selected?: Date
  /** Called with the newly selected date. */
  onSelect?: (date: Date) => void
  /** Month currently displayed (controlled). */
  month?: Date
  /** Called when the visible month changes. */
  onMonthChange?: (month: Date) => void
  className?: string
}

function Calendar({ selected: selectedProp, onSelect, month: monthProp, onMonthChange, className }: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])

  const [internalSelected, setInternalSelected] = React.useState<Date>(today)
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const selected = selectedProp ?? internalSelected
  const view = monthProp ?? internalMonth

  const weeks = React.useMemo(() => buildWeeks(view.getFullYear(), view.getMonth()), [view])

  const goto = (delta: number) => {
    const next = new Date(view.getFullYear(), view.getMonth() + delta, 1)
    if (onMonthChange) onMonthChange(next)
    else setInternalMonth(next)
  }

  const handleSelect = (date: Date) => {
    if (onSelect) onSelect(date)
    else setInternalSelected(date)
  }

  return (
    <div className={["flex justify-center bg-[#EDEBE3] p-10", className].filter(Boolean).join(" ")}>
      <div
        className="w-[640px] rounded-[2px] bg-[#F7F5EE] shadow-[0_1px_2px_rgba(30,26,16,0.08)]"
        style={{ fontFamily: "'Iowan Old Style', Georgia, 'Times New Roman', serif" }}
      >
        {/* Header band */}
        <div className="flex items-center justify-between border-b border-[#DAD5C4] px-5 py-4">
          <button
            type="button"
            onClick={() => goto(-1)}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8A8570] transition-colors hover:bg-[#EAE6D8] hover:text-[#1E1A10]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="text-center">
            <div className="text-[17px] tracking-[0.02em] text-[#1E1A10]">{MONTHS[view.getMonth()]}</div>
            <div
              className="text-[11px] tracking-[0.25em] text-[#A6742C]"
              style={{ fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace" }}
            >
              {view.getFullYear()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => goto(1)}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8A8570] transition-colors hover:bg-[#EAE6D8] hover:text-[#1E1A10]"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Grid */}
        <div className="px-4 pb-5 pt-3">
          <div className="flex">
            <div className="w-7 shrink-0" />
            <div className="grid flex-1 grid-cols-7">
              {WEEKDAYS.map((w, i) => (
                <div
                  key={i}
                  className="flex h-8 items-center justify-center text-[10px] font-medium tracking-[0.15em] text-[#A29C86]"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="flex items-center">
              <div
                className="flex w-7 shrink-0 items-center justify-end pr-2 text-[10px] text-[#C2BCA4]"
                style={{ fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace" }}
              >
                {week.number}
              </div>
              <div className="grid flex-1 grid-cols-7 border-l border-[#E4E0D2]">
                {week.cells.map((cell, ci) => {
                  const isSelected = isSameDay(cell.date, selected)
                  const isToday = isSameDay(cell.date, today)
                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => handleSelect(cell.date)}
                      className={[
                        "relative flex h-9 items-center justify-center text-[13px] transition-colors",
                        cell.outside ? "text-[#CFCAB8]" : "text-[#3A3626]",
                        !isSelected && !cell.outside ? "hover:bg-[#EAE6D8]" : "",
                        isSelected ? "bg-[#A6742C] text-[#F7F5EE]" : "",
                      ].join(" ")}
                    >
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1.5 h-[3px] w-[3px] rounded-full bg-[#3E6259]" />
                      )}
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-[#DAD5C4] px-5 py-2.5 text-[11px] text-[#A29C86]"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        >
          <span>Week {getWeekNumber(selected)}</span>
          <span>
            {selected.getDate()} {MONTHS[selected.getMonth()].slice(0, 3)} {selected.getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }