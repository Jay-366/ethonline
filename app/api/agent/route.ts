export const runtime = 'nodejs';

export async function POST(req: Request) {
  // incoming shape from your page:
  // { prompt?: string; messages?: Array<{role:'user'|'assistant'|'system', content:string}>; context?: { sessionId?: string; agent?: string; [k:string]: any } }
  const body = await req.json();
  const { prompt, messages, context = {} } = body ?? {};

  // Build the payload your container expects (session-aware server.js)
  const payload = {
    sessionId: context.sessionId ?? 'default',
    prompt,
    messages,
    // forward extras if you want to use them server-side
    agent: context.agent,
    // you can forward the whole context if needed:
    // context,
  };

  const apiBase = process.env.AGENT_API_URL ?? 'http://localhost:3001';

  // timeout guard
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort('Request timed out'), 90_000);

  try {
    const resp = await fetch(`${apiBase}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });

    clearTimeout(timeout);

    // pass through response (JSON)
    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: { 'Content-Type': resp.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err: any) {
    clearTimeout(timeout);
    return Response.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
