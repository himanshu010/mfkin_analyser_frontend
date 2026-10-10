import {
  Car,
  Cpu,
  Factory,
  Film,
  FlaskConical,
  Globe2,
  HardHat,
  House,
  Landmark,
  LayoutGrid,
  Leaf,
  Layers,
  Shield,
  ShoppingBag,
  Smartphone,
  Zap,
} from "lucide-react";

// Keyword, icon pairs checked in order against the lower-cased sector name.
const icons = [
  ["all funds", Layers],
  ["bank", Landmark],
  ["financ", Landmark],
  ["pharma", FlaskConical],
  ["health", FlaskConical],
  ["tech", Cpu],
  ["fmcg", ShoppingBag],
  ["consum", ShoppingBag],
  ["infra", HardHat],
  ["construction", HardHat],
  ["energy", Zap],
  ["power", Zap],
  ["auto", Car],
  ["real", House],
  ["media", Film],
  ["telecom", Smartphone],
  ["manufactur", Factory],
  ["industrial", Factory],
  ["defen", Shield],
  ["global", Globe2],
  ["international", Globe2],
  ["esg", Leaf],
  ["sustain", Leaf],
];

export const sectorIcon = (sector) => {
  const name = sector.toLowerCase();
  return icons.find(([keyword]) => name.includes(keyword))?.[1] ?? LayoutGrid;
};
