import React from "react";
import { Button } from "../ui/button";

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
      className="fixed bg-transparent shadow-lg rounded-md z-50"
      style={{ top: y, left: x }}
    >
      <Button
        variant={'default'}
        className="w-full px-4 py-2 text-sm bg-end-prim-foreground text-white hover:bg-gray-100 text-left"
        onClick={onDelete}
      >
        Delete meal
      </Button>
    </div>
  );
};

export default ContextMenu;
