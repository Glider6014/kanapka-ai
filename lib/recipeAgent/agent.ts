import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tools } from "./tools";

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.5,
}).bindTools(tools);

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  return lastMessage?.additional_kwargs?.tool_calls ? "tools" : "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  try {
    const response = await model.invoke(state.messages);

    const messages = [...state.messages, response];

    return { messages };
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
