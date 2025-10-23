export const runtime = 'nodejs';

type AgentRequestContext = {
  sessionId?: string;
  agent?: string;
  wallet?: string;
  [key: string]: unknown;
};

type AgentRequestBody = {
  prompt?: string;
  messages?: unknown;
  wallet?: string;
  context?: AgentRequestContext;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  // incoming shape from your page:
  // { prompt?: string; messages?: Array<{role:'user'|'assistant'|'system', content:string}>; context?: { sessionId?: string; agent?: string; [k:string]: any } }
  const rawBody = await req.json();
  const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as AgentRequestBody;
  const { prompt, messages, wallet: bodyWallet } = body;
  const context: AgentRequestContext =
    body.context && typeof body.context === 'object' ? body.context : {};
  const candidateWallet = bodyWallet ?? context.wallet;
  const wallet = typeof candidateWallet === 'string' ? candidateWallet : undefined;

  // Build the payload your container expects (session-aware server.js)
  const payload = {
    sessionId: context.sessionId ?? 'default',
    prompt,
    messages,
    // forward extras if you want to use them server-side
    agent: context.agent,
    wallet,
    userWallet: wallet, // Also pass as userWallet for clarity
    // Include wallet in context for the agent to remember
    context: {
      ...context,
      userWallet: wallet,
      hasWallet: !!wallet,
    },
  };
  
  console.log('API Route - Sending to agent:', {
    sessionId: payload.sessionId,
    messagesCount: Array.isArray(messages) ? messages.length : 0,
    hasWallet: !!wallet,
    agent: context.agent,
  });

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
  } catch (err: unknown) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
