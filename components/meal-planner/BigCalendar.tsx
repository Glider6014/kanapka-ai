import { Calendar, momentLocalizer, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";
import { CustomEvent } from "@/types/calendar";

interface BigCalendarProps {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
}

interface BigCalendarProps {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
}

const localizer = momentLocalizer(moment);

const BigCalendar: React.FC<BigCalendarProps> = ({ events, setEvents }) => {
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent: CustomEvent = {
        id: events.length + 1,
        title,
        start,
        end,
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
