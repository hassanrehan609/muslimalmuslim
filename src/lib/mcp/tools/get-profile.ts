import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_profile",
  title: "Get my profile",
  description: "Return the signed-in user's profile: name and denomination (Sunni, Shia or Hanafi).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("profiles")
      .select("full_name, denomination, created_at")
      .eq("user_id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "No profile found." }] };
    const profile = { full_name: data.full_name, denomination: data.denomination, created_at: data.created_at };
    return { content: [{ type: "text", text: JSON.stringify(profile) }], structuredContent: { profile } };
  },
});
