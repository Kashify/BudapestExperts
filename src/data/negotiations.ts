import type { NegotiationThread } from "../types";

export const negotiations: NegotiationThread[] = [
  {
    id: "rental-review",
    name: "Márk Daniels",
    role: "Housing Broker",
    request: "Rental agreement review · District V",
    status: "Waiting for your reply",
    time: "12 min ago",
    accent: "orange",
    initials: "MD",
    messages: [
      { from: "expert", text: "I can review the agreement and flag the clauses that need attention before you sign.", time: "10:42" },
      { from: "you", text: "That sounds right. Could you also check the early termination section?", time: "10:47" },
      { from: "expert", text: "Yes. I can include that in the review and walk you through the changes on a short call.", time: "10:49" },
    ],
    offer: { amount: "35,000", unit: "for the review", expires: "Valid for 48 hours" },
  },
  {
    id: "interior-plan",
    name: "Anna Kovács",
    role: "Interior designer",
    request: "Two-room apartment plan · XI. Újbuda",
    status: "Offer received",
    time: "Yesterday",
    accent: "blue",
    initials: "AK",
    messages: [
      { from: "expert", text: "I have looked at your brief. The light study will help us make the living room work harder.", time: "Yesterday" },
      { from: "you", text: "I would like to keep the existing kitchen if possible.", time: "Yesterday" },
    ],
    offer: { amount: "72,000", unit: "for the first concept", expires: "Valid for 5 days" },
  },
  {
    id: "translation",
    name: "Dániel Nagy",
    role: "Translator",
    request: "Property documents · English to Hungarian",
    status: "You sent a message",
    time: "2 days ago",
    accent: "violet",
    initials: "DN",
    messages: [
      { from: "you", text: "I have three documents, around 18 pages in total. Is that within your usual turnaround?", time: "Mon" },
      { from: "expert", text: "Yes, I can deliver the translation by Thursday afternoon.", time: "Mon" },
    ],
    offer: { amount: "48,000", unit: "for all documents", expires: "Awaiting confirmation" },
  },
];
