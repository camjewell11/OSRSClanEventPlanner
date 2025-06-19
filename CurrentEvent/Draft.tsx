import React, { useState } from "react";
import { Box, Flex, Input, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import DraftPlayerCard from "./DraftPlayerCard";
import PlayerCard from "../PlayerCard";

const initialPlayers: Player[] = [
  {
    id: "1",
    username: "test",
    level: 2277,
    account_type: "MAIN",
    ca_score: 2525,
    hours: "40 - 50",
    timezone: "EST",
    notes: "test",
    has_shadow: true,
    has_tbow: true,
    has_scythe: true,
    has_quiver: true,
    has_infernal: true,
  },
  {
    id: "2",
    username: "ThePrestiege",
    level: 2173,
    account_type: "MAIN",
    ca_score: 1122,
    hours: "40",
    timezone: "CST",
    notes: "A true gamer",
    has_shadow: true,
    has_tbow: false,
    has_scythe: false,
    has_quiver: false,
    has_infernal: false,
  },
  {
    id: "3",
    username: "Maverick1184",
    level: 1916,
    account_type: "MAIN",
    ca_score: 850,
    hours: "25",
    timezone: "CST",
    notes: "A true gamer",
    has_shadow: true,
    has_tbow: true,
    has_scythe: false,
    has_quiver: true,
    has_infernal: true,
  },
  {
    id: "4",
    username: "test",
    level: 2277,
    account_type: "MAIN",
    ca_score: 2525,
    hours: "40 - 50",
    timezone: "EST",
    notes: "test",
    has_shadow: true,
    has_tbow: true,
    has_scythe: true,
    has_quiver: true,
    has_infernal: true,
  },
  {
    id: "5",
    username: "ThePrestiege",
    level: 2173,
    account_type: "MAIN",
    ca_score: 1122,
    hours: "40",
    timezone: "CST",
    notes: "A true gamer",
    has_shadow: true,
    has_tbow: false,
    has_scythe: false,
    has_quiver: false,
    has_infernal: false,
  },
  {
    id: "6",
    username: "Maverick1184",
    level: 1916,
    account_type: "MAIN",
    ca_score: 850,
    hours: "25",
    timezone: "CST",
    notes: "A true gamer",
    has_shadow: true,
    has_tbow: true,
    has_scythe: false,
    has_quiver: true,
    has_infernal: true,
  },
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
  has_shadow?: boolean;
  has_tbow?: boolean;
  has_scythe?: boolean;
  has_quiver?: boolean;
  has_infernal?: boolean;
};

const Draft: React.FC = () => {
  const [search, setSearch] = useState("");
  const [players] = useState(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Filter players by search
  const filteredPlayers = players.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Flex h="89vh" w="100vw">
      {/* Draft Order Pane */}
      <Box flex="0 0 15%" bg="gray.100" borderRadius={"md"} p={4} ml="10px">
        <Text fontWeight="bold" mb={2}>
          Draft Order
        </Text>
        <VStack align="stretch" spacing={2}>
          <Text color="gray.500">Coming soon...</Text>
        </VStack>
      </Box>

      {/* Available Players */}
      <Flex
        flex="1 1 85%"
        direction="column"
        align="flex-start"
        minW={0}
        pl={4}
        mr="10px"
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
          w="100%"
          h="89vh"
          overflowY="auto"
          overflowX="hidden"
          bg="gray.100"
          borderRadius="md"
          p={3}
        >
          <Text fontWeight="bold" mb={2}>
            Available Players
          </Text>
          // ...existing code...
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} w="100%">
            {filteredPlayers.map((player) => (
              <Box
                key={player.id}
                onClick={() =>
                  selectedPlayer && selectedPlayer.id === player.id
                    ? setSelectedPlayer(null)
                    : setSelectedPlayer(player)
                }
                cursor="pointer"
                border={
                  selectedPlayer && selectedPlayer.id === player.id
                    ? "3px solid #3182ce"
                    : "1px solid transparent"
                }
                borderRadius="md"
              >
                <DraftPlayerCard {...player} />
              </Box>
            ))}
          </SimpleGrid>
          // ...existing code...
        </VStack>
      </Flex>

      {/* Selected Player Details */}
      {selectedPlayer && (
        <Box
          flex="0 0 15%"
          minW="320px"
          maxW="400px"
          bg="gray.100"
          borderRadius="md"
          p={4}
          ml={2}
          h="89vh"
          alignSelf="flex-start"
          mr="10px"
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box
            alignSelf="flex-end"
            cursor="pointer"
            fontWeight="bold"
            fontSize="3xl"
            color="gray.500"
            _hover={{ color: "red.500" }}
            onClick={() => setSelectedPlayer(null)}
            zIndex={1}
            lineHeight="1"
            mb={2}
            mt={-2}
            pr={1}
          >
            ×
          </Box>
          <PlayerCard {...selectedPlayer} />
        </Box>
      )}
    </Flex>
  );
};

export default Draft;
