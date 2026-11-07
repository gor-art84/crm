import { type LucideIcon, Rows3, Rows4 } from "lucide-react";
import type { Density } from "@/shared/lib/density";

export type DensityOption = {
  value: Density;
  label: string;
  description?: string;
  Icon: LucideIcon;
};

export const DENSITY_OPTIONS = [
  { value: "compact", label: "Компактно", description: "Больше строк на экране", Icon: Rows4 },
  { value: "default", label: "Обычно", description: "Меньше строк на экране", Icon: Rows3 },
] as const satisfies readonly DensityOption[];
