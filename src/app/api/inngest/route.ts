import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { meetingsProcessing, chatMessageProcessing } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    meetingsProcessing,
    chatMessageProcessing
  ],
});