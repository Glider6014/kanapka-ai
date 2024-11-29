"use client";

import { RecipeType } from "@/models/Recipe";
import { FridgeType } from "@/models/Fridge";
import InputIngredient from "./InputIngredient";
import { useCallback, useEffect, useRef, useState } from "react";

type FridgePanelProps = {
  setRecipes?: React.Dispatch<React.SetStateAction<RecipeType[]>>;
  fridge: FridgeType;
};

function createRecordFromList(list: string[]): Record<string, string> {
  const record: Record<string, string> = {};

  let lastKey = 0;

  list.forEach((item) => {
    record[lastKey++] = item;
  });

  if (lastKey === 0) {
    record[0] = "";
  }

  return record;
}

export const FridgePanel = ({ setRecipes, fridge }: FridgePanelProps) => {
  const [ingredients, setIngredients] = useState<Record<number, string>>(
    createRecordFromList(fridge.ingredients)
  );
  const inputRefs = useRef<Record<number, HTMLInputElement>>({});

  const refreshIngredients = useCallback(
    (removeAllEmpty: boolean = false) => {
      const newIngredients: Record<string, string> = {};
      let hasEmpty = false;

      const highestKey = Math.max(...Object.keys(ingredients).map(Number));

      for (const [key, value] of Object.entries(ingredients)) {
        if (removeAllEmpty) {
          if (value.trim() || Number(key) === highestKey) {
            newIngredients[key] = value;
          }
        } else if (hasEmpty) {
          if (value.trim()) {
            newIngredients[key] = value;
          }
        } else {
          newIngredients[key] = value;
          hasEmpty = !value.trim();
        }
      }

      if (
        removeAllEmpty ? newIngredients[highestKey]?.trim() !== "" : !hasEmpty
      ) {
        newIngredients[highestKey >= 0 ? highestKey + 1 : 0] = "";
      }

      const ingredientsLength = Object.keys(ingredients).length;
      const newIngredientsLength = Object.keys(newIngredients).length;

      if (ingredientsLength === newIngredientsLength) return false;

      setIngredients(newIngredients);

      return true;
    },
    [ingredients]
  );

  useEffect(() => {
    refreshIngredients();
  }, [ingredients, refreshIngredients]);

  const handleIngredientChange = (key: number, value: string) => {
    const newIngredients = { ...ingredients };
    newIngredients[key] = value;

    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (key: number) => {
    const newIngredients = { ...ingredients };
    delete newIngredients[key];

    setIngredients(newIngredients);
  };

  const focusHighestInput = () => {
    const highestKey = Math.max(...Object.keys(inputRefs.current).map(Number));
    inputRefs.current[highestKey]?.focus();
  };

  const handleOnFocusChange = () => {
    refreshIngredients();
  };

  const handleAdd = () => {
    refreshIngredients(true);
    focusHighestInput();
  };

  return (
    <div>
      {Object.entries(ingredients).map(
        ([key, ingredient]: [string, string]) => (
          <InputIngredient
            key={key}
            value={ingredient}
            onChange={(e) =>
              handleIngredientChange(Number(key), e.target.value)
            }
            onRemove={() => handleRemoveIngredient(Number(key))}
            inputRef={(el) =>
              el ? (inputRefs.current[Number(key)] = el) : null
            }
            onFocus={handleOnFocusChange}
            onAdd={handleAdd}
          />
        )
      )}
    </div>
  );
};
