import { ToolbarProps } from "react-big-calendar";
import { FC } from "react";
import { CustomEvent } from "@/types/calendar";
import { Button } from "../ui/button";
import { ArrowBigLeft } from 'lucide-react';
import { ArrowBigRight } from 'lucide-react';

const CustomToolbar: FC<ToolbarProps<CustomEvent, object>> = ({
  onNavigate,
  label,
}) => {
  return (
    <div className="flex justify-between items-center py-4 px-6 bg-gray-100 border-b border-gray-300">
      <Button
        variant={'outline'}
        onClick={() => onNavigate("PREV")}
        className='text-black bg-opacity-0 bg-transparent hover:bg-opacity-60 hover:bg-black hover:text-white rounded border-black border-solid border-2'
      >
        <ArrowBigLeft/> Prev
      </Button>
      <h2 className="text-xl font-bold text-gray-700">{label}</h2>
      <Button
        variant={'outline'}
        onClick={() => onNavigate("NEXT")}
        className='text-black bg-opacity-0 bg-transparent hover:bg-opacity-60 hover:bg-black hover:text-white rounded border-black border-solid border-2'
      >
        Next <ArrowBigRight/>
      </Button>
    </div>
  );
};

export default CustomToolbar;
