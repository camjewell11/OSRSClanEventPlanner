import 'bootstrap';
import * as ReactDOM from 'react-dom/client';
import {ChakraProvider, defaultSystem} from "@chakra-ui/react"
import App from './App';

const app = document.getElementById("app");
if (app) {
  const root = ReactDOM.createRoot(app);
  root.render (
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  );
}