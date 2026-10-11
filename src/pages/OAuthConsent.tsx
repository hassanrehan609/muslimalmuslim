import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type OAuthResult = { data: any; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("This connection link is missing or invalid.");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      setEmail(sess.session.user.user_metadata?.full_name ?? "");
      try {
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) return setError(error.message);
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) { window.location.href = immediate; return; }
        setDetails(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "This request has expired. Please try connecting again.");
      }
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) { setBusy(false); return setError(error.message); }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) { setBusy(false); return setError("No redirect returned by the authorization server."); }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message ?? "Something went wrong. Please try again.");
    }
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "An app";

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass max-w-md w-full p-6 space-y-4">
        {error ? (
          <p className="text-destructive">Could not load this request: {error}</p>
        ) : !details ? (
          <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-gold" />
              <h1 className="text-xl font-semibold">Connect {clientName} to Muslim al Muslim</h1>
            </div>
            {email && <p className="text-sm text-muted-foreground">Signed in as {email}</p>}
            <p>{clientName} will be able to read your profile, update your denomination, and view your assistant chat history while you are signed in.</p>
            <p className="text-xs text-muted-foreground">This does not bypass this app's permissions.</p>
            <div className="flex gap-2 pt-2">
              <Button disabled={busy} onClick={() => decide(true)} className="flex-1">Approve</Button>
              <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">Cancel connection</Button>
            </div>
          </>
        )}
      </Card>
    </main>
  );
}
