import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Image,
  Input,
  InputGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { skills, bosses, raids, clueScrolls } from "../Information";
import { toCamelCase } from "../helpers/CamelCase";

import {
  iron_chat,
    ultimate_chat,
    hardcore_chat,
    group_chat,
    prestige_group_chat,
    admiral,
    beast,
    brigadier,
    cadet,
    captain,
    colonel,
    corporal,
    death,
    general,
    imp,
    lieutenant,
    marshal,
    mentor,
    merchant,
    moderator,
    novice,
    owner,
    pawn,
    privateRole,
    recruit,
    sergeant,
    slayer,
    smith,
    trialist
} from "../imageImports"

type ClanMember = {
  playerId: number;
  displayName: string;
  type?: string;
  role?: string;
  [key: string]: any;
};

const typeToImage: Record<string, string> = {
  ironman: iron_chat,
  ultimate: ultimate_chat,
  hardcore: hardcore_chat,
  group: group_chat,
  prestigeGroup: prestige_group_chat,
};

const roleToImage: Record<string, string> = {
  admiral: admiral,
  beast: beast,
  brigadier: brigadier,
  cadet: cadet,
  captain: captain,
  colonel: colonel,
  corporal: corporal,
  death: death,
  general: general,
  imp: imp,
  lieutenant: lieutenant,
  marshal: marshal,
  mentor: mentor,
  merchant: merchant,
  moderator: moderator,
  novice: novice,
  owner: owner,
  pawn: pawn,
  private: privateRole,
  recruit: recruit,
  sergeant: sergeant,
  slayer: slayer,
  smith: smith,
  trialist: trialist,
};

const groupIrons: string[] = []
const prestigeGroupIrons: string[] = [];

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
              fetch(`/api/wom/group/highscores/?metric=${encodeURIComponent(clue)}`)
                .then(res => {
                  if (!res.ok) {
                    throw new Error(`Failed to fetch highscores for ${clue}: ${res.status}`);
                  }
                  return res.json();
                })
                .catch(err => {
                  console.error(`Error fetching highscores for ${clue}:`, err);
                  return { success: false, message: err.message };
                })
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
                level: highscore.data.level ?? "N/A",
                experience: highscore.data.experience ?? "N/A",
                rank: highscore.data.rank ?? "N/A",
                type: highscore.player.type,
                kills: highscore.data.kills ?? "N/A",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Box p={{ base: "0 4px", md: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <Text as="h2" fontSize="xl">
          Clan Members
        </Text>
        <Box display="flex" alignItems="center">
          <InputGroup width="300px" mr={4}>
            <Input
              placeholder="Search by username"
              value={searchTerm}
              onChange={handleSearchChange}
              pr="40px"
            />
            {searchTerm && (
              <Button
                size="sm"
                onClick={() => setSearchTerm("")}
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                bg="transparent"
                _hover={{ bg: "gray.200" }}
              >
                ✕
              </Button>
            )}
          </InputGroup>
          <InputGroup width="200px">
            <select
              value={selectedSkill}
              onChange={handleSkillChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                fontSize: "16px",
              }}
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
            </select>
          </InputGroup>
        </Box>
      </Box>
      {error && (
        <Box textAlign="center" mt={2} color="red.500">
          <Text>{error}</Text>
        </Box>
      )}
      {isLoading ? (
        <Box textAlign="center" mt={4}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={2} fontSize="lg">
            Loading...
          </Text>
        </Box>
      ) : (
        <Tabs variant="enclosed" index={["all", "regular", "ironman", "ultimate", "group", "hardcore"].indexOf(tabKey)} onChange={i => setTabKey(["all", "regular", "ironman", "ultimate", "group", "hardcore"][i])}>
          <TabList>
            <Tab>All</Tab>
            <Tab>Mains</Tab>
            <Tab>Irons</Tab>
            <Tab>Ultimates</Tab>
            <Tab>Groups</Tab>
            <Tab>Hardcores</Tab>
          </TabList>
          <TabPanels>
            {["all", "regular", "ironman", "ultimate", "group", "hardcore"].map((type) => (
              <TabPanel key={type}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th textAlign="center" px="12px" width="30px"></Th>
                      <Th textAlign="center" px="12px" width="40px"></Th>
                      <Th textAlign="left" px="12px" onClick={() => handleSort("displayName")} cursor="pointer">
                        Gamer {sortConfig.key === "displayName" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                      </Th>
                      {selectedSkill === "clues" ? (
                        <>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_all")} cursor="pointer">
                            Total {sortConfig.key === "clue_scrolls_all" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_beginner")} cursor="pointer">
                            Beginner {sortConfig.key === "clue_scrolls_beginner" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_easy")} cursor="pointer">
                            Easy {sortConfig.key === "clue_scrolls_easy" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_medium")} cursor="pointer">
                            Medium {sortConfig.key === "clue_scrolls_medium" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_hard")} cursor="pointer">
                            Hard {sortConfig.key === "clue_scrolls_hard" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_elite")} cursor="pointer">
                            Elite {sortConfig.key === "clue_scrolls_elite" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("clue_scrolls_master")} cursor="pointer">
                            Master {sortConfig.key === "clue_scrolls_master" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("mimic")} cursor="pointer">
                            Mimic {sortConfig.key === "mimic" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("rank")} cursor="pointer">
                            Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                        </>
                      ) : bosses.includes(selectedSkill) || raids.includes(selectedSkill) ? (
                        <>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("kills")} cursor="pointer">
                            Kills {sortConfig.key === "kills" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("rank")} cursor="pointer">
                            Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                        </>
                      ) : (
                        <>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("level")} cursor="pointer">
                            {selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1)} Level
                            {sortConfig.key === "level" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("experience")} cursor="pointer">
                            XP {sortConfig.key === "experience" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                          <Th textAlign="center" px="12px" onClick={() => handleSort("rank")} cursor="pointer">
                            Rank {sortConfig.key === "rank" && (sortConfig.direction === "asc" ? "↑" : sortConfig.direction === "desc" ? "↓" : "")}
                          </Th>
                        </>
                      )}
                      <Th textAlign="right" px="12px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getFilteredByType(type).map((member) => {
                      const displayType =
                        member.type === "regular" && prestigeGroupIrons.includes(member.displayName)
                          ? "prestigeGroup"
                          : member.type === "regular" && groupIrons.includes(member.displayName)
                          ? "group"
                          : member.type;
                      return (
                        <Tr key={member.playerId} sx={{ "& > td": { padding: "6px 12px" } }}>
                          <Td textAlign="center" px="12px" width="30px">
                            {member.role && roleToImage[member.role] ? (
                              <Image src={roleToImage[member.role]} alt={member.role} boxSize="24px" />
                            ) : (
                              member.role
                            )}
                          </Td>
                          <Td textAlign="center" px="12px" width="40px">
                            {displayType && typeToImage[displayType] && (
                              <Image src={typeToImage[displayType]} alt={displayType} boxSize="24px" />
                            )}
                          </Td>
                          <Td textAlign="left" px="12px">{member.displayName}</Td>
                          {selectedSkill === "clues" ? (
                            <>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_all ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_beginner ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_easy ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_medium ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_hard ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_elite ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.clue_scrolls_master ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.mimic ?? "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.rank === -1 ? "N/A" : member.rank}</Td>
                            </>
                          ) : bosses.includes(selectedSkill) || raids.includes(selectedSkill) ? (
                            <>
                              <Td textAlign="center" px="12px">{member.kills === -1 ? "N/A" : member.kills}</Td>
                              <Td textAlign="center" px="12px">{member.rank === -1 ? "N/A" : member.rank}</Td>
                            </>
                          ) : (
                            <>
                              <Td textAlign="center" px="12px">{member.level === -1 ? "N/A" : member.level}</Td>
                              <Td textAlign="center" px="12px">{member.experience && member.experience !== "N/A" ? Number(member.experience).toLocaleString() : "N/A"}</Td>
                              <Td textAlign="center" px="12px">{member.rank === -1 ? "N/A" : member.rank}</Td>
                            </>
                          )}
                          <Td textAlign="right" px="12px">
                            <Button
                              onClick={() => handleViewStats(member.displayName)}
                              colorScheme="blue"
                              size="sm"
                            >
                              <Text display={{ base: "none", md: "inline" }} mt={4}>
                                View Stats
                              </Text>
                              <Text display={{ base: "inline", md: "none" }} mt={4}>
                                Stats
                              </Text>
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {type === "group" && (
                  <Text mt={4} fontSize="sm" color="gray.600">
                    If you're not listed as a group ironman in the Groups tab, message ThePrestiege on Discord to have it updated. Wise Old Man does not support group ironman type in its API.
                  </Text>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default MyClan;