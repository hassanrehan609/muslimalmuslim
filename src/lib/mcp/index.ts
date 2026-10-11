import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import updateDenomination from "./tools/update-denomination";
import listChatMessages from "./tools/list-chat-messages";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "muslim-al-muslim",
  title: "Muslim al muslim",
  version: "0.1.0",
  instructions:
    "Tools for the Muslim al Muslim Islamic companion app. Read or update the signed-in user's profile and denomination, and review their Islamic assistant chat history.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfile, updateDenomination, listChatMessages],
});
