import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SharedChat from "./pages/SharedChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Chat />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/share/:threadId"
          element={<SharedChat />}
        />

      </Routes>
    </BrowserRouter>
  );
}
