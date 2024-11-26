import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { IngredientType } from "@/models/Ingredient";
import Recipe, { RecipeType } from "@/models/Recipe";

const recipeSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  ingredients: z
    .array(
      z.object({
        name: z.string({
          required_error: "Ingredient name is required",
        }),
        amount: z
          .number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
          })
          .nonnegative("Amount must be zero or positive"),
      })
    )
    .min(1, "At least one ingredient is required"),
  steps: z.array(z.string()).min(1, {
    message: "At least one step is required",
  }),
  prepTime: z
    .number({
      required_error: "Preparation time is required",
      invalid_type_error: "Preparation time must be a number",
    })
    .nonnegative("Preparation time must be zero or positive"),
  cookTime: z
    .number({
      required_error: "Cooking time is required",
      invalid_type_error: "Cooking time must be a number",
    })
    .nonnegative("Cooking time must be zero or positive"),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    required_error: "Difficulty level is required",
    invalid_type_error: "Invalid difficulty level",
  }),
  experience: z
    .number({
      required_error: "Experience points are required",
      invalid_type_error: "Experience must be a number",
    })
    .nonnegative("Experience points must be zero or positive"),
});

const parser = new StringOutputParser();

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
Create {count} recipe(s) using the provided ingredients as much as possible.

Each recipe MUST include ALL of these required fields:
{{
  "name": "string (recipe title)",
  "description": "string (brief description)",
  "ingredients": [
    {{
      "name": "string (ingredient name)",
      "amount": number (positive quantity)
  }}
  ],
  "steps": ["string (step 1)", "string (step 2)"],
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "difficulty": "Easy" | "Medium" | "Hard",
  "experience": number (positive points)
  }}

Example of valid response:
[
  {{
    "name": "Simple Pasta",
    "description": "Quick and easy pasta dish",
    "ingredients": [
      {{
        "name": "pasta",
        "amount": 100
    }}
    ],
    "steps": ["Boil water", "Cook pasta"],
    "prepTime": 5,
    "cookTime": 10,
    "difficulty": "Easy",
    "experience": 50
  }}
]

Available ingredients:
{ingredients}

Respond ONLY with a valid JSON array containing {count} recipes.
`,
  ],
  ["user", "{ingredients}"],
]);

const chain = prompt.pipe(model).pipe(parser);

export async function generateRecipes(
  ingredients: IngredientType[],
  count: number = 3
): Promise<RecipeType[]> {
  try {
    const ingredientsString = ingredients
      .map((ing) => `- ${ing.name} (unit: ${ing.unit})`)
      .join("\n");

    console.log("Generating recipes with prompt:", {
      ingredients: ingredientsString,
      count,
    });

    const results = await chain.invoke({
      ingredients: ingredientsString,
      count,
    });

    console.log("AI Response:", results);

    const parsedResults = JSON.parse(results);
    console.log("Parsed Results:", JSON.stringify(parsedResults, null, 2));

    const recipes = await Promise.all(
      parsedResults.map(async (parsedResult: z.infer<typeof recipeSchema>) => {
        const validation = recipeSchema.safeParse(parsedResult);

        if (!validation.success) {
          console.error(
            "Validation errors:",
            validation.error.flatten().fieldErrors
          );
          return null;
        }

        return new Recipe({
          name: validation.data.name,
          description: validation.data.description,
          ingredients: validation.data.ingredients
            .map((ing) => ({
              ingredient: ingredients.find(
                (i) => i.name === ing.name.toLowerCase()
              )?._id,
              amount: ing.amount,
            }))
            .filter((ing) => ing.ingredient),
          steps: validation.data.steps,
          prepTime: validation.data.prepTime,
          cookTime: validation.data.cookTime,
          difficulty: validation.data.difficulty,
          experience: validation.data.experience,
        });
      })
    );

    return recipes.filter((recipe): recipe is RecipeType => recipe !== null);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.flatten().fieldErrors);
    } else {
      console.error("Recipe generation error:", error);
    }
    return [];
  }
}
