"use client";
import { useState } from "react";
import { IngredientAnalysisResult } from "./api/ingredients/types";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [result, setResult] = useState<IngredientAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze ingredient");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Enter ingredient name"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-green-100 rounded">
          <h2 className="font-bold text-lg">{result.name}</h2>
          <div className="mt-2">
            <p>Calories: {result.nutrition.calories}</p>
            <p>Protein: {result.nutrition.protein}</p>
            <p>Carbs: {result.nutrition.carbs}</p>
            <p>Fat: {result.nutrition.fat}</p>
          </div>
        </div>
      )}
    </div>
  );
}
