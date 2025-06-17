import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Spinner, Alert } from "react-bootstrap";
import { wildernessBosses, slayerOnlyMonsters, multiCombatBosses, hardModeRaids, memberSkills, clueScrollColors } from "../Information";

const Statistics: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [osrsDetails, setOsrsDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOsrsDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/wom/player/${username}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const latestData = data.player.latestSnapshot.data;
        const skills = latestData.skills;
        const bosses = latestData.bosses;
        const clues = Object.keys(latestData.activities)
          .filter((key) => key.startsWith("clue_scrolls"))
          .reduce((acc: any, key) => {
            acc[key] = latestData.activities[key];
            return acc;
          }, {});
        const raids = [
          "chambers_of_xeric",
          "chambers_of_xeric_challenge_mode",
          "theatre_of_blood",
          "theatre_of_blood_hard_mode",
          "tombs_of_amascut",
          "tombs_of_amascut_expert",
        ].reduce((acc: any, raid) => {
          if (latestData.bosses[raid]) acc[raid] = latestData.bosses[raid];
          return acc;
        }, {});
        const activities = latestData.activities;

        setOsrsDetails({ skills, bosses, clues, raids, activities });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (username) fetchOsrsDetails();
  }, [username]);

  if (loading) return <div className="p-4"><Spinner animation="border" /> Loading...</div>;
  if (error) return <Alert variant="danger" className="p-4">Error: {error}</Alert>;

  return (
    <div style={{ padding: 20 }}>
      <h2 className="mb-4">Statistics for {username}</h2>
      {osrsDetails && (
        <Tabs defaultActiveKey="skills" id="clue-tracker-tabs" className="mb-3">
          <Tab eventKey="skills" title="Skills">
            <table className="table table-striped table-bordered mb-4">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(osrsDetails.skills)
                  .filter((skill) => skill !== "overall")
                  .map((skill) => (
                    <tr key={skill}>
                      <td style={{ color: memberSkills.includes(skill) ? "blue" : "black" }}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </td>
                      <td>{osrsDetails.skills[skill].level}</td>
                      <td>{osrsDetails.skills[skill].experience.toLocaleString()}</td>
                      <td>{osrsDetails.skills[skill].rank}</td>
                    </tr>
                  ))}
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>{osrsDetails.skills.overall.level}</td>
                  <td style={{ fontWeight: "bold" }}>{osrsDetails.skills.overall.experience.toLocaleString()}</td>
                  <td style={{ fontWeight: "bold" }} />
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="clues" title="Clues">
            <table className="table table-striped table-bordered mb-4">
              <thead>
                <tr>
                  <th>Clue</th>
                  <th>Total</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(osrsDetails.clues)
                  .filter((clue: string) => clue !== "clue_scrolls_all")
                  .map((clue: string) => (
                    <tr key={clue}>
                      <td style={{ color: clueScrollColors[clue] || "black" }}>
                        {clue.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </td>
                      <td>{osrsDetails.clues[clue].score === -1 ? "N/A" : osrsDetails.clues[clue].score}</td>
                      <td>{osrsDetails.clues[clue].rank === -1 ? "N/A" : osrsDetails.clues[clue].rank}</td>
                    </tr>
                  ))}
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>
                    {osrsDetails.clues.clue_scrolls_all.score === -1 ? "N/A" : osrsDetails.clues.clue_scrolls_all.score}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {osrsDetails.clues.clue_scrolls_all.rank === -1 ? "N/A" : osrsDetails.clues.clue_scrolls_all.rank}
                  </td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="bosses" title="Bosses">
            <table className="table table-striped table-bordered mb-4">
              <thead>
                <tr>
                  <th>Boss</th>
                  <th>Kills</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(osrsDetails.bosses).map((boss: string) => (
                  <tr key={boss}>
                    <td style={{
                      color: wildernessBosses.includes(boss)
                        ? "red"
                        : multiCombatBosses.includes(boss)
                        ? "green"
                        : slayerOnlyMonsters.includes(boss)
                        ? "blue"
                        : "black"
                    }}>
                      {boss.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td>{osrsDetails.bosses[boss].kills === -1 ? "N/A" : osrsDetails.bosses[boss].kills}</td>
                    <td>{osrsDetails.bosses[boss].rank === -1 ? "N/A" : osrsDetails.bosses[boss].rank}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>
                    {Object.values(osrsDetails.bosses).reduce(
                      (total: number, boss: any) => (boss.kills !== -1 ? total + boss.kills : total),
                      0
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }} />
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="raids" title="Raids">
            <table className="table table-striped table-bordered mb-4">
              <thead>
                <tr>
                  <th>Raid</th>
                  <th>Completions</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(osrsDetails.raids).map((raid: string) => (
                  <tr key={raid}>
                    <td style={{ color: hardModeRaids.includes(raid) ? "red" : "black" }}>
                      {raid.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td>{osrsDetails.raids[raid].kills === -1 ? "N/A" : osrsDetails.raids[raid].kills}</td>
                    <td>{osrsDetails.raids[raid].rank === -1 ? "N/A" : osrsDetails.raids[raid].rank}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>
                    {Object.values(osrsDetails.raids).reduce(
                      (total: number, raid: any) => (raid.kills !== -1 ? total + raid.kills : total),
                      0
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }} />
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="activities" title="Minigames">
            <table className="table table-striped table-bordered mb-4">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Score</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(osrsDetails.activities)
                  .filter((activity: string) => !activity.startsWith("clue_scrolls"))
                  .map((activity: string) => (
                    <tr key={activity}>
                      <td>{activity.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</td>
                      <td>{osrsDetails.activities[activity]?.score === -1 ? "N/A" : osrsDetails.activities[activity]?.score}</td>
                      <td>{osrsDetails.activities[activity]?.rank === -1 ? "N/A" : osrsDetails.activities[activity]?.rank}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default Statistics;