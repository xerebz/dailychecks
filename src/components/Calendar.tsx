import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface CalendarDay {
  date: Date | null;
  checked: boolean;
}

const Calendar: React.FC = () => {
  const [days, setDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: CalendarDay[] = [];

    // Add empty days for the days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push({ date: null, checked: false });
    }

    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const checked = localStorage.getItem(dateString) === 'true';
      calendarDays.push({ date, checked });
    }

    setDays(calendarDays);
  }, []);

  const toggleDay = (index: number) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      if (newDays[index].date) {
        const newChecked = !newDays[index].checked;
        newDays[index] = { ...newDays[index], checked: newChecked };
        
        // Save to localStorage
        const dateString = newDays[index].date!.toISOString().split('T')[0];
        localStorage.setItem(dateString, newChecked.toString());
      }
      return newDays;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            className={`aspect-square flex items-center justify-center rounded-full border ${
              day.date
                ? day.checked
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
                : 'invisible'
            }`}
            onClick={() => toggleDay(index)}
            disabled={!day.date}
          >
            {day.date && (
              day.checked ? (
                <Check size={20} />
              ) : (
                day.date.getDate()
              )
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;