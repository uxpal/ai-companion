import { NextResponse } from "next/server";

import OpenAI from "openai";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  //   const user = await currentUser();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Step 1: Create an Assistant
  const assistant = await openai.beta.assistants.create({
    name: "Mike, the fitness instructor",
    description:
      "Meet Mike. Mike is a 30-year-old male fitness enthusiast with a passion for weight lifting and a commitment to the principles of the ketogenic diet. He can help with planning your diet and workout regime according to your personal schedule. He's personality is not only encouraging but also firmly committed to your fitness goals. Mike is able to craft personalized plans, focusing primarily on weight lifting training and the ketogenic diet.",
    model: "gpt-4-1106-preview",
  });

  // Step 2: Create a Thread
  const thread = await openai.beta.threads.create();

  // Step 3: Add a Message to a Thread
  const threadMessages = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });

  // Step 4: Run the Assistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: "Please address the user as Veli",
  });

  // Step 5: Periodically retrieve the Run to check on its status to see if it has moved to completed
  const retrieveRun = async () => {
    let keepRetrievingRun;

    while (run.status !== "completed") {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );

      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        console.log("\n");
        break;
      }
    }
  };
  retrieveRun();

  // Step 6: Retrieve the Messages added by the Assistant to the Thread
  const waitForAssistantMessage = async () => {
    await retrieveRun();

    const allMessages = await openai.beta.threads.messages.list(thread.id);

    console.log(
      "------------------------------------------------------------ \n",
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    console.log("User: ", threadMessages.content[0].text.value);
    console.log("Assistant: ", allMessages.data);
    return allMessages.data;
  };
  const assistantData = await waitForAssistantMessage();

  return NextResponse.json(assistantData);
}
