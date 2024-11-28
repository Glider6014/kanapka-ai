import { FC, useState } from "react";
import { format } from "date-fns";

interface GenerateMealsModalProps {
  onClose: () => void;
}

interface SelectedDayInfo {
  name: string;
  date: Date;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getNextDayDate = (dayName: string): Date => {
  const today = new Date();
  const dayIndex = days.indexOf(dayName);
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const daysUntilNext = dayIndex - todayIndex;

  const nextDate = new Date();
  nextDate.setDate(
    today.getDate() + (daysUntilNext <= 0 ? daysUntilNext + 7 : daysUntilNext)
  );
  return nextDate;
};

const GenerateMealsModal: FC<GenerateMealsModalProps> = ({ onClose }) => {
  const [selectedDay, setSelectedDay] = useState<SelectedDayInfo | null>(null);

  const handleDaySelect = (day: string) => {
    const nextDate = getNextDayDate(day);
    setSelectedDay({ name: day, date: nextDate });
  };

  const handleGenerate = () => {
    if (selectedDay) {
      alert(
        `Meals will be generated for ${selectedDay.name}, ${format(
          selectedDay.date,
          "MMMM do, yyyy"
        )}`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Select a Day</h2>
        <ul className="space-y-2 mb-4">
          {days.map((day) => (
            <li key={day}>
              <button
                className={`w-full px-4 py-2 rounded text-left ${
                  selectedDay?.name === day
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleDaySelect(day)}
              >
                {day}
                {selectedDay?.name === day && (
                  <span className="ml-2 text-sm">
                    ({format(selectedDay.date, "MMM do")})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedDay
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleGenerate}
            disabled={!selectedDay}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateMealsModal;
