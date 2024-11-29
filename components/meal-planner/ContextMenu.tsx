import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onDelete,
  onClose,
}) => {
  React.useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white shadow-lg rounded-md py-1 z-50 border border-gray-200"
      style={{ top: y, left: x }}
    >
      <button
        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
        onClick={onDelete}
      >
        Delete meal
      </button>
    </div>
  );
};

export default ContextMenu;
