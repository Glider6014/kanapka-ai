import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent } from "react";

type InputIngredientProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onAdd: () => void;
};

const InputIngredient = ({
  value,
  onChange,
  onRemove,
  onAdd,
}: InputIngredientProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAdd();
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        type="text"
        placeholder="Enter ingredient..."
        className="w-11/12"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="destructive"
        className="p-2 rounded-md h-10 w-10"
        onClick={onRemove}
      >
        <Trash2 size={24} />
      </Button>
    </div>
  );
};

export default InputIngredient;
