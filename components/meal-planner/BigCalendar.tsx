import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  ToolbarProps,
  SlotInfo,
  View,
} from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs as DragAndDropArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
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

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

interface CalendarProps {
  events: CustomEvent[];
  setEvents: (events: CustomEvent[]) => void;
  onEventDrop?: (event: CustomEvent, start: Date, end: Date) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  setEvents,
  onEventDrop,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");

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

  const handleSelectEvent = (
    event: any,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const customEvent = event as CustomEvent;
    if (confirm(`Delete the event "${customEvent.title}"?`)) {
      setEvents(events.filter((e) => e.id !== customEvent.id));
    }
  };

  const eventPropGetter = () => ({
    className: "bg-blue-500 text-white rounded px-2",
  });

  const moveEvent = (args: DragAndDropArgs<object>) => {
    const { event, start, end } = args as DragAndDropArgs<CustomEvent>;
    onEventDrop?.(event, new Date(start), new Date(end));
  };

  return (
    <div className="h-full">
      <DragAndDropCalendar
        localizer={localizer}
        events={events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
        defaultView="week"
        view={view}
        onView={setView}
        resizable
        style={{ height: "calc(100vh - 80px)" }}
        step={30}
        timeslots={2}
        date={currentDate}
        onNavigate={handleNavigate}
        components={{
          toolbar: (props) => <CustomToolbar {...props} />,
        }}
        views={["week"]}
        eventPropGetter={eventPropGetter}
        draggableAccessor={() => true}
        onEventDrop={moveEvent}
      />
    </div>
  );
};

export default Calendar;
