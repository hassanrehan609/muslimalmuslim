import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_denomination",
  title: "Update my denomination",
  description: "Change the signed-in user's denomination to sunni, shia or hanafi.",
  inputSchema: { denomination: z.enum(["sunni", "shia", "hanafi"]).describe("New denomination.") },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ denomination }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { error } = await supabaseForUser(ctx)
      .from("profiles")
      .update({ denomination })
      .eq("user_id", ctx.getUserId()!);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Denomination updated to ${denomination}.` }], structuredContent: { denomination } };
  },
});
