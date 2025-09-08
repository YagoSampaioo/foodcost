import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { DataProvider } from "./contexts/DataContexts.tsx";
import { IfoodProvider } from "./contexts/IfoodContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <IfoodProvider>
          <App />
        </IfoodProvider>
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);
