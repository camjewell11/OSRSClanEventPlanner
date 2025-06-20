import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./MenuBar/MenuBar";
import Home from "./MenuBar/Home";
import MyProfile from "./MenuBar/MyProfile";
import Statistics from "./MenuBar/Statistics";
import MyClan from "./MenuBar/MyClan";
import WOMEvents from "./MenuBar/WOMEvents";
import WOMEventDetails from "./MenuBar/WOMEventDetails";
import CurrentEvent from "./MenuBar/CurrentEvent";
import EventManagement from "./MenuBar/EventManagement";
import Admin from "./MenuBar/Admin";
import Draft from "./CurrentEvent/Draft";
import Login from "./CurrentEvent/Authentication/Login";
import CreateAccount from "./CurrentEvent/Authentication/CreateAccount";
import type { User } from "./CurrentEvent/Authentication/Login";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <Router>
      <MenuBar user={user} setUser={setUser} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/tracker/:username" element={<Statistics />} />
          <Route path="/my-clan" element={<MyClan />} />
          <Route path="/wom-events" element={<WOMEvents />} />
          <Route path="/wom/event/:womId" element={<WOMEventDetails />} />
          <Route path="/current-event" element={<CurrentEvent />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
