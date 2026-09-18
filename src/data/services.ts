import {
  Buildings,
  HouseLine,
  Key,
  Scales,
  Translate,
} from "@phosphor-icons/react";
import type { ServiceItem } from "../types";

export const services: ServiceItem[] = [
  {
    name: "Interior designer",
    short: "Shape a home that works",
    description: "Plan functional, safe and beautiful spaces with help on layouts, materials and lighting.",
    icon: HouseLine,
    className: "service-interior",
  },
  {
    name: "Housing Broker",
    short: "Move with local context",
    description: "Navigate buying, selling, renting or letting with a professional who knows Budapest.",
    icon: Key,
    className: "service-housing",
  },
  {
    name: "Mortgage Advisor",
    short: "Make the numbers clearer",
    description: "Review your financial position and compare suitable mortgage paths from lenders.",
    icon: Buildings,
    className: "service-mortgage",
  },
  {
    name: "Translator",
    short: "Be understood, precisely",
    description: "Translate written or spoken content while preserving meaning, tone and context.",
    icon: Translate,
    className: "service-translation",
  },
  {
    name: "Real Estate Lawyer",
    short: "Protect every agreement",
    description: "Get specialist support with property contracts, transactions, disputes and title matters.",
    icon: Scales,
    className: "service-legal",
  },
];
