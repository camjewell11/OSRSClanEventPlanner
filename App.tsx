import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./MenuBar";
import Home from "./Home";
import MyProfile from "./MyProfile";
import MyClan from "./MyClan";
import WOMEvents from "./WOMEvents";
import CurrentEvent from "./CurrentEvent";
import EventManagement from "./EventManagement";
import Admin from "./Admin";

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