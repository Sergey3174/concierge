export type MockChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type MockChat = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  unreadCount?: number;
  messages: MockChatMessage[];
};

export const mockChats: MockChat[] = [
  {
    id: "chat-apartment-cleaning",
    title: "Уборка квартиры в пятницу",
    preview: "Нужна генеральная уборка после 19:00",
    updatedAt: "2026-07-02T09:40:00+03:00",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Нужна генеральная уборка двухкомнатной квартиры в пятницу вечером.",
        createdAt: "2026-07-02T09:32:00+03:00",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "Подобрал клинеров. Уточните, пожалуйста, удобное время начала.",
        createdAt: "2026-07-02T09:34:00+03:00",
      },
      {
        id: "msg-3",
        role: "user",
        content: "После 19:00, и желательно с мытьем окон.",
        createdAt: "2026-07-02T09:40:00+03:00",
      },
    ],
  },
  {
    id: "chat-visa-documents",
    title: "Документы на визу",
    preview: "Собери чек-лист для подачи в Испанию",
    updatedAt: "2026-07-01T18:15:00+03:00",
    unreadCount: 2,
    messages: [
      {
        id: "msg-4",
        role: "user",
        content: "Собери, пожалуйста, список документов на туристическую визу в Испанию.",
        createdAt: "2026-07-01T17:52:00+03:00",
      },
      {
        id: "msg-5",
        role: "assistant",
        content: "Подготовил базовый чек-лист: загранпаспорт, анкета, бронь, страховка, выписка со счета.",
        createdAt: "2026-07-01T17:58:00+03:00",
      },
      {
        id: "msg-6",
        role: "user",
        content: "Добавь еще требования для ИП и самозанятых.",
        createdAt: "2026-07-01T18:15:00+03:00",
      },
    ],
  },
  {
    id: "chat-dentist-booking",
    title: "Запись к стоматологу",
    preview: "Найди клинику рядом с Сити",
    updatedAt: "2026-06-30T14:05:00+03:00",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "Найди хорошую стоматологию рядом с Москва-Сити на этой неделе.",
        createdAt: "2026-06-30T13:41:00+03:00",
      },
      {
        id: "msg-8",
        role: "assistant",
        content: "Есть три варианта рядом. Могу сравнить по рейтингу, цене и свободным окнам.",
        createdAt: "2026-06-30T13:46:00+03:00",
      },
      {
        id: "msg-9",
        role: "user",
        content: "Сравни по цене и возможности записаться после работы.",
        createdAt: "2026-06-30T14:05:00+03:00",
      },
    ],
  },
  {
    id: "chat-birthday-restaurant",
    title: "Ресторан на день рождения",
    preview: "Столик на 8 человек в субботу",
    updatedAt: "2026-06-29T20:20:00+03:00",
    messages: [
      {
        id: "msg-10",
        role: "user",
        content: "Помоги выбрать ресторан для дня рождения на 8 человек в субботу.",
        createdAt: "2026-06-29T19:55:00+03:00",
      },
      {
        id: "msg-11",
        role: "assistant",
        content: "Подобрал несколько мест с отдельной зоной и средним чеком до 4000 рублей на человека.",
        createdAt: "2026-06-29T20:03:00+03:00",
      },
      {
        id: "msg-12",
        role: "user",
        content: "Нужен еще вариант с живой музыкой.",
        createdAt: "2026-06-29T20:20:00+03:00",
      },
    ],
  },
  {
    id: "chat-car-service",
    title: "ТО для машины",
    preview: "Подобрать сервис и записать на утро",
    updatedAt: "2026-06-28T11:10:00+03:00",
    messages: [
      {
        id: "msg-13",
        role: "user",
        content: "Нужно пройти ТО для BMW X3 и записаться на ближайшее утро.",
        createdAt: "2026-06-28T10:47:00+03:00",
      },
      {
        id: "msg-14",
        role: "assistant",
        content: "Нашел два сервиса с оригинальными расходниками и свободными окнами на завтра.",
        createdAt: "2026-06-28T10:55:00+03:00",
      },
      {
        id: "msg-15",
        role: "user",
        content: "Запиши в тот, где есть подменный автомобиль.",
        createdAt: "2026-06-28T11:10:00+03:00",
      },
    ],
  },
];
