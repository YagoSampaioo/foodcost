import { useContext } from "react";
import { IfoodContext } from "../contexts/IfoodContext";

export const useIfood = () => {
  const context = useContext(IfoodContext);
  if (context === undefined) {
    throw new Error("useIfood must be used within an IfoodProvider");
  }
  return context;
};
