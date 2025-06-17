import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container, Button } from "react-bootstrap";
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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="mt-4 d-flex flex-column" style={{ minHeight: "80vh" }}>
      <h2>Clan Events</h2>
      <Table striped bordered hover>
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
              <td>{comp.title}</td>
              <td>{new Date(comp.startsAt).toLocaleString()}</td>
              <td>{new Date(comp.endsAt).toLocaleString()}</td>
              <td>
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
      <div className="d-flex justify-content-center mb-3">
        <Alert
          variant="info"
          className="w-100"
          style={{ marginBottom: 0 }}
        >
          You must have the WiseOldMan plugin installed in Runelite to track event statistics.
        </Alert>
      </div>
    </Container>
  );
};

export default WOMEvents;