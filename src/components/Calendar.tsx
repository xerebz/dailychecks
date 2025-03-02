import React, { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

interface CalendarDay {
  date: Date | null;
  checked: boolean;
}

interface CalendarData {
  [dateString: string]: boolean;
}

const Calendar: React.FC = () => {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchCalendarData = async (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: CalendarDay[] = [];

    // Add empty days for the days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push({ date: null, checked: false });
    }

    // Add the actual days of the month
    const calendarRef = doc(collection(db, "calendars"), `${year}-${month + 1}`);
    const calendarDoc = await getDoc(calendarRef);
    const calendarData = calendarDoc.data() as CalendarData | undefined || {};

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split("T")[0];
      const checked = calendarData[dateString] || false;
      calendarDays.push({ date, checked });
    }

    setDays(calendarDays);
  };

  useEffect(() => {
    // Use void to explicitly mark that we're ignoring the promise
    void fetchCalendarData(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const toggleDay = async (index: number) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      if (newDays[index].date) {
        const newChecked = !newDays[index].checked;
        newDays[index] = { ...newDays[index], checked: newChecked };

        // Save to Firebase
        const date = newDays[index].date!;
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dateString = date.toISOString().split("T")[0];
        const calendarRef = doc(collection(db, "calendars"), `${year}-${month}`);

        // Use void to explicitly mark that we're ignoring the promise
        void setDoc(calendarRef, {
          [dateString]: newChecked,
        }, { merge: true })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
      return newDays;
    });
  };

  // Create a handler that doesn't return a promise for the onClick event
  const handleToggleDay = (index: number) => {
    void toggleDay(index);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
                : "invisible"
            }`}
            onClick={() => handleToggleDay(index)}
            disabled={!day.date}
          >
            {day.date &&
              (day.checked ? <Check size={20} /> : day.date.getDate())}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
