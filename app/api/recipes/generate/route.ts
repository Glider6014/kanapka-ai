import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import connectMongo from "@/lib/connectToDatabase";
import Recipe, { SYSTEM_USER_ID } from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import { analyzeIngredients } from "@/lib/ingredients";
import { GeneratedIngredient } from "./types";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromTemplate(`
    Create {count} recipe(s) using the following ingredients as much as possible.
    
    Ingredients the user has: {ingredients}
    
    Each recipe should:
    - Use as many of the provided ingredients as possible.
    - Require as few additional ingredients as possible.
    - Conform to the Recipe model.
    
    Respond ONLY with a valid JSON array string in this exact format (no other text):
    [
      {{
        "name": "[Recipe name]",
        "description": "[Description]",
        "ingredients": [
          {{
            "ingredient": "[Ingredient name]",
            "amount": [number]
          }}
        ],
        "steps": ["[Step 1]", "[Step 2]", "..."],
        "prepTime": [number],
        "cookTime": [number],
        "difficulty": "[Easy/Medium/Hard]",
        "experience": [number]
      }}
    ]
    `);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, count } = body;

    if (!ingredients || !count) {
      return NextResponse.json(
        { error: "Ingredients and count are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Use the analyzeIngredients function to get ingredient details
    const ingredientDetails = await analyzeIngredients(ingredients);
    console.log("Analyzed ingredients with quantities:", ingredientDetails);

    // Update ingredients string for recipe generation to include quantities
    const ingredientsWithQuantities = ingredientDetails
      .map((i) => `${i.originalAmount} ${i.originalUnit} ${i.name}`)
      .join(", ");

    // Generate recipes using language model
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      ingredients: ingredientsWithQuantities,
      count,
    });
    const generatedRecipes = JSON.parse(response.content.toString());

    console.log("Generated recipes:", generatedRecipes);

    const savedRecipes = [];

    for (const recipeData of generatedRecipes) {
      console.log("Processing recipe ingredients:", recipeData.ingredients);

      // Validate ingredients array
      if (!Array.isArray(recipeData.ingredients)) {
        console.error("Invalid ingredients array:", recipeData.ingredients);
        continue;
      }

      const ingredientsList = recipeData.ingredients
        .filter((item: GeneratedIngredient) => {
          // Validate ingredient item structure
          if (
            !item ||
            typeof item.ingredient !== "string" ||
            typeof item.amount !== "number"
          ) {
            console.error("Invalid ingredient item:", item);
            return false;
          }
          return true;
        })
        .map((item: GeneratedIngredient) => {
          console.log("Processing ingredient:", item);

          const matchingIngredient = ingredientDetails.find((detail) => {
            const isMatch =
              detail.name.toLowerCase() === item.ingredient.toLowerCase();
            console.log(
              `Matching "${item.ingredient}" with "${detail.name}": ${isMatch}`
            );
            return isMatch;
          });

          if (!matchingIngredient?._id) {
            console.error(
              `No matching ingredient found for: ${item.ingredient}`
            );
            return null;
          }

          // Validate amount
          if (item.amount <= 0) {
            console.error(
              `Invalid amount for ingredient ${item.ingredient}: ${item.amount}`
            );
            return null;
          }

          return {
            ingredient: matchingIngredient._id,
            amount: item.amount,
          };
        })
        .filter(Boolean);

      console.log("Final validated ingredients list:", ingredientsList);

      if (ingredientsList.length > 0) {
        try {
          const recipe = await Recipe.create({
            ...recipeData,
            ingredients: ingredientsList,
            createdBy: SYSTEM_USER_ID,
          });
          savedRecipes.push(recipe);
        } catch (error) {
          console.error("Failed to save recipe:", error);
        }
      }
    }

    // Only return response if we have at least one valid recipe
    if (savedRecipes.length > 0) {
      return NextResponse.json({ recipes: savedRecipes }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Could not generate valid recipes with given ingredients" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
