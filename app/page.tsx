"use client";
import { useState } from "react";
import { IngredientAnalysisResults } from "./api/ingredients/types";
import { ValidationResponse } from "./api/ingredients/validate/types";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [results, setResults] = useState<IngredientAnalysisResults | null>(
    null
  );
  const [validationResults, setValidationResults] =
    useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    setLoading(true);
    setError(null);
    setValidationResults(null);
    setResults(null);

    try {
      const response = await fetch("/api/ingredients/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredient }),
      });

      if (!response.ok) {
        throw new Error("Failed to validate ingredients");
      }

      const data = await response.json();
      setValidationResults(data);

      // If there are valid ingredients, proceed with analysis
      if (data.validIngredients.length > 0) {
        await handleAnalysis(data.validIngredients.join(", "));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysis = async (validIngredients: string) => {
    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient: validIngredients }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze ingredients");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleValidate();
        }}
        className="max-w-md mx-auto space-y-4"
      >
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Enter ingredient names (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Validate and Analyze"}
        </button>
      </form>

      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {validationResults && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Validation Results:</h3>
          {validationResults.results.map((result, idx) => (
            <div
              key={idx}
              className={`p-2 mb-1 rounded ${
                result.valid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {result.ingredient}:{" "}
              {result.exists
                ? "Already exists"
                : result.valid
                ? "Valid"
                : "Invalid"}
            </div>
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="max-w-md mx-auto mt-4 space-y-4">
          {results.map((result, index) => (
            <div key={index} className="p-4 bg-green-100 rounded">
              <h2 className="font-bold text-lg">{result.name}</h2>
              <p className="text-sm text-gray-600">Per 100{result.unit}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {result.nutrition && (
                  <>
                    <p>Calories: {result.nutrition.calories}</p>
                    <p>Protein: {result.nutrition.protein}g</p>
                    <p>Carbs: {result.nutrition.carbs}g</p>
                    <p>Fats: {result.nutrition.fats}g</p>
                    {result.nutrition.fiber && (
                      <p>Fiber: {result.nutrition.fiber}g</p>
                    )}
                    {result.nutrition.sugar && (
                      <p>Sugar: {result.nutrition.sugar}g</p>
                    )}
                    {result.nutrition.sodium && (
                      <p>Sodium: {result.nutrition.sodium}mg</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
