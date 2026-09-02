export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayStr(): string {
  return formatDateKey(new Date());
}

export function getWeekDays(referenceDate: Date = new Date()): { date: Date; dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const curr = new Date(referenceDate);
  // Get Monday of current week (assuming Monday is start of week)
  const dayOfWeek = curr.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMon = (dayOfWeek + 6) % 7;
  
  const monday = new Date(curr);
  monday.setDate(curr.getDate() - distanceToMon);
  
  const days = [];
  const todayStr = getTodayStr();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDateKey(d);
    
    days.push({
      date: d,
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

export function getPastNDays(n: number, referenceDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - i);
    dates.push(formatDateKey(d));
  }
  return dates;
}

export function getMonthCalendarGrid(year: number, monthIndex: number): { dateStr: string; dayNumber: number; inCurrentMonth: boolean; isToday: boolean }[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  
  // Starting day of week (Monday = 0)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();
  
  const grid: { dateStr: string; dayNumber: number; inCurrentMonth: boolean; isToday: boolean }[] = [];
  const todayStr = getTodayStr();

  // Prev month padding
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    const dateStr = formatDateKey(d);
    grid.push({
      dateStr,
      dayNumber: d.getDate(),
      inCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, monthIndex, i);
    const dateStr = formatDateKey(d);
    grid.push({
      dateStr,
      dayNumber: i,
      inCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Next month padding to fill complete weeks (42 cells total for 6 rows)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const dateStr = formatDateKey(d);
    grid.push({
      dateStr,
      dayNumber: i,
      inCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return grid;
}

export function formatReadableDate(dateStr: string): string {
  const date = parseDateKey(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getMonthName(monthIndex: number): string {
  const date = new Date(2026, monthIndex, 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}
