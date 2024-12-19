import { useState, useMemo } from 'react';
import { format } from 'date-fns';

interface GenerateMealsModalProps {
  onClose: () => void;
  onSuccess?: (result: string) => void;
}

interface SelectedDayInfo {
  name: string;
  date: Date;
}

const getDaysStartingFromToday = () => {
  const staticDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const reorderedDays = [
    ...staticDays.slice(todayIndex),
    ...staticDays.slice(0, todayIndex),
  ];

  return reorderedDays;
};

const getNextDayDate = (dayName: string): Date => {
  const staticDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const targetDayIndex = staticDays.indexOf(dayName);
  let daysToAdd = targetDayIndex - todayIndex;

  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const nextDate = new Date();
  nextDate.setDate(today.getDate() + daysToAdd);
  return nextDate;
};

const GenerateMealsModal = ({
  onClose,
  onSuccess,
}: GenerateMealsModalProps) => {
  const [selectedDay, setSelectedDay] = useState<SelectedDayInfo | null>(null);
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => getDaysStartingFromToday(), []);

  const handleDaySelect = (day: string) => {
    const nextDate = getNextDayDate(day);
    setSelectedDay({ name: day, date: nextDate });
  };

  const handleGenerate = async () => {
    if (!selectedDay) return;

    setLoading(true);
    setError(null);

    try {
      const targetDate = format(selectedDay.date, 'yyyy-MM-dd');
      const response = await fetch('/api/plan-meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          targetDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      if (onSuccess) {
        onSuccess(data.result);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[32rem] shadow-lg'>
        <h2 className='text-lg font-semibold mb-4'>Generate Meal Plan</h2>

        <div className='mb-4'>
          <label
            htmlFor='preferences'
            className='block text-sm font-medium mb-2'
          >
            Meal Preferences
          </label>
          <textarea
            id='preferences'
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            rows={3}
            placeholder='E.g., vegetarian, high protein, low carb...'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2'>Select Day</label>
          <div className='grid grid-cols-7 gap-2'>
            {days.map((day) => (
              <button
                key={day}
                className={`p-2 text-center rounded ${
                  selectedDay?.name === day
                    ? 'bg-end-prim-foreground text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {selectedDay && (
          <p className='text-sm text-gray-600 mb-4'>
            Selected: {format(selectedDay.date, 'MMMM do, yyyy')}
          </p>
        )}

        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

        <div className='flex justify-end space-x-2'>
          <button
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedDay && preferences
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={handleGenerate}
            disabled={loading || !selectedDay || !preferences}
          >
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateMealsModal;
