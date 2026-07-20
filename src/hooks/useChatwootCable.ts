import { useEffect, useRef } from "react";

import { ChatwootCable } from "../lib/chatwootCable";
import type { ChatwootSession } from "../store/authUserSlice";

type UseChatwootCableOptions = {
  session: ChatwootSession | null | undefined;
  onMessage: (message: unknown) => void;
};

export function useChatwootCable({
  session,
  onMessage,
}: UseChatwootCableOptions) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const cable = new ChatwootCable({
      url: session.websocket.url,
      channel: session.websocket.channel,
      subscriptionParams: {
        pubsub_token: session.contact.pubsub_token,
      },
      onEvent: (event) => {
        if (event.type === "message") {
          onMessageRef.current(event.message);
        }
      },
    });

    cable.connect();
    return () => cable.disconnect();
  }, [session]);
}
