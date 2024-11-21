"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Enum for options
enum PreferencesEnum {
  Vegan = "Veganism",
  Vegetarian = "Vegetarianism",
  Paleo = "Paleo",
  Keto = "Keto",
  GlutenFree = "Gluten-free",
  Mediterranean = "Mediterranean",
  Christianity = "Christianity",
  Islam = "Islam",
  Judaism = "Judaism",
  Hinduism = "Hinduism",
  Buddhism = "Buddhism",
  Atheism = "Atheism",
  Milk = "Milk",
  Nuts = "Nuts",
  Gluten = "Gluten",
  Shellfish = "Seafood",
  Eggs = "Eggs",
  Soy = "Soy",
  NotSpecified = "I prefer not to specify",
}

// Types of preferences
type PreferenceCategory = "diets" | "religions" | "allergies";

export default function Home() {
  const [diet, setDiet] = useState<string | null>(null);
  const [religion, setReligion] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<PreferenceCategory | null>(null);

  // Category options
  const options = {
    diets: [
      ...Object.values(PreferencesEnum).slice(0, 6),
      PreferencesEnum.NotSpecified,
    ],
    religions: [
      ...Object.values(PreferencesEnum).slice(6, 12),
      PreferencesEnum.NotSpecified,
    ],
    allergies: [...Object.values(PreferencesEnum).slice(12)],
  };

  // Initialisation of selected options when opening a modal
  const openPreferenceModal = (type: PreferenceCategory) => {
    setOpenModal(type);
    if (type === "diets") {
      setSelectedOptions([diet].filter(Boolean) as string[]);
    }
    if (type === "religions") {
      setSelectedOptions([religion].filter(Boolean) as string[]);
    }
    if (type === "allergies") {
      setSelectedOptions(allergies);
    }
  };

  // Support for clicking options in modals
  const toggleOption = (value: string) => {
    if (value === PreferencesEnum.NotSpecified) {
      setSelectedOptions([value]);
      return;
    }

    setSelectedOptions((prev) =>
      prev.includes(PreferencesEnum.NotSpecified)
        ? [value]
        : prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // Saving preferences
  const saveSelection = (type: PreferenceCategory) => {
    if (type === "diets") setDiet(selectedOptions[0] || null);
    if (type === "religions") setReligion(selectedOptions[0] || null);
    if (type === "allergies") setAllergies(selectedOptions);
    setOpenModal(null); // Close modal
    setSelectedOptions([]); //Restart choice
  };

  // Deleting preferences
  const removePreference = (type: PreferenceCategory, value: string | string[]) => {
    if (type === "diets") setDiet(null);
    if (type === "religions") setReligion(null);
    if (type === "allergies" && typeof value === "string")
      setAllergies((prev) => prev.filter((item) => item !== value));
  };

  // Rendering options in modals
  const renderOptions = (type: PreferenceCategory) => {
    const isSingleSelect = type === "diets" || type === "religions";

    return options[type].map((option) => (
      <div
        key={option}
        className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${
          selectedOptions.includes(option) ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
        onClick={() => {
          if (isSingleSelect) setSelectedOptions([option]);
          else toggleOption(option);
        }}
      >
        <Check
          className={`w-4 h-4 ${
            selectedOptions.includes(option)
              ? "text-purple-700"
              : "text-gray-300"
          }`}
        />
        <span>{option}</span>
      </div>
    ));
  };

  // Rendering preferences in a list
  const renderPreferences = (
    value: string | null | string[],
    type: PreferenceCategory
  ) => {
    if (type === "diets" || type === "religions") {
      return value ? (
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-full text-sm shadow-sm transition-transform transform hover:scale-105 hover:bg-gray-200">
          <span>{value}</span>
          <X
            className="w-4 h-4 cursor-pointer text-black hover:text-red-600"
            onClick={() => removePreference(type, value)}
          />
        </div>
      ) : null;
    }

    return (value as string[]).map((pref) => (
      <div
        key={pref}
        className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-full text-sm shadow-sm transition-transform transform hover:scale-105 hover:bg-gray-200"
      >
        <span>{pref}</span>
        <X
          className="w-4 h-4 cursor-pointer text-black hover:text-red-600"
          onClick={() => removePreference(type, pref)}
        />
      </div>
    ));
  };

  // Rendering modal for categories
  const renderModal = (type: PreferenceCategory) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger onClick={() => openPreferenceModal(type)}>
          <Plus className="w-6 h-6 cursor-pointer text-purple-700 hover:text-orange-500 transition-transform transform hover:scale-110" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Select {type.charAt(0).toUpperCase() + type.slice(1)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {type === "allergies"
                ? "Select multiple options from the list."
                : "Select one option from the list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">{renderOptions(type)}</div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 transition-transform transform hover:scale-105"
              onClick={() => saveSelection(type)}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col w-full max-w-6xl items-center justify-center">
        <div className="mb-8">
          <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 to-orange-500 bg-clip-text text-transparent text-center">
            Kanapka AI
          </p>
        </div>

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-8">
          <h1 className="font-bold text-3xl">Dietary preferences</h1>
          {/* Diet Preferences */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold mb-2">Diets</p>
              {renderModal("diets")}
            </div>
            {renderPreferences(diet, "diets")}
          </div>

          {/* Religion Preferences */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold mb-2">Religions</p>
              {renderModal("religions")}
            </div>
            {renderPreferences(religion, "religions")}
          </div>

          {/* Allergies Preferences */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold mb-2">Allergies</p>
              {renderModal("allergies")}
            </div>
            <div className="flex flex-wrap gap-2">
              {renderPreferences(allergies, "allergies")}
            </div>
          </div>

          <Button className="w-full mt-4 font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 transition-transform transform hover:scale-105">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
