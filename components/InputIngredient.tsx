import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent, forwardRef, useState } from "react";

type InputIngredientProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onAdd?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: (el: HTMLInputElement | null) => void;
  isDeleteButtonDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputIngredient = forwardRef<HTMLInputElement, InputIngredientProps>(
  (
    {
      value,
      onChange,
      onRemove,
      onAdd,
      onFocus,
      onBlur,
      inputRef,
      isDeleteButtonDisabled,
      onKeyDown,
    },
    ref
  ) => {
    const [keyPressed, setKeyPressed] = useState<string | null>(null);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onAdd?.();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (keyPressed !== e.key) {
        setKeyPressed(e.key);
        onKeyDown?.(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      setKeyPressed(null);
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
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
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
            disabled={isDeleteButtonDisabled}
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
