import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Competition = {
  id: number;
  title: string;
  startsAt: string;
  endsAt: string;
};

const WOMEvents: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch("/api/wom/group/competitions/");
        const data = await res.json();
        if (data.success) {
          setCompetitions(data.competitions);
        }
      } catch (e) {
        console.error("Error fetching competitions:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  const getRowStyle = (comp: Competition) => {
    const now = new Date();
    const start = new Date(comp.startsAt);
    const end = new Date(comp.endsAt);

    if (now >= start && now <= end) {
      return { backgroundColor: "#d4edda" };
    } else if (now > end) {
      return { backgroundColor: "#f8d7da" };
    } else {
      return {};
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ alignSelf: "flex-start", marginLeft: '2.5vw' }}>Clan Events</h2>
      <Table
        striped
        bordered
        hover
        responsive
        style={{
          width: "95vw",
          margin: "0 auto",
        }}
      >
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((comp) => (
            <tr key={comp.id}>
              <td style={getRowStyle(comp)}>{comp.title}</td>
              <td style={getRowStyle(comp)}>{new Date(comp.startsAt).toLocaleString()}</td>
              <td style={getRowStyle(comp)}>{new Date(comp.endsAt).toLocaleString()}</td>
              <td style={getRowStyle(comp)}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/wom/event/${comp.id}`)}
                >
                  View Event
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ flex: 1 }} />
      <div className="d-flex justify-content-center mb-3 mt-3" style={{ width: "95vw" }}>
        <Alert
          variant="info"
          className="w-100"
          style={{ marginBottom: 0 }}
        >
          You must have the WiseOldMan plugin installed in Runelite to track event statistics.
        </Alert>
      </div>
    </div>
  );
};

export default WOMEvents;