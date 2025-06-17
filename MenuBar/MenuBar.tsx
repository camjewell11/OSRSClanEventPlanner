import React, { useState } from "react";
import { Link } from "react-router-dom";

const MenuBar: React.FC = () => {
  const [streamerMode, setStreamerMode] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">OSRS Clan Planner</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/my-profile">My Profile</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/my-clan">My Clan</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/wom-events">WOM Events</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/current-event">Current Event</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/event-management">Event Management</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
          </ul>
          <div className="form-check form-switch text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id="streamerModeSwitch"
              checked={streamerMode}
              onChange={() => setStreamerMode(!streamerMode)}
            />
            <label className="form-check-label" htmlFor="streamerModeSwitch">
              Streamer Mode
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;