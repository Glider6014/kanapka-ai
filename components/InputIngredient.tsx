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
  isDeleteButtonDisabled?: boolean;
  error?: boolean;
  errorMessage?: string;
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
      error,
      errorMessage = "Invalid ingredient",
    },
    ref
  ) => {
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onAdd?.();
      }
    };

    return (
      <div className="w-full mb-4">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter ingredient..."
              className={`w-full ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
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
          </div>
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
        {error && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
      </div>
    );
  }
);

InputIngredient.displayName = "InputIngredient";

export default InputIngredient;
