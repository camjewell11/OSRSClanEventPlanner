import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Spinner, Row, Col, Card, Alert } from "react-bootstrap";

type Participant = {
  displayName: string;
  gained: number;
  start: number | string;
  end: number | string;
};

type CompetitionDetails = {
  id: number;
  title: string;
  startsAt: string;
  endsAt: string;
  participants: Participant[];
};

const WOMEventDetails: React.FC = () => {
  const { womId } = useParams();
  const [competitionDetails, setCompetitionDetails] = useState<CompetitionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      try {
        const res = await fetch(`/api/wom/competition/${womId}/`);
        const data = await res.json();
        if (data.success) {
          setCompetitionDetails(data.competition);
        } else {
          setCompetitionDetails(null);
        }
      } catch {
        setCompetitionDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitionDetails();
  }, [womId]);

  useEffect(() => {
    if (!competitionDetails) return;
    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date(competitionDetails.startsAt);
      const endDate = new Date(competitionDetails.endsAt);

      let diff;
      if (now < startDate) {
        diff = startDate.getTime() - now.getTime();
      } else if (now < endDate) {
        diff = endDate.getTime() - now.getTime();
      } else {
        diff = 0;
      }

      if (diff <= 0) {
        setTimeRemaining({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [competitionDetails]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading competition details...</div>
      </Container>
    );
  }

  if (!competitionDetails) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">Failed to load competition details.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>{competitionDetails.title}</h2>
          <div>
            <strong>Start Date:</strong> {new Date(competitionDetails.startsAt).toLocaleString()}
          </div>
          <div>
            <strong>End Date:</strong> {new Date(competitionDetails.endsAt).toLocaleString()}
          </div>
        </Col>
        <Col md="auto">
          <Card bg="dark" text="white" className="p-3" style={{ minWidth: 250 }}>
            <Card.Body>
              <Card.Title className="mb-2" style={{ fontSize: "1rem" }}>
                {new Date() < new Date(competitionDetails.startsAt)
                  ? "Time Until Start"
                  : "Time Remaining"}
              </Card.Title>
              <div className="d-flex justify-content-between">
                <div className="text-center">
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{timeRemaining.days}</div>
                  <div style={{ fontSize: "0.8rem" }}>days</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{timeRemaining.hours}</div>
                  <div style={{ fontSize: "0.8rem" }}>hours</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{timeRemaining.minutes}</div>
                  <div style={{ fontSize: "0.8rem" }}>mins</div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{timeRemaining.seconds}</div>
                  <div style={{ fontSize: "0.8rem" }}>secs</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Gamer</th>
            <th className="text-end">XP Gained</th>
            <th className="text-end">Starting XP</th>
            <th className="text-end">Ending XP</th>
          </tr>
        </thead>
        <tbody>
          {competitionDetails.participants
            .filter((participant) => participant.gained > 0)
            .map((participant) => (
              <tr key={participant.displayName}>
                <td>{participant.displayName}</td>
                <td className="text-end">{participant.gained.toLocaleString()}</td>
                <td className="text-end">
                  {participant.start?.toLocaleString() || "N/A"}
                </td>
                <td className="text-end">
                  {participant.end?.toLocaleString() || "N/A"}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default WOMEventDetails;