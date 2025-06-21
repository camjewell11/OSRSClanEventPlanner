import "bootstrap";
import * as ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const app = document.getElementById("app");
if (app) {
  const root = ReactDOM.createRoot(app);
  root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
}
