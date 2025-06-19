import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Text,
} from "@chakra-ui/react";
import {
  raids,
  wildernessBosses,
  slayerOnlyMonsters,
  multiCombatBosses,
  hardModeRaids,
  memberSkills,
  clueScrollColors,
} from "../Information";

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
        const raidsObj = raids.reduce((acc: any, raid: string) => {
          if (latestData.bosses[raid]) acc[raid] = latestData.bosses[raid];
          return acc;
        }, {});
        const activities = latestData.activities;

        setOsrsDetails({ skills, bosses, clues, raids: raidsObj, activities });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (username) fetchOsrsDetails();
  }, [username]);

  if (loading)
    return (
      <Flex p={4} align="center">
        <Spinner mr={2} /> Loading...
      </Flex>
    );
  if (error)
    return (
      <Alert status="error" p={4}>
        <AlertIcon />
        Error: {error}
      </Alert>
    );

  return (
    <Box p={{ base: 2, md: 6 }}>
      <Text as="h2" fontSize="2xl" mb={4}>
        Statistics for {username}
      </Text>
      {osrsDetails && (
        <Tabs variant="enclosed" colorScheme="blue" isFitted>
          <TabList>
            <Tab>Skills</Tab>
            <Tab>Clues</Tab>
            <Tab>Bosses</Tab>
            <Tab>Raids</Tab>
            <Tab>Minigames</Tab>
          </TabList>
          <TabPanels>
            {/* Skills */}
            <TabPanel>
              <Table variant="striped" size="sm" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Skill</Th>
                    <Th>Level</Th>
                    <Th>XP</Th>
                    <Th>Rank</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(osrsDetails.skills)
                    .filter((skill) => skill !== "overall")
                    .map((skill) => (
                      <Tr key={skill}>
                        <Td
                          color={
                            memberSkills.includes(skill)
                              ? "blue.500"
                              : undefined
                          }
                        >
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </Td>
                        <Td>{osrsDetails.skills[skill].level}</Td>
                        <Td>
                          {osrsDetails.skills[
                            skill
                          ].experience.toLocaleString()}
                        </Td>
                        <Td>{osrsDetails.skills[skill].rank}</Td>
                      </Tr>
                    ))}
                  <Tr fontWeight="bold">
                    <Td>Total</Td>
                    <Td>{osrsDetails.skills.overall.level}</Td>
                    <Td>
                      {osrsDetails.skills.overall.experience.toLocaleString()}
                    </Td>
                    <Td />
                  </Tr>
                </Tbody>
              </Table>
            </TabPanel>
            {/* Clues */}
            <TabPanel>
              <Table variant="striped" size="sm" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Clue</Th>
                    <Th>Total</Th>
                    <Th>Rank</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(osrsDetails.clues)
                    .filter((clue: string) => clue !== "clue_scrolls_all")
                    .map((clue: string) => (
                      <Tr key={clue}>
                        <Td color={clueScrollColors[clue] || undefined}>
                          {clue
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Td>
                        <Td>
                          {osrsDetails.clues[clue].score === -1
                            ? "N/A"
                            : osrsDetails.clues[clue].score}
                        </Td>
                        <Td>
                          {osrsDetails.clues[clue].rank === -1
                            ? "N/A"
                            : osrsDetails.clues[clue].rank}
                        </Td>
                      </Tr>
                    ))}
                  <Tr fontWeight="bold">
                    <Td>Total</Td>
                    <Td>
                      {osrsDetails.clues.clue_scrolls_all.score === -1
                        ? "N/A"
                        : osrsDetails.clues.clue_scrolls_all.score}
                    </Td>
                    <Td>
                      {osrsDetails.clues.clue_scrolls_all.rank === -1
                        ? "N/A"
                        : osrsDetails.clues.clue_scrolls_all.rank}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TabPanel>
            {/* Bosses */}
            <TabPanel>
              <Table variant="striped" size="sm" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Boss</Th>
                    <Th>Kills</Th>
                    <Th>Rank</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(osrsDetails.bosses).map((boss: string) => (
                    <Tr key={boss}>
                      <Td
                        color={
                          wildernessBosses.includes(boss)
                            ? "red.500"
                            : multiCombatBosses.includes(boss)
                              ? "green.500"
                              : slayerOnlyMonsters.includes(boss)
                                ? "blue.500"
                                : undefined
                        }
                      >
                        {boss
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Td>
                      <Td>
                        {osrsDetails.bosses[boss].kills === -1
                          ? "N/A"
                          : osrsDetails.bosses[boss].kills}
                      </Td>
                      <Td>
                        {osrsDetails.bosses[boss].rank === -1
                          ? "N/A"
                          : osrsDetails.bosses[boss].rank}
                      </Td>
                    </Tr>
                  ))}
                  <Tr fontWeight="bold">
                    <Td>Total</Td>
                    <Td>
                      {Object.values(osrsDetails.bosses).reduce(
                        (total: number, boss: any) =>
                          boss.kills !== -1 ? total + boss.kills : total,
                        0
                      )}
                    </Td>
                    <Td />
                  </Tr>
                </Tbody>
              </Table>
            </TabPanel>
            {/* Raids */}
            <TabPanel>
              <Table variant="striped" size="sm" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Raid</Th>
                    <Th>Completions</Th>
                    <Th>Rank</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(osrsDetails.raids).map((raid: string) => (
                    <Tr key={raid}>
                      <Td
                        color={
                          hardModeRaids.includes(raid) ? "red.500" : undefined
                        }
                      >
                        {raid
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Td>
                      <Td>
                        {osrsDetails.raids[raid].kills === -1
                          ? "N/A"
                          : osrsDetails.raids[raid].kills}
                      </Td>
                      <Td>
                        {osrsDetails.raids[raid].rank === -1
                          ? "N/A"
                          : osrsDetails.raids[raid].rank}
                      </Td>
                    </Tr>
                  ))}
                  <Tr fontWeight="bold">
                    <Td>Total</Td>
                    <Td>
                      {Object.values(osrsDetails.raids).reduce(
                        (total: number, raid: any) =>
                          raid.kills !== -1 ? total + raid.kills : total,
                        0
                      )}
                    </Td>
                    <Td />
                  </Tr>
                </Tbody>
              </Table>
            </TabPanel>
            {/* Minigames */}
            <TabPanel>
              <Table variant="striped" size="sm" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Activity</Th>
                    <Th>Score</Th>
                    <Th>Rank</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(osrsDetails.activities)
                    .filter(
                      (activity: string) => !activity.startsWith("clue_scrolls")
                    )
                    .map((activity: string) => (
                      <Tr key={activity}>
                        <Td>
                          {activity
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Td>
                        <Td>
                          {osrsDetails.activities[activity]?.score === -1
                            ? "N/A"
                            : osrsDetails.activities[activity]?.score}
                        </Td>
                        <Td>
                          {osrsDetails.activities[activity]?.rank === -1
                            ? "N/A"
                            : osrsDetails.activities[activity]?.rank}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default Statistics;
