import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  ToolbarProps,
  SlotInfo,
  View,
  ResizeEvent,
  Components,
} from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs as DragAndDropArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomToolbar from "./CustomToolbar";
import EventWrapper from "./EventWrapper";
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
  onEventResize?: (event: CustomEvent, start: Date, end: Date) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  setEvents,
  onEventDrop,
  onEventResize,
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

  const eventPropGetter = () => ({
    className: "event-wrapper",
    style: {
      backgroundColor: "#3b82f6",
      border: "none",
      borderRadius: "4px",
      padding: 0,
    },
  });

  const moveEvent = (args: DragAndDropArgs<object>) => {
    const { event, start, end } = args as DragAndDropArgs<CustomEvent>;
    onEventDrop?.(event, new Date(start), new Date(end));
  };

  const handleResize = (args: ResizeEvent<CustomEvent>) => {
    const { event, start, end } = args;
    onEventResize?.(event, new Date(start), new Date(end));
  };

  return (
    <>
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
            event: EventWrapper,
          }}
          views={["week"]}
          eventPropGetter={eventPropGetter}
          draggableAccessor={() => true}
          onEventDrop={moveEvent}
          onEventResize={handleResize}
          onSelectEvent={() => {}} // Empty function to prevent default behavior
          formats={{
            eventTimeRangeFormat: () => "",
            timeRangeFormat: () => "",
            eventTimeRangeEndFormat: () => "",
          }}
        />
      </div>
    </>
  );
};

export default Calendar;
