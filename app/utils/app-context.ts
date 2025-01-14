import { createContext, useContext } from "react";

export interface AppContextProps {
  username: string;
}

const defaultState: AppContextProps = {
  username: "",
};

export const AppContext = createContext<AppContextProps>(defaultState);

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context as AppContextProps;
}
