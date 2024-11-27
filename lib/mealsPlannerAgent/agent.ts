import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tools } from "./tools";

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
}).bindTools(tools);

// Funkcja decyzyjna
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  return lastMessage.additional_kwargs.tool_calls ? "tools" : "__end__";
}

// Funkcja wywołująca model
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
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
export const planMeals = async (preferences: string) => {
  if (!preferences?.trim()) {
    throw new Error("Meal preferences are required to generate a meal plan.");
  }

  try {
    const systemPrompt = `Follow these steps strictly in order:
1. First, use ingredients_generator to create a list of ingredients based on the preferences
2. Then, use recipe_generator to create recipes using the generated ingredients
3. Finally, use meal_scheduler to schedule the created recipes throughout the day
Preferences: ${preferences}`;

    const finalState = await app.invoke({
      messages: [new HumanMessage(systemPrompt)],
    });

    const result = finalState.messages[finalState.messages.length - 1].content;

    if (!result) {
      throw new Error("Failed to generate meal plan. No response received.");
    }

    return result;
  } catch (error) {
    console.error("Error in meal planning:", error);
    throw new Error(
      `Failed to generate meal plan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
