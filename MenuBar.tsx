import React, { useState } from "react";

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
            <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#">My Profile</a></li>
            <li className="nav-item"><a className="nav-link" href="#">My Clan</a></li>
            <li className="nav-item"><a className="nav-link" href="#">WOM Events</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Current Event</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Event Management</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Admin</a></li>
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