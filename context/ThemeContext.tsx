import { createContext, ReactNode, useState } from "react";
import { Appearance } from "react-native";

import { Theme } from "../constants/Theme";

type ThemeContextType = {
  theme: typeof Theme.light | typeof Theme.dark;
  colorScheme: "light" | "dark" | null | undefined;
  setColorScheme: (scheme: "light" | "dark") => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.light,
  colorScheme: null,
  setColorScheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const theme = colorScheme === "dark" ? Theme.dark : Theme.light;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
