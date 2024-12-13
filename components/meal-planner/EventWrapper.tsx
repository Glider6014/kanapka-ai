import { CustomEvent } from '@/types/calendar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ContextMenu from './ContextMenu';

interface EventWrapperProps {
  event: CustomEvent;
  onDelete?: (event: CustomEvent) => void;
}

const EventWrapper: React.FC<EventWrapperProps> = ({ event, onDelete }) => {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const formatDuration = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return hours > 0
      ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
      : `${minutes}m`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.recipeId) {
      router.push(`/recipes/${event.recipeId}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    onDelete?.(event);
    setContextMenu(null);
  };

  return (
    <>
      <div
        className='h-full w-full p-0.5 text-white cursor-pointer'
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div className='flex justify-between items-center h-full'>
          <span className='flex-1 font-medium text-sm truncate mr-2'>
            {event.title}
          </span>
          <span className='flex-shrink-0 text-xs bg-black/10 px-1.5 rounded'>
            {formatDuration(event.duration || 0)}
          </span>
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDelete}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};

export default EventWrapper;
