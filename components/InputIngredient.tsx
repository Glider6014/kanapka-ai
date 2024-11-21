import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const InputIngredinet = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        type="text"
        placeholder="Enter ingredient..."
        className="w-11/12"
      />
      <Button variant="destructive" className="p-2 rounded-md h-10 w-10">
        <Trash2 size={24} />
      </Button>
    </div>
  );
};

export default InputIngredinet;
