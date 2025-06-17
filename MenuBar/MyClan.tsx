import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Tabs, Tab, Spinner, Alert, Image, Row, Col, InputGroup } from "react-bootstrap";
import { groupIrons, prestigeGroupIrons } from "../GroupIronmen";
import { skills, bosses, raids, clueScrolls } from "../Information";
import { toCamelCase } from "../helpers/CamelCase";

// Define a type for your clan member objects
type ClanMember = {
  playerId: number;
  displayName: string;
  type?: string;
  role?: string;
  [key: string]: any;
};

const typeToImage: Record<string, string> = {
  ironman: "/images/jagex/Ironman_chat_badge.webp",
  ultimate: "/images/jagex/Ultimate_ironman_chat_badge.webp",
  hardcore: "/images/jagex/Hardcore_ironman_chat_badge.webp",
  group: "/images/jagex/Group_ironman_chat_badge.webp",
  prestigeGroup: "/images/jagex/Unranked_group_ironman_chat_badge.webp",
};

const roleToImage: Record<string, string> = {
  admiral: "/images/jagex/roles/Admiral.webp",
  beast: "/images/jagex/roles/Beast.webp",
  brigadier: "/images/jagex/roles/Brigadier.webp",
  cadet: "/images/jagex/roles/Cadet.webp",
  captain: "/images/jagex/roles/Captain.webp",
  colonel: "/images/jagex/roles/Colonel.webp",
  corporal: "/images/jagex/roles/Corporal.webp",
  death: "/images/jagex/roles/Death.webp",
  general: "/images/jagex/roles/General.webp",
  imp: "/images/jagex/roles/Imp.webp",
  lieutenant: "/images/jagex/roles/Lieutenant.webp",
  marshal: "/images/jagex/roles/Marshal.webp",
  mentor: "/images/jagex/roles/Mentor.webp",
  merchant: "/images/jagex/roles/Merchant.webp",
  moderator: "/images/jagex/roles/Moderator.webp",
  novice: "/images/jagex/roles/Novice.webp",
  owner: "/images/jagex/roles/Owner.webp",
  pawn: "/images/jagex/roles/Pawn.webp",
  private: "/images/jagex/roles/Private.webp",
  recruit: "/images/jagex/roles/Recruit.webp",
  sergeant: "/images/jagex/roles/Sergeant.webp",
  slayer: "/images/jagex/roles/Slayer.webp",
  smith: "/images/jagex/roles/Smith.webp",
  trialist: "/images/jagex/roles/Trialist.webp",
};

const MyClan = () => {
  const [members, setMembers] = useState<ClanMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ClanMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("overall");
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({ key: null, direction: null });
  const [isLoading, setIsLoading] = useState(false);
  const [tabKey, setTabKey] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/wom/group/");
        const data = await res.json();
        if (data.success) {
          setMembers(data.message.memberships);

          if (selectedSkill === "clues") {
            const cluePromises = clueScrolls.map((clue) =>
              fetch(`/api/wom/group/highscores/?metric=${encodeURIComponent(clue)}`).then(res => res.json())
            );
            const clueResponses = await Promise.all(cluePromises);
            const clues: Record<string, any[]> = clueResponses.reduce((acc, response, index) => {
              const clueKey = clueScrolls[index];
              if (clueKey !== undefined) {
                if (response.success) {
                  acc[clueKey] = response.message;
                } else {
                  acc[clueKey] = [];
                }
              }
              return acc;
            }, {} as Record<string, any[]>);
            setMembers((prevMembers) =>
              prevMembers.map((member) => {
                const updatedMember = { ...member };
                clueScrolls.forEach((clue) => {
                  const clueData = clues[clue]?.find((c) => c.player.id === member.playerId);
                  updatedMember[clue] = clue
                    ? clue === "mimic"
                      ? clueData && clueData.data.kills !== -1 ? clueData.data.kills : "N/A"
                      : clueData && clueData.data.score !== -1 ? clueData.data.score : "N/A"
                    : "N/A";
                });
                const clueAllData = clues["clue_scrolls_all"]?.find((c) => c.player.id === member.playerId);
                updatedMember.rank = clueAllData ? clueAllData.data.rank : "N/A";
                return updatedMember;
              })
            );
          } else {
            const highscoresResponse = await fetch(`/api/wom/group/highscores/?metric=${encodeURIComponent(selectedSkill)}`);
            const highscoresData = await highscoresResponse.json();
            if (highscoresData.success) {
              const highscores = highscoresData.message.map((highscore: any) => ({
                playerId: highscore.player.id,
                displayName: highscore.player.displayName,
                level: highscore.data.level || "N/A",
                experience: highscore.data.experience || "N/A",
                rank: highscore.data.rank,
                type: highscore.player.type,
                kills: highscore.data.kills || "N/A",
              }));
              setMembers((prevMembers) =>
                prevMembers.map((member) => {
                  const highscore = highscores.find((h: { playerId: number; }) => h.playerId === member.playerId);
                  return highscore
                    ? { ...member, ...highscore }
                    : { ...member, level: "N/A", experience: "N/A", rank: "N/A", kills: "N/A", type: member.type };
                })
              );
            } else {
              setError(highscoresData.message);
            }
          }
        } else {
          setError(data.message || "Failed to fetch clan members.");
        }
      } catch (e) {
        setError("Failed to fetch clan members.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, [selectedSkill]);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [members, searchTerm]);

  useEffect(() => {
    if (sortConfig.key) {
      setFilteredMembers((prevMembers) => {
        const sortedMembers = [...prevMembers].sort((a, b) => {
          const aValue = a[sortConfig.key!] === "N/A" || a[sortConfig.key!] === undefined ? -1 : a[sortConfig.key!];
          const bValue = b[sortConfig.key!] === "N/A" || b[sortConfig.key!] === undefined ? -1 : b[sortConfig.key!];
          if (sortConfig.direction === "asc") {
            return aValue > bValue ? 1 : -1;
          } else if (sortConfig.direction === "desc") {
            return aValue < bValue ? 1 : -1;
          }
          return 0;
        });
        return sortedMembers;
      });
    }
  }, [sortConfig]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        const nextDirection = prevConfig.direction === "asc" ? "desc" : prevConfig.direction === "desc" ? null : "asc";
        return { key, direction: nextDirection };
      }
      return { key, direction: key === "rank" || key === "displayName" ? "asc" : "desc" };
    });
  };

  const handleViewStats = (username: string) => {
    navigate(`/tracker/${username}`);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkill(e.target.value);
    setSortConfig({ key: null, direction: null });
  };

  const getFilteredByType = (type: string) => {
    if (type === "all") return filteredMembers;
    if (type === "group") {
      return filteredMembers.filter(
        (member) =>
          member.type === "group" ||
          (member.type === "regular" &&
            (groupIrons.includes(member.displayName) || prestigeGroupIrons.includes(member.displayName)))
      );
    }
    if (type === "regular") {
      return filteredMembers.filter(
        (member) =>
          member.type === "regular" &&
          !groupIrons.includes(member.displayName) &&
          !prestigeGroupIrons.includes(member.displayName)
      );
    }
    return filteredMembers.filter((member) => member.type === type);
  };

  return (
    <div style={{ padding: 16 }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h2>Clan Members</h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <InputGroup style={{ maxWidth: 300, marginRight: 16 }}>
            <Form.Control
              placeholder="Search by username"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button variant="outline-secondary" size="sm" onClick={() => setSearchTerm("")}>
                ✕
              </Button>
            )}
          </InputGroup>
          <Form.Select
            value={selectedSkill}
            onChange={handleSkillChange}
            style={{ maxWidth: 200 }}
          >
            <option value="overall">Overall</option>
            <option disabled>──────────</option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </option>
            ))}
            <option disabled>──────────</option>
            {bosses.map((boss) => (
              <option key={boss} value={boss}>
                {toCamelCase(boss)}
              </option>
            ))}
            <option disabled>──────────</option>
            {raids.map((raid) => (
              <option key={raid} value={raid}>
                {toCamelCase(raid)}
              </option>
            ))}
            <option disabled>──────────</option>
            <option value="clues">Clue Scrolls</option>
          </Form.Select>
        </Col>
      </Row>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <div>Loading...</div>
        </div>
      ) : (
        <Tabs
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k || "all")}
          className="mb-3"
        >
          <Tab eventKey="all" title="All" />
          <Tab eventKey="regular" title="Mains" />
          <Tab eventKey="ironman" title="Irons" />
          <Tab eventKey="ultimate" title="Ultimates" />
          <Tab eventKey="group" title="Groups" />
          <Tab eventKey="hardcore" title="Hardcores" />
          {["all", "regular", "ironman", "ultimate", "group", "hardcore"].map((type) => (
            tabKey === type && (
              <Tab.Pane key={type} eventKey={type}>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSort("displayName")}
                      >
                        Gamer {sortConfig.key === "displayName" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                      </th>
                      {selectedSkill === "clues" ? (
                        <>
                          <th onClick={() => handleSort("clue_scrolls_all")} style={{ cursor: "pointer" }}>Total {sortConfig.key === "clue_scrolls_all" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_beginner")} style={{ cursor: "pointer" }}>Beginner {sortConfig.key === "clue_scrolls_beginner" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_easy")} style={{ cursor: "pointer" }}>Easy {sortConfig.key === "clue_scrolls_easy" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_medium")} style={{ cursor: "pointer" }}>Medium {sortConfig.key === "clue_scrolls_medium" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_hard")} style={{ cursor: "pointer" }}>Hard {sortConfig.key === "clue_scrolls_hard" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_elite")} style={{ cursor: "pointer" }}>Elite {sortConfig.key === "clue_scrolls_elite" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("clue_scrolls_master")} style={{ cursor: "pointer" }}>Master {sortConfig.key === "clue_scrolls_master" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("mimic")} style={{ cursor: "pointer" }}>Mimic {sortConfig.key === "mimic" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("rank")} style={{ cursor: "pointer" }}>Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                        </>
                      ) : bosses.includes(selectedSkill) || raids.includes(selectedSkill) ? (
                        <>
                          <th onClick={() => handleSort("kills")} style={{ cursor: "pointer" }}>Kills {sortConfig.key === "kills" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                          <th onClick={() => handleSort("rank")} style={{ cursor: "pointer" }}>Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}</th>
                        </>
                      ) : (
                        <>
                          <th onClick={() => handleSort("level")} style={{ cursor: "pointer" }}>
                            {selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1)} Level
                            {sortConfig.key === "level" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </th>
                          <th onClick={() => handleSort("experience")} style={{ cursor: "pointer" }}>
                            XP {sortConfig.key === "experience" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </th>
                          <th onClick={() => handleSort("rank")} style={{ cursor: "pointer" }}>
                            Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </th>
                        </>
                      )}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredByType(type).map((member) => {
                      const displayType =
                        member.type === "regular" && prestigeGroupIrons.includes(member.displayName)
                          ? "prestigeGroup"
                          : member.type === "regular" && groupIrons.includes(member.displayName)
                          ? "group"
                          : member.type;
                      return (
                        <tr key={member.playerId}>
                          <td>
                            {member.role && roleToImage[member.role] ? (
                              <Image src={roleToImage[member.role]} alt={member.role} width={24} height={24} />
                            ) : (
                              member.role
                            )}
                          </td>
                          <td>
                            {displayType && typeToImage[displayType] && (
                              <Image src={typeToImage[displayType]} alt={displayType} width={24} height={24} />
                            )}
                          </td>
                          <td>{member.displayName}</td>
                          {selectedSkill === "clues" ? (
                            <>
                              <td>{member.clue_scrolls_all ?? "N/A"}</td>
                              <td>{member.clue_scrolls_beginner ?? "N/A"}</td>
                              <td>{member.clue_scrolls_easy ?? "N/A"}</td>
                              <td>{member.clue_scrolls_medium ?? "N/A"}</td>
                              <td>{member.clue_scrolls_hard ?? "N/A"}</td>
                              <td>{member.clue_scrolls_elite ?? "N/A"}</td>
                              <td>{member.clue_scrolls_master ?? "N/A"}</td>
                              <td>{member.mimic ?? "N/A"}</td>
                              <td>{member.rank === -1 ? "N/A" : member.rank}</td>
                            </>
                          ) : bosses.includes(selectedSkill) || raids.includes(selectedSkill) ? (
                            <>
                              <td>{member.kills === -1 ? "N/A" : member.kills}</td>
                              <td>{member.rank === -1 ? "N/A" : member.rank}</td>
                            </>
                          ) : (
                            <>
                              <td>{member.level === -1 ? "N/A" : member.level}</td>
                              <td>{member.experience ? member.experience.toLocaleString() : "N/A"}</td>
                              <td>{member.rank === -1 ? "N/A" : member.rank}</td>
                            </>
                          )}
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewStats(member.displayName)}
                            >
                              View Stats
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {type === "group" && (
                  <div className="mt-3 text-muted" style={{ fontSize: "0.9em" }}>
                    If you're not listed as a group ironman in the Groups tab, message ThePrestiege on Discord to have it updated. Wise Old Man does not support group ironman type in its API.
                  </div>
                )}
              </Tab.Pane>
            )
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default MyClan;