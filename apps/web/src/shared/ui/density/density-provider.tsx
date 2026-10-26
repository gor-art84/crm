"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import { applyDensity, type Density } from "@/shared/lib/density";

type DensityContextValue = {
  density: Density;
  setDensity: (density: Density) => void;
};

type DensityProviderProps = {
  initialDensity: Density;
  children: ReactNode;
};

const DensityContext = createContext<DensityContextValue | null>(null);

export const DensityProvider = ({ initialDensity, children }: DensityProviderProps) => {
  const [density, setDensityState] = useState(initialDensity);

  const setDensity = (next: Density) => {
    applyDensity(next);
    setDensityState(next);
  };

  return (
    <DensityContext.Provider value={{ density, setDensity }}>{children}</DensityContext.Provider>
  );
};

export const useDensity = (): DensityContextValue => {
  const context = useContext(DensityContext);
  if (context === null) {
    throw new Error("useDensity must be used within a DensityProvider");
  }
  return context;
};
