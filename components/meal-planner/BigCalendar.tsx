import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  SlotInfo,
  View,
  Views,
} from 'react-big-calendar';
import withDragAndDrop, {
  EventInteractionArgs as DragAndDropArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import CustomToolbar from './CustomToolbar';
import EventWrapper from './EventWrapper';
import { CustomEvent } from '@/types/calendar';
import { useEffect, useState } from 'react';

const locales = {
  'en-US': () => import('date-fns/locale/en-US'),
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
  onEventDelete?: (event: CustomEvent) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  setEvents,
  onEventDrop,
  onEventResize,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('week');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setView(Views.DAY);
      } else {
        setView(Views.WEEK);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Prevent creation of all-day events
    if (slotInfo.action === 'select' && slotInfo.bounds) {
      const title = window.prompt('New event name');
      if (title) {
        const newEvent: CustomEvent = {
          id: Date.now(),
          title,
          start: slotInfo.start,
          end: slotInfo.end,
        };
        setEvents([...events, newEvent]);
      }
    }
  };

  const eventPropGetter = () => ({
    className: 'event-wrapper',
    style: {
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '4px',
      padding: 0,
    },
  });

  const moveEvent = (args: DragAndDropArgs<object>) => {
    const { event, start, end } = args as DragAndDropArgs<CustomEvent>;
    onEventDrop?.(event, new Date(start), new Date(end));
  };

  const handleResize = (args: DragAndDropArgs<object>) => {
    const { event, start, end } = args as DragAndDropArgs<CustomEvent>;
    onEventResize?.(event, new Date(start), new Date(end));
  };

  const handleEventDelete = async (event: CustomEvent) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        const response = await fetch(`/api/meal-schedules/${event.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setEvents(events.filter((e) => e.id !== event.id));
        } else {
          console.error('Failed to delete the event');
        }
      } catch (error) {
        console.error('Error deleting the event:', error);
      }
    }
  };

  return (
    <div className='h-full [&_.rbc-allday-cell]:hidden [&_.rbc-time-view_.rbc-header]:border-b [&_.rbc-time-view_.rbc-header]:border-gray-200'>
      <DragAndDropCalendar
        localizer={localizer}
        events={events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
        defaultView={Views.WEEK}
        view={view}
        onView={setView}
        resizable
        style={{ height: 'calc(100vh - 80px)' }}
        step={30}
        timeslots={2}
        date={currentDate}
        onNavigate={handleNavigate}
        components={{
          toolbar: (props) => <CustomToolbar {...props} />,
          event: (props) => (
            <EventWrapper
              {...props}
              event={props.event as CustomEvent}
              onDelete={handleEventDelete}
            />
          ),
        }}
        views={[Views.WEEK, Views.DAY]}
        eventPropGetter={eventPropGetter}
        draggableAccessor={() => true}
        onEventDrop={moveEvent}
        onEventResize={handleResize}
        onSelectEvent={() => {}}
        formats={{
          eventTimeRangeFormat: () => '',
          eventTimeRangeEndFormat: () => '',
        }}
        showAllEvents={false}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default Calendar;