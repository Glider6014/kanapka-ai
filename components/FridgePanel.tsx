"use client";

import { FridgeType } from "@/models/Fridge";
import InputIngredient from "./InputIngredient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type FridgePanelProps = {
  setIngredients?: React.Dispatch<React.SetStateAction<string[]>>;
  isSearchRecipesButtonVisible?: boolean;
  isSearchRecipesButtonDisabled?: boolean;
  searchRecipes?: (ingredients: string[]) => void;
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

export const FridgePanel = ({
  setIngredients: setIngredientsOuter,
  isSearchRecipesButtonVisible,
  isSearchRecipesButtonDisabled,
  searchRecipes,
  fridge,
}: FridgePanelProps) => {
  const [ingredients, setIngredients] = useState<Record<number, string>>(
    createRecordFromList(fridge.ingredients)
  );
  const inputRefs = useRef<Record<number, HTMLInputElement>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isTryingToSearch, setIsTryingToSearch] = useState(false);

  const saveIngredients = useCallback(() => {
    setIsSaving(true);

    // TODO: Make it parrallel and add waiting animation to each input
    for (const [_, input] of Object.entries(inputRefs.current)) {
      input.disabled = true;
    }

    fetch(`/api/fridges/${fridge._id}/ingredients`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: Object.values(ingredients),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          alert(`Failed to save ingredients: ${(await res.json()).error}`);
          throw new Error("Failed to save ingredients");
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setIngredients(createRecordFromList(data.ingredients));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        for (const [_, input] of Object.entries(inputRefs.current)) {
          input.disabled = false;
          setIsSaving(false);
          setIsSaved(true);
        }
      });
  }, [ingredients, fridge]);

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
    setIngredientsOuter?.(Object.values(ingredients));
  }, [ingredients, refreshIngredients, setIngredientsOuter]);

  const handleIngredientChange = (key: number, value: string) => {
    const newIngredients = { ...ingredients };
    newIngredients[key] = value;

    setIngredients(newIngredients);
    setIsSaved(false);
  };

  const handleRemoveIngredient = (key: number) => {
    const newIngredients = { ...ingredients };
    delete newIngredients[key];

    setIngredients(newIngredients);
    setIsSaved(false);
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

  const handleSearchRecipes = () => {
    setIsTryingToSearch(true);
  };

  useEffect(() => {
    if (!isTryingToSearch) return;

    if (!isSaved) {
      saveIngredients();
      return;
    }

    searchRecipes?.([...Object.values(ingredients)]);
    setIsTryingToSearch(false);
  }, [isTryingToSearch, isSaved, ingredients, saveIngredients, searchRecipes]);

  console.log(`
    isSearchRecipesButtonDisabled: ${isSearchRecipesButtonDisabled}
    isSaving: ${isSaving}
    isTryingToSearch: ${isTryingToSearch}
  `);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-grow">
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
              isDeleteButtonDisabled={isSaving}
              onFocus={handleOnFocusChange}
              onAdd={handleAdd}
            />
          )
        )}
      </div>
      <div className="my-4 flex flex-col md:flex-row justify-between gap-2">
        <Button
          variant="outline"
          className="w-full md:w-1/2"
          disabled={isSaving}
          onClick={saveIngredients}
        >
          Save
        </Button>

        {isSearchRecipesButtonVisible && (
          <Button
            className="w-full md:w-1/2"
            disabled={
              isSearchRecipesButtonDisabled || isSaving || isTryingToSearch
            }
            onClick={handleSearchRecipes}
          >
            Search Recipes
          </Button>
        )}
      </div>
    </div>
  );
};
