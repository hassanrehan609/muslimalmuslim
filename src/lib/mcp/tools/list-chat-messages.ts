import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_chat_messages",
  title: "List my assistant chat history",
  description: "Return the signed-in user's most recent Islamic assistant chat messages, newest first.",
  inputSchema: { limit: z.number().int().min(1).max(100).default(20).describe("How many messages to return.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("user_id", ctx.getUserId()!)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const messages = (data ?? []).map((m) => ({ role: m.role, content: m.content, created_at: m.created_at }));
    return { content: [{ type: "text", text: JSON.stringify(messages) }], structuredContent: { messages } };
  },
});
