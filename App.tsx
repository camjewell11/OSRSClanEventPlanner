import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./MenuBar/MenuBar";
import Home from "./MenuBar/Home";
import MyProfile from "./MenuBar/MyProfile";
import MyClan from "./MenuBar/MyClan";
import WOMEvents from "./MenuBar/WOMEvents";
import CurrentEvent from "./MenuBar/CurrentEvent";
import EventManagement from "./MenuBar/EventManagement";
import Admin from "./MenuBar/Admin";

const App: React.FC = () => (
  <Router>
    <MenuBar />
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-clan" element={<MyClan />} />
        <Route path="/wom-events" element={<WOMEvents />} />
        <Route path="/current-event" element={<CurrentEvent />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  </Router>
);

export default App;