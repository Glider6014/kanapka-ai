import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent, forwardRef, useState, useRef } from "react";

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
      onKeyDown,
      onKeyUp,
      error,
      errorMessage = "Invalid ingredient",
    },
    ref
  ) => {
    const [keyPressed, setKeyPressed] = useState<string | null>(null);
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && value.trim() !== "") {
        onAdd?.();
        const nextEmptyInput = Object.values(inputRefs.current).find(
          (input) => input && input.value.trim() === ""
        );
        nextEmptyInput?.focus();
      }
      if (keyPressed !== e.key) {
        setKeyPressed(e.key);
        onKeyDown?.(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      setKeyPressed(null);
      onKeyUp?.(e);
    };

    return (
      <div className="flex flex-col gap-2 mb-4 w-full">
        <div className="flex items-center gap-2">
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
              className={`p-2 rounded-md ${error ? "h-9 w-11" : "h-9 w-11"}`}
              onClick={onRemove}
              disabled={isDeleteButtonDisabled}
            >
              <Trash2 size={24} />
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 pl-1">{errorMessage}</p>}
      </div>
    );
  }
);

InputIngredient.displayName = "InputIngredient";

export default InputIngredient;
