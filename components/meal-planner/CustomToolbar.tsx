import { ToolbarProps } from "react-big-calendar";
import { FC } from "react";
import { CustomEvent } from "@/types/calendar";

const CustomToolbar: FC<ToolbarProps<CustomEvent, object>> = ({
  onNavigate,
  label,
}) => {
  return (
    <div className="flex justify-between items-center py-4 px-6 bg-gray-100 border-b border-gray-300">
      <button
        onClick={() => onNavigate("PREV")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
      >
        &lt; Prev
      </button>
      <h2 className="text-xl font-bold text-gray-700">{label}</h2>
      <button
        onClick={() => onNavigate("NEXT")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
      >
        Next &gt;
      </button>
    </div>
  );
};

export default CustomToolbar;
