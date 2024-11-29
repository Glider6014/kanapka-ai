import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent, forwardRef } from "react";

type InputIngredientProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onAdd?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: (el: HTMLInputElement | null) => void;
};

const InputIngredient = forwardRef<HTMLInputElement, InputIngredientProps>(
  ({ value, onChange, onRemove, onAdd, onFocus, onBlur, inputRef }, ref) => {
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onAdd?.();
      }
    };

    return (
      <div className="flex items-center gap-2 mb-4 w-full">
        <Input
          type="text"
          placeholder="Enter ingredient..."
          className="w-full"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={handleKeyPress}
          ref={(el) => {
            if (ref) {
              if (typeof ref === "function") {
                ref(el);
              } else {
                ref.current = el;
              }
            }
            if (inputRef) inputRef(el);
          }}
        />
        {value.trim() !== "" && (
          <Button
            variant="destructive"
            className="p-2 rounded-md h-9 w-11"
            onClick={onRemove}
          >
            <Trash2 size={24} />
          </Button>
        )}
      </div>
    );
  }
);

InputIngredient.displayName = "InputIngredient";

export default InputIngredient;
