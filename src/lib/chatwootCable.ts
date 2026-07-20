export type ChatwootCableEvent =
  | { type: "welcome" | "confirm_subscription" | "disconnect" }
  | { type: "message"; message: unknown };

type ChatwootCableConfig = {
  url: string;
  channel: string;
  subscriptionParams: Record<string, unknown>;
  onEvent: (event: ChatwootCableEvent) => void;
  reconnectIntervalMs?: number;
};

export class ChatwootCable {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private closedManually = false;
  private readonly config: ChatwootCableConfig;

  constructor(config: ChatwootCableConfig) {
    this.config = config;
  }

  connect() {
    this.closedManually = false;
    this.ws = new WebSocket(this.config.url);

    this.ws.onopen = () => {
      this.ws?.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            channel: this.config.channel,
            ...this.config.subscriptionParams,
          }),
        }),
      );
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          type?: string;
          message?: unknown;
        };

        if (data.type === "welcome" || data.type === "confirm_subscription") {
          this.config.onEvent({ type: data.type });
          return;
        }

        if (data.message !== undefined) {
          this.config.onEvent({ type: "message", message: data.message });
        }
      } catch {
        // Ignore malformed websocket frames.
      }
    };

    this.ws.onclose = () => {
      this.config.onEvent({ type: "disconnect" });

      if (!this.closedManually) {
        this.reconnectTimer = window.setTimeout(
          () => this.connect(),
          this.config.reconnectIntervalMs ?? 3000,
        );
      }
    };
  }

  disconnect() {
    this.closedManually = true;

    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();
    this.ws = null;
  }
}
