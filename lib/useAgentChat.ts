import { useState } from 'react';

type ExtraContext = Record<string, unknown> & {
  wallet?: string;
};

export function useAgentChat() {
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(userText: string, extraContext?: ExtraContext) {
    if (!userText.trim()) return;
    setError(null);
    setPending(true);
    
    // Update messages state and get the updated array
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);

    try {
      const { wallet, ...context } = extraContext ?? {};
      
      // Always include wallet information if available
      let enhancedPrompt = userText;
      if (wallet) {
        if (messages.length === 0) {
          enhancedPrompt = `IMPORTANT: The user's wallet address is ${wallet}. Remember this address for all future requests. 

INSTRUCTIONS: 
- Keep responses simple and concise
- Don't mention remembering the address
- Don't show technical parameters or internal processing
- Just provide the requested information directly

${userText}`;
        } else {
          // For subsequent messages, remind the agent about the wallet
          enhancedPrompt = `REMINDER: User's wallet address is ${wallet}. Keep responses simple and concise - no technical details. ${userText}`;
        }
      }
      
      const requestBody = {
        prompt: enhancedPrompt,
        messages: updatedMessages, // Send the updated conversation history
        context: {
          ...context,
          userWallet: wallet,
        },
        wallet,
      };
      
      console.log('Sending to agent:', {
        messagesCount: updatedMessages.length,
        lastMessage: updatedMessages[updatedMessages.length - 1],
        wallet: wallet,
        sessionId: context.sessionId,
        enhancedPrompt: enhancedPrompt,
        allMessages: updatedMessages,
      });
      
      const r = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);

      const rawReply = data?.reply ?? '(no reply)';
      
      // Extract only the text after "undefined:" from the agent's response
      let cleanReply = rawReply;
      if (messages.length > 0) { // Don't filter the first message
        // Look for text after "undefined:"
        const undefinedMatch = rawReply.match(/undefined:\s*([\s\S]+)$/);
        if (undefinedMatch) {
          cleanReply = undefinedMatch[1].trim();
        } else {
          // Fallback: if no "undefined:" found, keep the original response
          cleanReply = rawReply;
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant' as const, content: cleanReply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return { messages, send, pending, error };
}
