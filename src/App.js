import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import eventsData from "./events.json";
import {
  LayoutDashboard,
  CalendarCheck,
  NotebookPen,
  Sun,
  Moon,
  CalendarDays,
  Clock,
  ListTodo,
  Trash2,
  Pencil,
  BarChart2,
  ChevronDown,
} from "lucide-react";

function App() {
  const [currentPage, setCurrentPage] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [calendarView, setCalendarView] = useState("month"); // 'month' or 'year'

  const [userEvents, setUserEvents] = useState(() => {
    const stored = localStorage.getItem("userEvents");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("userEvents", JSON.stringify(userEvents));
  }, [userEvents]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Calendar data functions
  const getMonthData = () => dayjs(new Date(currentYear, currentMonth, 1));
  const currentDate = getMonthData();
  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const goToPreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const goToNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  // Event handlers
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setEditIndex(null);
    setNewEventTitle("");
  };

  const handleAddOrUpdateEvent = () => {
    if (newEventTitle.trim() !== "") {
      if (editIndex !== null) {
        const updated = [...userEvents];
        updated[editIndex].title = newEventTitle;
        setUserEvents(updated);
      } else {
        const newEvent = { title: newEventTitle, date: selectedDate };
        setUserEvents([...userEvents, newEvent]);
      }
      setNewEventTitle("");
      setEditIndex(null);
      setShowModal(false);
    }
  };

  const handleEdit = (index) => {
    const eventToEdit = userEvents[index];
    setSelectedDate(eventToEdit.date);
    setNewEventTitle(eventToEdit.title);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const updated = [...userEvents];
    updated.splice(index, 1);
    setUserEvents(updated);
  };

  // Data processing
  const combinedEvents = [...eventsData, ...userEvents];
  const today = dayjs().format("YYYY-MM-DD");
  const upcomingEvent = combinedEvents.find((e) => dayjs(e.date).isAfter(today));

  const thisWeekStart = dayjs().startOf("week");
  const thisWeekEnd = dayjs().endOf("week");
  const thisMonthStart = dayjs().startOf("month");
  const thisMonthEnd = dayjs().endOf("month");

  const weeklyEvents = combinedEvents.filter((e) =>
    dayjs(e.date).isAfter(thisWeekStart.subtract(1, "day")) &&
    dayjs(e.date).isBefore(thisWeekEnd.add(1, "day"))
  );

  const monthlyEvents = combinedEvents.filter((e) =>
    dayjs(e.date).isAfter(thisMonthStart.subtract(1, "day")) &&
    dayjs(e.date).isBefore(thisMonthEnd.add(1, "day"))
  );

  // Calendar view components
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const YearView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={goToPreviousYear} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <ChevronDown size={20} className="transform rotate-90" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMonthYearPicker(prev => !prev)}
              className="text-2xl font-bold font-serif text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {currentYear}
              <ChevronDown size={18} className="inline ml-2" />
            </button>
            
            {showMonthYearPicker && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="grid grid-cols-4 gap-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setCurrentYear(year);
                          setShowMonthYearPicker(false);
                        }}
                        className={`p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          year === currentYear
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={goToNextYear} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <ChevronDown size={20} className="transform -rotate-90" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map((month, monthIndex) => {
            const monthDate = dayjs(new Date(currentYear, monthIndex, 1));
            const daysInMonth = monthDate.daysInMonth();
            const startDay = monthDate.startOf("month").day();
            
            const monthDays = [];
            for (let i = 0; i < startDay; i++) monthDays.push(null);
            for (let i = 1; i <= daysInMonth; i++) monthDays.push(i);
            
            return (
              <div 
                key={month} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-semibold text-center text-gray-800 dark:text-white">
                    {month}
                  </h3>
                </div>
                
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 p-1">
                  {monthDays.map((day, dayIndex) => {
                    const dateObj = dayjs(new Date(currentYear, monthIndex, day));
                    const formattedDate = dateObj.format("YYYY-MM-DD");
                    const isToday = day && dateObj.isSame(dayjs(), "day");
                    const eventsForDay = combinedEvents.filter((event) => event.date === formattedDate);
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`h-8 flex items-center justify-center text-sm relative
                          ${day ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""}
                          ${isToday ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                        onClick={() => {
                          if (day) {
                            setCurrentMonth(monthIndex);
                            setCalendarView("month");
                          }
                        }}
                      >
                        {day || ""}
                        {eventsForDay.length > 0 && (
                          <div className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MonthView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={goToPreviousMonth} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <ChevronDown size={20} className="transform rotate-90" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowMonthYearPicker(prev => !prev)}
                className="text-xl font-bold font-serif text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {currentYear}
                <ChevronDown size={16} className="inline ml-2" />
              </button>
              
              {showMonthYearPicker && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="grid grid-cols-4 gap-1">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setCurrentYear(year);
                            setShowMonthYearPicker(false);
                          }}
                          className={`p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            year === currentYear
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMonthYearPicker(prev => !prev)}
                className="text-2xl font-bold font-serif text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {currentDate.format("MMMM")}
                <ChevronDown size={18} className="inline ml-2" />
              </button>
              
              {showMonthYearPicker && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => {
                          setCurrentMonth(index);
                          setShowMonthYearPicker(false);
                        }}
                        className={`p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          index === currentMonth
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={goToNextMonth} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <ChevronDown size={20} className="transform -rotate-90" />
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-7 text-center font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 py-3 border-b border-gray-200 dark:border-gray-700">
            {daysOfWeek.map((day) => (
              <div key={day} className="uppercase text-xs tracking-wider">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dateObj = dayjs(new Date(currentYear, currentMonth, day));
              const isToday = day && dateObj.isSame(dayjs(), "day");
              const formattedDate = dateObj.format("YYYY-MM-DD");
              const eventsForDay = combinedEvents.filter((event) => event.date === formattedDate);

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 flex flex-col items-start border border-gray-100 dark:border-gray-700 transition-colors
                    ${day ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" : "bg-gray-50 dark:bg-gray-900"}
                    ${isToday ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20" : ""}`}
                  onClick={() => day && handleDateClick(formattedDate)}
                >
                  <div className={`relative font-medium text-sm w-6 h-6 flex items-center justify-center rounded-full 
                    ${isToday ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {day || ""}
                  </div>
                  <div className="mt-1 w-full space-y-1">
                    {eventsForDay.slice(0, 2).map((event, idx) => (
                      <div 
                        key={idx} 
                        className={`px-2 py-1 rounded text-xs truncate ${
                          isToday 
                            ? "bg-blue-600/10 text-blue-800 dark:text-blue-200" 
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {eventsForDay.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                        +{eventsForDay.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition duration-300 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 space-y-6 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 font-serif text-gray-800 dark:text-white">Calendar</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setCurrentPage("dashboard")} 
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all ${currentPage === "dashboard" ? "bg-white dark:bg-gray-700 shadow-md" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            <LayoutDashboard size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Dashboard Insights</span>
          </button>
          <button 
            onClick={() => setCurrentPage("events")} 
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all ${currentPage === "events" ? "bg-white dark:bg-gray-700 shadow-md" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            <NotebookPen size={18} className="text-green-600 dark:text-green-400" />
            <span className="font-medium">Manage Events</span>
          </button>
          <button 
            onClick={() => {
              setCurrentPage("calendar");
              setCalendarView("month");
            }} 
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all ${currentPage === "calendar" ? "bg-white dark:bg-gray-700 shadow-md" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            <CalendarCheck size={18} className="text-purple-600 dark:text-purple-400" />
            <span className="font-medium">Calendar View</span>
          </button>
        </nav>
        <div className="mt-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-2 w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all shadow-sm"
          >
            {darkMode ? (
              <>
                <Sun size={16} className="text-yellow-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        {currentPage === "dashboard" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
                <LayoutDashboard size={28} className="inline mr-3 text-blue-600 dark:text-blue-400" />
                Overview & Analytics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                icon={<CalendarDays className="text-blue-600 dark:text-blue-400" />} 
                title="Today's Date" 
                value={dayjs().format("MMMM D, YYYY")} 
                color="blue" 
              />
              <DashboardCard 
                icon={<ListTodo className="text-green-600 dark:text-green-400" />} 
                title="Total Events" 
                value={combinedEvents.length} 
                color="green" 
              />
              <DashboardCard 
                icon={<Clock className="text-purple-600 dark:text-purple-400" />} 
                title="Next Upcoming Event" 
                value={upcomingEvent ? `${upcomingEvent.title} – ${dayjs(upcomingEvent.date).format("MMM D")}` : "No upcoming events"} 
                color="purple" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsCard
                title="This Week's Events"
                count={weeklyEvents.length}
                items={weeklyEvents}
                color="orange"
                icon={<BarChart2 className="text-orange-600 dark:text-orange-400" />}
              />
              <AnalyticsCard
                title="This Month's Events"
                count={monthlyEvents.length}
                items={monthlyEvents}
                color="cyan"
                icon={<BarChart2 className="text-cyan-600 dark:text-cyan-400" />}
              />
            </div>
          </div>
        )}

        {/* Events Page */}
        {currentPage === "events" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
                <NotebookPen size={28} className="inline mr-3 text-green-600 dark:text-green-400" />
                Event Log
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {combinedEvents.map((event, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {dayjs(event.date).format("MMMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {idx >= eventsData.length && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(idx - eventsData.length)} 
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(idx - eventsData.length)} 
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Page */}
        {currentPage === "calendar" && (
          <div className="space-y-6">
            {calendarView === "year" ? <YearView /> : <MonthView />}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 font-serif text-gray-800 dark:text-white">
              {editIndex !== null ? "Edit Event" : `New Event for ${dayjs(selectedDate).format("MMMM D, YYYY")}`}
            </h2>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setShowModal(false); setEditIndex(null); }} 
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddOrUpdateEvent} 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {editIndex !== null ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Components
const DashboardCard = ({ icon, title, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md`}>
    <div className={`flex items-center gap-3 text-${color}-600 dark:text-${color}-400 mb-3`}>
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
        {icon}
      </div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{title}</p>
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const AnalyticsCard = ({ title, count, items, color, icon }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
    <div className={`flex items-center gap-3 text-${color}-600 dark:text-${color}-400 mb-4`}>
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-800 dark:text-white">
        {title} <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{count}</span>
      </h3>
    </div>
    <ul className="space-y-2">
      {items.length > 0 ? (
        items.map((e, i) => (
          <li key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-gray-700 dark:text-gray-300">{e.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{dayjs(e.date).format("MMM D")}</span>
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-500 dark:text-gray-400 py-2">No events scheduled</li>
      )}
    </ul>
  </div>
);

export default App;