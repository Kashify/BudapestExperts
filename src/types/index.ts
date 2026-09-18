import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

export type Theme = "light" | "dark";

export interface ServiceItem {
  name: string;
  short: string;
  description: string;
  icon: ComponentType<IconProps>;
  className: string;
}

export interface Expert {
  name: string;
  role: string;
  district: string;
  languages: string;
  experience: string;
  image: string;
  color: "blue" | "orange" | "green" | "violet" | "red" | string;
}

export interface ChatMessage {
  from: "you" | "expert";
  text: string;
  time: string;
}

export interface NegotiationOffer {
  amount: string;
  unit: string;
  expires: string;
}

export interface NegotiationThread {
  id: string;
  name: string;
  role: string;
  request: string;
  status: string;
  time: string;
  accent: string;
  initials: string;
  messages: ChatMessage[];
  offer: NegotiationOffer;
}

export interface MobilePinPosition {
  top: string;
  left: string;
}

export interface MobileServiceOffset {
  top: number;
  left: number;
}
