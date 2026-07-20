import axios from "axios";

import type { ChatwootSession } from "../store/authUserSlice";

type ChatwootAttachment = {
  id: number;
  data_url?: string;
  extension?: string;
  fallback_title?: string;
  file_name?: string;
  filename?: string;
  original_filename?: string;
};

export type ChatwootMessage = {
  id: number;
  content: string | null;
  message_type: number | string;
  created_at: number | string;
  attachments?: ChatwootAttachment[];
};

export type ChatwootConversation = {
  id: number;
  status?: string;
  messages?: ChatwootMessage[];
  contact?: {
    name?: string;
  };
};

function getConversationUrl(session: ChatwootSession) {
  const { base_url, inbox, contact } = session;

  return `${base_url.replace(/\/$/, "")}/public/api/v1/inboxes/${encodeURIComponent(inbox.identifier)}/contacts/${encodeURIComponent(contact.identifier)}/conversations`;
}

export async function getChatwootConversations(session: ChatwootSession) {
  const { data } = await axios.get<ChatwootConversation[]>(
    getConversationUrl(session),
  );

  return data;
}

export async function getChatwootMessages(
  session: ChatwootSession,
  conversationId: number,
) {
  const { data } = await axios.get<ChatwootMessage[]>(
    `${getConversationUrl(session)}/${conversationId}/messages`,
  );

  return data;
}

export async function createChatwootConversation(session: ChatwootSession) {
  const { data } = await axios.post<ChatwootConversation>(
    getConversationUrl(session),
    { custom_attributes: {} },
  );

  return data;
}

export async function createChatwootMessage(
  session: ChatwootSession,
  conversationId: string,
  content: string,
  files: File[] = [],
) {
  const url = `${getConversationUrl(session)}/${conversationId}/messages`;
  const echoId = crypto.randomUUID();

  if (files.length > 0) {
    const formData = new FormData();

    if (content) {
      formData.append("content", content);
    }

    formData.append("echo_id", echoId);
    files.forEach((file) => formData.append("attachments[]", file));

    const { data } = await axios.post<ChatwootMessage>(url, formData);
    return data;
  }

  const { data } = await axios.post<ChatwootMessage>(
    url,
    {
      content,
      echo_id: echoId,
    },
  );

  return data;
}
