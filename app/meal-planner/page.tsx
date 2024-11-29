"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import GenerateMealsModal from "@/components/meal-planner/GenerateMealsModal";
import { CustomEvent } from "@/types/calendar";

const Calendar = dynamic(
  () => import("@/components/meal-planner/BigCalendar"),
  { ssr: false }
);

export default function Home() {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealSchedules = async () => {
    try {
      const response = await fetch("/api/meal-schedules");
      if (!response.ok) {
        throw new Error("Failed to fetch meal schedules");
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: start }),
      });

      if (!response.ok) {
        throw new Error("Failed to update meal schedule");
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === event.id ? { ...e, start, end } : e))
      );
    } catch (error) {
      console.error("Error updating event:", error);
      // Optionally refresh the calendar to reset the state
      fetchMealSchedules();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-screen">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Meal Planner Calendar</h1>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          onClick={() => setIsModalOpen(true)}
        >
          Generate Meals
        </button>
      </header>
      <main className="h-full">
        <Calendar
          events={events}
          setEvents={setEvents}
          onEventDrop={handleEventDrop}
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
}
