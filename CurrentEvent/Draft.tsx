import React, { useState } from "react";
import { Box, Flex, Input, VStack, Text } from "@chakra-ui/react";
import PlayerCard from "../PlayerCard";

const initialPlayers: Player[] = [
  { id: "1", username: "test", level: 2277, account_type: "MAIN", ca_score: 2525, hours: "40 - 50", timezone: "EST", notes: "test" },
  { id: "2", username: "ThePrestiege", level: 2173, account_type: "MAIN", ca_score: 1122, hours: "40", timezone: "CST", notes: "A true gamer" },
  { id: "3", username: "Maverick1184", level: 1916, account_type: "MAIN", ca_score: 850, hours: "25", timezone: "CST", notes: "A true gamer" },
];

type Player = {
  id: string;
  username: string;
  level: number;
  account_type: string;
  ca_score: number;
  hours: string;
  timezone: string;
  notes: string;
};

const Draft: React.FC = () => {
  const [search, setSearch] = useState("");
  const [players] = useState(initialPlayers);

  // Filter players by search
  const filteredPlayers = players.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Flex h="100vh" w="100vw">
    {/* Draft Order Pane */}
        <Box
            w={["100%", "25%"]}
            maxW="200px"
            minW="120px"
            bg="gray.100"
            borderRadius="md"
            p={4}
            flexShrink={0}
        >
            <Text fontWeight="bold" mb={2}>Draft Order</Text>
            <VStack align="stretch" spacing={2}>
            <Text color="gray.500">Coming soon...</Text>
            </VStack>
        </Box>

      {/* Available Players */}
      <Flex
        flex="1"
        direction="column"
        align="center"
        minW={0}
      >
        {/* Search Bar */}
        <Input
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="400px"
          mb={4}
          mt={2}
        />
        <VStack
          align="stretch"
          spacing={4}
          w="75vw"
          maxH="80vh"
          overflowY="auto"
          bg="gray.50"
          borderRadius="md"
          p={3}
        >
          <Text fontWeight="bold" mb={2}>Available Players</Text>
          {filteredPlayers.map((player) => (
            <Box key={player.id}>
              <PlayerCard {...player} />
            </Box>
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Draft;