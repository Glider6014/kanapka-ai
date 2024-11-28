import { FC, useState } from "react";

interface GenerateMealsModalProps {
  onClose: () => void;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const GenerateMealsModal: FC<GenerateMealsModalProps> = ({ onClose }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleGenerate = () => {
    alert(`Meals generated for ${selectedDay}`);
    onClose();
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
                  selectedDay === day
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
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
