import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AppointmentCalendar = ({ initialDuration = 60 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleAppointments = [
    {
      date: '2024-05-15T00:00:00+07:00',
      start: '2024-05-15T10:00:00+07:00',
      end: '2024-05-15T11:00:00+07:00'
    },
    {
      date: '2024-05-15T00:00:00+07:00',
      start: '2024-05-15T14:30:00+07:00',
      end: '2024-05-15T15:30:00+07:00'
    },
    {
      date: '2024-05-20T00:00:00+07:00',
      start: '2024-05-20T09:00:00+07:00',
      end: '2024-05-20T10:30:00+07:00'
    },
    {
      date: '2024-05-25T00:00:00+07:00',
      start: '2024-05-25T13:00:00+07:00',
      end: '2024-05-25T14:00:00+07:00'
    }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/getAppointments");
        if (response.ok) {
          const data = await response.json();
          setAllAppointments(exampleAppointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();
      const hasAppointments = allAppointments.some(
        (app) => new Date(app.date).toDateString() === date.toDateString()
      );

      days.push(
        <Button
          key={day}
          variant={isSelected ? "default" : "outline"}
          className={`h-12 ${isToday ? "border-primary" : ""} ${
            hasAppointments ? "bg-red-100" : ""
          }`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    generateAvailableSlots(date);
    setIsModalOpen(true);
  };

  const generateAvailableSlots = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const dateString = localDate.toISOString().split("T")[0];
    console.log("Selected date:", dateString);

    const dayAppointments = allAppointments.filter((app) => {
      const appDate = new Date(app.date);
      const appLocalDate = new Date(
        appDate.getTime() - appDate.getTimezoneOffset() * 60000
      );
      const appDateString = appLocalDate.toISOString().split("T")[0];
      return appDateString === dateString;
    });

    console.log("Filtered appointments:", dayAppointments);

    const slots = [];

    for (let hour = 8; hour < 20; hour++) {
      // Assuming business hours from 8 AM to 8 PM
      for (let minute = 0; minute < 60; minute += 15) {
        // 15-minute intervals
        const startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour,
          minute
        );
        const endTime = new Date(startTime.getTime() + initialDuration * 60000);

        const isAvailable = !dayAppointments.some((appointment) => {
          const appointmentStart = new Date(appointment.start);
          const appointmentEnd = new Date(appointment.end);

          return startTime < appointmentEnd && endTime > appointmentStart;
        });

        if (isAvailable) {
          slots.push(startTime);
        }
      }
    }

    setAvailableSlots(slots);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSlotSelection = (slot) => {
    console.log("Selected slot:", slot);
    // Here you would typically handle the slot selection, e.g., by opening a confirmation dialog
    // or by sending the selection to a parent component
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-2xl font-bold">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center font-medium">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{generateCalendarDays()}</div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              Available Time Slots for {selectedDate?.toDateString()}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-primaryBg">
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  onClick={() => handleSlotSelection(slot)}
                  variant="outline"
                  className="w-full"
                >
                  {formatTime(slot)}
                  {" XX"}
                </Button>
              ))}
            </div>
            {availableSlots.length === 0 && (
              <p>No available slots for this date.</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AppointmentCalendar;
