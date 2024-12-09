"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Navbar } from "../Navbar";
import { Checkbox } from "@/components/ui/checkbox";

type ShoppingItem = {
  _id: string;
  name: string;
  amount: number;
  unit: string;
};

export function ShoppingListPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      fetchShoppingList(date);
    }
  }, []);

  const fetchShoppingList = async (selectedDate: Date) => {
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      console.log("Fetching shopping list for date:", formattedDate);

      const response = await fetch(`/api/shopping-list?date=${formattedDate}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch shopping list");
      }

      const data = await response.json();
      console.log("Received shopping list data:", data);

      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      fetchShoppingList(newDate);
    }
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(itemId)) {
        newChecked.delete(itemId);
      } else {
        newChecked.add(itemId);
      }
      return newChecked;
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Shopping List</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Select Date</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Shopping List for{" "}
              {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
            </h2>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item._id} className="flex items-center gap-2">
                    <Checkbox
                      checked={checkedItems.has(item._id)}
                      onCheckedChange={() => toggleItem(item._id)}
                    />
                    <span
                      className={
                        checkedItems.has(item._id) ? "line-through" : ""
                      }
                    >
                      {item.name} - {item.amount} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No items in the shopping list for this date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
