import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tools } from "./tools";
import { SystemMessage } from "@langchain/core/messages";

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  cache: true,
}).bindTools(tools);

const SYSTEM_PROMPT = `You are a smart cooking assistant that generates recipes based on available ingredients.

Your main goals:
1. First, ALWAYS try to create recipes using ONLY the available ingredients
2. Each generated recipe MUST contain at least 50% of ingredients from user's list
3. Add new ingredients ONLY if:
   - It's impossible to create sensible recipes from available ingredients
   - New ingredients will significantly increase recipe variety

Guidelines for recipe creation:
- Try to generate as many recipes as possible using only the user's ingredients before considering new ones
- Prioritize using available ingredients efficiently
- If sensible recipes can be created using only provided ingredients, don't suggest additional ones
- Generate realistic portion sizes and cooking instructions
- Aim for a variety of difficulty levels and cooking times
- Track all ingredient IDs carefully

Process:
1. Analyze available ingredients
2. Generate recipes using only available ingredients
3. If more recipes are needed:
   - Identify key missing ingredients
   - Use ingredients_generator to add new ones
   - Generate additional recipes combining original and new ingredients

Remember:
- Each recipe MUST contain minimum 50% of user-provided ingredients
- Prefer recipes using ONLY available ingredients
- Add new ingredients only when absolutely necessary
- Both available and suggested ingredients must be properly created via ingredients_generator before using them in recipe_generator`;

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
