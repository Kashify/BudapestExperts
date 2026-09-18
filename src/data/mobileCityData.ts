import type { MobilePinPosition, MobileServiceOffset } from "../types";

export const mobilePinPositions: MobilePinPosition[] = [
  { top: "42%", left: "64%" },
  { top: "28%", left: "25%" },
  { top: "38%", left: "51%" },
  { top: "24%", left: "61%" },
  { top: "32%", left: "72%" },
  { top: "55%", left: "55%" },
  { top: "67%", left: "48%" },
  { top: "48%", left: "76%" },
  { top: "20%", left: "79%" },
];

export const mobileServiceOffsets: Record<string, MobileServiceOffset> = {
  "Interior designer": { top: -9, left: -8 },
  "Housing Broker": { top: 4, left: 10 },
  "Mortgage Advisor": { top: -9, left: 8 },
  Translator: { top: 8, left: -5 },
  "Real Estate Lawyer": { top: 6, left: 12 },
};
