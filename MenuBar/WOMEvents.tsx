import React, { useEffect, useState } from "react";

type Competition = {
  id: number;
  title: string;
  startsAt: string;
  endsAt: string;
};

const WOMEvents: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch("/api/wom/group/competitions/");
        const data = await res.json();
        if (data.success) {
          setCompetitions(data.competitions);
        }
      } catch (e) {
        // Handle error (optional)
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status" /></div>;
  }

  return (
    <div>
      <h2>Clan Events</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((comp) => (
            <tr key={comp.id}>
              <td>{comp.title}</td>
              <td>{new Date(comp.startsAt).toLocaleString()}</td>
              <td>{new Date(comp.endsAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="alert alert-info mt-4">
        You must have the WiseOldMan plugin installed in Runelite to track event statistics.
      </div>
    </div>
  );
};

export default WOMEvents;