import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
  stop: ["\n", " "],
});

const examples = [
  {
    input: "banana",
    output: "true",
  },
  {
    input: "apple",
    output: "true",
  },
  {
    input: "salt",
    output: "true",
  },
  {
    input: "chicken",
    output: "true",
  },
  {
    input: "milk",
    output: "true",
  },
  {
    input: "bread",
    output: "true",
  },
  {
    input: "stone",
    output: "false",
  },
  {
    input: "dirt",
    output: "false",
  },
  {
    input: "poison",
    output: "false",
  },
  {
    input: "XKCD123",
    output: "false",
  },
];

const examplePrompt = ChatPromptTemplate.fromMessages([
  ["user", "Ingredient to evaluate: {input}"],
  ["assistant", "{output}"],
]);

const prompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  prefix: `
Evaluate if the given ingredient is an edible food product. Respond only with "true" or "false".

### Evaluation Rules:
Answer "true" if the ingredient is:
- A fruit or vegetable (e.g., apple, carrot)
- A food product available in stores (e.g., bread, pasta)
- A spice or herb (e.g., cinnamon, basil)
- Meat or fish (e.g., chicken, salmon)
- A dairy product (e.g., milk, cheese)
- A grain or its derivative (e.g., rice, flour)
- An ingredient commonly used in cooking (e.g., oil, sugar)

Answer "false" if the ingredient is:
- Inedible or toxic (e.g., poison, dirt)
- A random string of characters (e.g., "XKCD123")
- A non-food item (e.g., stone, plastic)
- Something that does not exist as a food product
`,
  suffix: `
Ingredient to evaluate: {ingredient}

Answer ONLY "true" or "false".
`,
  inputVariables: ["ingredient"],
});

const chain = prompt.pipe(model);

export async function isValidFood(ingredient: string): Promise<boolean> {
  try {
    const result = await chain.invoke({ ingredient });

    return result.content.toString().toLowerCase().includes("true");
  } catch (error) {
    console.error(`Validation failed for ingredient "${ingredient}":`, error);

    return false; // Fail safe - if validation fails, assume ingredient is invalid
  }
}
