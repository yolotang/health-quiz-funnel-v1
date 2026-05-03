export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
};

export const feetInchesToCm = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  return totalInches * 2.54;
};

export const kgToLb = (kg: number): number => kg * 2.2046226218;

export const lbToKg = (lb: number): number => lb / 2.2046226218;
