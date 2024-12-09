import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tools } from "./tools";
import { SystemMessage } from "@langchain/core/messages";

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
}).bindTools(tools);

const SYSTEM_PROMPT = `You are a smart cooking assistant that generates recipes based on available ingredients.
Your main goals are:
1. First, try to create recipes using ONLY the available ingredients
2. If you can't create enough interesting recipes, suggest additional ingredients that would enable more diverse recipes
3. Always aim for a good mix: some recipes with only available ingredients and some requiring additional purchases

Guidelines for recipe creation:
- Prioritize using available ingredients efficiently
- Only suggest buying new ingredients when they significantly enhance recipe possibilities
- Ensure all ingredients mentioned in recipes are either from the available list or have been added through ingredients_generator
- Track all ingredient IDs carefully - never reference ingredients that haven't been properly created
- Generate realistic portion sizes and cooking instructions
- Aim for a variety of difficulty levels and cooking times

Process:
1. First, analyze available ingredients and generate recipes using only these
2. If more recipes are needed, identify key missing ingredients that would enable new recipe types
3. Use ingredients_generator to add these new ingredients
4. Generate additional recipes combining both original and new ingredients
5. Always organize ingredients by what's available and what needs to be purchased

Remember: Both available and suggested ingredients must be properly created via ingredients_generator before using them in recipe_generator.`;

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  return lastMessage?.additional_kwargs?.tool_calls ? "tools" : "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  try {
    // Add system message if it's the first interaction
    if (state.messages.length === 1) {
      state.messages.unshift(new SystemMessage(SYSTEM_PROMPT));
    }

    const response = await model.invoke(state.messages);
    return { messages: [...state.messages, response] };
  } catch (error) {
    console.error("Error in model invocation:", error);
    throw error;
  }
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

const agent = workflow.compile();

export default agent;
