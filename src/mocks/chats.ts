export type MockChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  attachments?: ChatAttachment[];
};

export type ChatAttachment = {
  id: string;
  name: string;
  type: string;
  previewUrl?: string;
};

export type MockChatStatus = "payment" | (string & {});

export type MockChatPayment = {
  amountLabel: string;
  description?: string;
};

export type MockChat = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  unreadCount?: number;
  status?: MockChatStatus;
  payment?: MockChatPayment;
  messages: MockChatMessage[];
};

export const mockChats: MockChat[] = [
  {
    id: "chat-apartment-cleaning",
    title: "Apartment cleaning on Friday",
    preview: "Need a deep cleaning after 7:00 PM",
    updatedAt: "2026-07-02T09:40:00+03:00",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content:
          "I need a deep cleaning for a two-bedroom apartment on Friday evening.",
        createdAt: "2026-07-02T09:32:00+03:00",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "I found a few cleaners. Please confirm your preferred start time.",
        createdAt: "2026-07-02T09:34:00+03:00",
      },
      {
        id: "msg-3",
        role: "user",
        content:
          "After 7:00 PM, and preferably with window cleaning included.",
        createdAt: "2026-07-02T09:40:00+03:00",
      },
    ],
  },
  {
    id: "chat-visa-documents",
    title: "Visa documents",
    preview: "Prepare a checklist for the Spain application",
    updatedAt: "2026-07-01T18:15:00+03:00",
    unreadCount: 2,
    status: "payment",
    payment: {
      amountLabel: "15 USD",
      description: "Visa application assistance",
    },
    messages: [
      {
        id: "msg-4",
        role: "user",
        content:
          "Please prepare a list of documents for a tourist visa to Spain.",
        createdAt: "2026-07-01T17:52:00+03:00",
      },
      {
        id: "msg-5",
        role: "assistant",
        content:
          "I prepared a basic checklist: passport, application form, booking, insurance, and a bank statement.",
        createdAt: "2026-07-01T17:58:00+03:00",
      },
      {
        id: "msg-6",
        role: "user",
        content:
          "Add the requirements for sole proprietors and self-employed applicants too.",
        createdAt: "2026-07-01T18:15:00+03:00",
      },
    ],
  },
  {
    id: "chat-dentist-booking",
    title: "Dentist appointment",
    preview: "Find a clinic near Moscow City",
    updatedAt: "2026-06-30T14:05:00+03:00",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "Find a good dental clinic near Moscow City for this week.",
        createdAt: "2026-06-30T13:41:00+03:00",
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "There are three nearby options. I can compare them by rating, price, and available slots.",
        createdAt: "2026-06-30T13:46:00+03:00",
      },
      {
        id: "msg-9",
        role: "user",
        content: "Compare them by price and whether I can book after work.",
        createdAt: "2026-06-30T14:05:00+03:00",
      },
    ],
  },
  {
    id: "chat-birthday-restaurant",
    title: "Birthday restaurant",
    preview: "Table for 8 people on Saturday",
    updatedAt: "2026-06-29T20:20:00+03:00",
    messages: [
      {
        id: "msg-10",
        role: "user",
        content:
          "Help me choose a restaurant for a birthday dinner for 8 people on Saturday.",
        createdAt: "2026-06-29T19:55:00+03:00",
      },
      {
        id: "msg-11",
        role: "assistant",
        content:
          "I found a few places with a private area and an average bill up to 4,000 rubles per person.",
        createdAt: "2026-06-29T20:03:00+03:00",
      },
      {
        id: "msg-12",
        role: "user",
        content: "I need one more option with live music.",
        createdAt: "2026-06-29T20:20:00+03:00",
      },
    ],
  },
  {
    id: "chat-car-service",
    title: "Car service appointment",
    preview: "Choose a service center and book a morning slot",
    updatedAt: "2026-06-28T11:10:00+03:00",
    status: "payment",
    payment: {
      amountLabel: "15 USD",
      description: "Service booking deposit",
    },
    messages: [
      {
        id: "msg-13",
        role: "user",
        content:
          "I need scheduled maintenance for a BMW X3 and the earliest morning appointment.",
        createdAt: "2026-06-28T10:47:00+03:00",
      },
      {
        id: "msg-14",
        role: "assistant",
        content:
          "I found two service centers with original parts and open slots for tomorrow.",
        createdAt: "2026-06-28T10:55:00+03:00",
      },
      {
        id: "msg-15",
        role: "user",
        content: "Book the one that offers a replacement car.",
        createdAt: "2026-06-28T11:10:00+03:00",
      },
    ],
  },
];
