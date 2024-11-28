import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  ToolbarProps,
  SlotInfo,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";
import { CustomEvent } from "@/types/calendar";
import { useState } from "react";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const title = window.prompt("New event name");
    if (title) {
      const newEvent: CustomEvent = {
        id: Date.now(),
        title,
        start: slotInfo.start,
        end: slotInfo.end,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event: CustomEvent) => {
    if (confirm(`Delete the event "${event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  const eventPropGetter = () => ({
    className: "bg-blue-500 text-white rounded px-2",
  });

  return (
    <div className="h-full">
      <BigCalendar
        localizer={localizer}
        events={events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
        defaultView="week"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "calc(100vh - 80px)" }}
        step={30}
        timeslots={2}
        date={currentDate}
        onNavigate={handleNavigate}
        components={{
          toolbar: CustomToolbar as React.ComponentType<
            ToolbarProps<
              {
                start: Date;
                end: Date;
                id: string | number;
                title: string;
                allDay?: boolean | undefined;
              },
              object
            >
          >,
        }}
        views={["week"]}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default Calendar;
