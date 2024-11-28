import {
  Calendar,
  momentLocalizer,
  ToolbarProps,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";
import { CustomEvent } from "@/types/calendar";
import { useState } from "react";

interface BigCalendarProps {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
}

const localizer = momentLocalizer(moment);

const BigCalendar: React.FC<BigCalendarProps> = ({ events, setEvents }) => {
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

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
        step={30}
        timeslots={2}
        date={currentDate}
        onNavigate={handleNavigate}
        components={{
          toolbar: CustomToolbar as React.ComponentType<
            ToolbarProps<CustomEvent, object>
          >,
        }}
        views={["week"]}
      />
    </div>
  );
};

export default BigCalendar;
