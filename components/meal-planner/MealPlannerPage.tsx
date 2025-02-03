'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GenerateMealsModal from '@/components/meal-planner/GenerateMealsModal';
import { CustomEvent } from '@/types/calendar';
import Navbar from '../Navbar';
import { Button } from '../ui/button';

const Calendar = dynamic(
  () => import('@/components/meal-planner/BigCalendar'),
  { ssr: false }
);

const MealPlannerPage = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealSchedules = async () => {
    try {
      const response = await fetch('/api/meal-schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch meal schedules');
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealSchedules();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMealPlanSuccess = () => {
    fetchMealSchedules();
  };

  const handleEventDrop = async (
    event: CustomEvent,
    start: Date,
    end: Date
  ) => {
    try {
      const response = await fetch(`/api/meal-schedules/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: start }),
      });

      if (!response.ok) {
        throw new Error('Failed to update meal schedule');
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === event.id ? { ...e, start, end } : e))
      );
    } catch (error) {
      console.error('Error updating event:', error);
      fetchMealSchedules();
    }
  };

  const handleEventResize = async (
    event: CustomEvent,
    start: Date,
    end: Date
  ) => {
    const durationInMinutes = Math.round(
      (end.getTime() - start.getTime()) / 60000
    );

    try {
      const response = await fetch(`/api/meal-schedules/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: start,
          duration: durationInMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update meal schedule');
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? { ...e, start, end, duration: durationInMinutes }
            : e
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
      fetchMealSchedules();
    }
  };

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-screen flex items-center justify-center text-red-500'>
        {error}
      </div>
    );
  }

  return (
    <div className='h-screen'>
      <div className='md:px-4'>
        <Navbar />
      </div>
      <header className='p-4 bg-gradient-to-r from-start-prim to-end-prim text-white flex justify-between items-center'>
        <h1 className='text-xl font-bold'>Meal Planner Calendar</h1>
        <Button
          className='text-white bg-black hover:bg-gray-800 rounded'
          onClick={() => setIsModalOpen(true)}
          variant={'default'}
        >
          Generate Meals
        </Button>
      </header>
      <main className='h-full'>
        <Calendar
          events={events}
          setEvents={setEvents}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
        />
        {isModalOpen && (
          <GenerateMealsModal
            onClose={handleCloseModal}
            onSuccess={handleMealPlanSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default MealPlannerPage;
