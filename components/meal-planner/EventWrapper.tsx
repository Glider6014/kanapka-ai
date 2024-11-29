import { CustomEvent } from "@/types/calendar";
import { useRouter } from "next/navigation";

interface EventWrapperProps {
  event: CustomEvent;
}

const EventWrapper: React.FC<EventWrapperProps> = ({ event }) => {
  const router = useRouter();

  const formatDuration = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return hours > 0
      ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
      : `${minutes}m`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.recipeId) {
      router.push(`/recipes/${event.recipeId}`);
    }
  };

  return (
    <div
      className="h-full w-full p-0.5 text-white cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center h-full">
        <span className="flex-1 font-medium text-sm truncate mr-2">
          {event.title}
        </span>
        <span className="flex-shrink-0 text-xs bg-black/10 px-1.5 rounded">
          {formatDuration(event.duration || 0)}
        </span>
      </div>
    </div>
  );
};

export default EventWrapper;
