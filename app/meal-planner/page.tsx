"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import GenerateMealsModal from "@/components/meal-planner/GenerateMealsModal";
import { CustomEvent } from "@/types/calendar";

const Calendar = dynamic(
  () => import("@/components/meal-planner/BigCalendar"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [events, setEvents] = useState<CustomEvent[]>([
    {
      id: 1,
      title: "Breakfast",
      start: DateTime.now().set({ hour: 6 }).toJSDate(),
      end: DateTime.now().set({ hour: 7 }).toJSDate(),
    },
    {
      id: 2,
      title: "Flight to Paris",
      start: DateTime.now().set({ hour: 7, minute: 30 }).toJSDate(),
      end: DateTime.now().set({ hour: 10 }).toJSDate(),
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        <Calendar events={events} setEvents={setEvents} />
        {isModalOpen && <GenerateMealsModal onClose={handleCloseModal} />}
      </main>
    </div>
  );
}
