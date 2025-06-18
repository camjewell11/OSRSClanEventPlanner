import 'bootstrap';
import * as ReactDOM from 'react-dom/client';
import { Provider } from './src/components/ui/provider';
import {Button, HStack} from "@chakra-ui/react"
import App from './App';

const app = document.getElementById("app");
if (app) {
  const root = ReactDOM.createRoot(app);
  /*root.render(
  <Provider>
    <HStack>
    <Button>Click me</Button>
    <Button>Click me 2</Button>
  </HStack>
  </Provider>);*/
  root.render (<App />);
}