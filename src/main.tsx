import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./design-system";
import { App } from "./App";
import "./design-system/design-tokens.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
