import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tools } from "./tools";

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
}).bindTools(tools);

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  return lastMessage?.additional_kwargs?.tool_calls ? "tools" : "__end__";
}

// Modyfikacja funkcji callModel
async function callModel(state: typeof MessagesAnnotation.State) {
  try {
    const formattedMessages = state.messages.map((msg) => {
      if (msg instanceof HumanMessage) {
        return new HumanMessage({
          content:
            typeof msg.content === "string"
              ? msg.content
              : Array.isArray(msg.content) && msg.content.length > 0
              ? msg.content[0].type === "text"
                ? msg.content[0].text
                : JSON.stringify(msg.content[0])
              : "",
        });
      }

      if (msg instanceof SystemMessage) {
        return new SystemMessage({
          content:
            typeof msg.content === "string"
              ? msg.content
              : Array.isArray(msg.content) && msg.content[0]?.type === "text"
              ? msg.content[0].text
              : "",
        });
      }

      return msg;
    });

    const response = await model.invoke(formattedMessages);
    return { messages: [response] };
  } catch (error) {
    console.error("Error in model invocation:", error);
    throw error;
  }
}

// Definicja grafu
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

// Kompilacja grafu
const app = workflow.compile();

// Przykład użycia
export const planMeals = async (preferences: string, userId: string) => {
  if (!preferences?.trim()) {
    throw new Error("Meal preferences are required to generate a meal plan.");
  }

  try {
    const userPrompt = `Create a meal plan  by following these steps EXACTLY:
    User preferences - ${preferences}
    User ID - ${userId}

1. First, call ingredients_generator:
   - Input the ingredients as a comma-separated list: 
   - SAVE the _id values from the response for step 2

2. Then, call recipe_generator for each recipe you want to create:
   - Provide a recipe name
   - Use the exact _id values from step 1 as ingredientIds
   - Include the User ID "${userId}" in the userId parameter when calling recipe_generator
   - SAVE the recipe.id values from the response for step 3

3. Finally, call meal_scheduler:
   - Format: "recipeId@time, recipeId@time"
   - Use the recipe.id values from step 2
   - Include times in HH:MM format

Example flow:
1. ingredients_generator -> returns ingredients with _ids
2. recipe_generator -> use those _ids to create recipes
3. meal_scheduler -> schedule the recipes using their ids

Remember to use the exact IDs returned by each tool!`;

    const messages = [
      new SystemMessage({
        content: [
          {
            type: "text",
            text: "You are a meal planning assistant. Follow the steps precisely and use the provided tools in order.",
          },
        ],
      }),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: userPrompt,
          },
        ],
      }),
    ];

    const finalState = await app.invoke({
      messages: messages.map((msg) =>
        msg instanceof SystemMessage
          ? new SystemMessage(msg)
          : new HumanMessage(msg)
      ),
    });

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    if (!lastMessage?.content) {
      throw new Error("No response received from the model.");
    }

    return typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);
  } catch (error) {
    console.error("Error in meal planning:", error);
    return "An error occurred during meal planning. Please try again later.";
  }
};
