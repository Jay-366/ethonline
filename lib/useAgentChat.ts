import { useState } from 'react';

export function useAgentChat() {
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(userText: string, extraContext?: any) {
    if (!userText.trim()) return;
    setError(null);
    setPending(true);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    try {
      const r = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          // or send full history if you want multi-turn in the container side:
          // messages: [{ role:'user', content:userText }, ...history]
          context: extraContext ?? {},
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);

      const reply = data?.reply ?? '(no reply)';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setPending(false);
    }
  }

  return { messages, send, pending, error };
}
