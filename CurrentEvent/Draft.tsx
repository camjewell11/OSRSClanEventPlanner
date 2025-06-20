import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  VStack,
  Text,
  SimpleGrid,
  Button,
  HStack,
} from "@chakra-ui/react";
import DraftPlayerCard from "./DraftPlayerCard";
import PlayerCard, { type PlayerCardProps } from "../PlayerCard";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import { initialPlayers } from "../test/sampleDraft";

const samplePlayers = initialPlayers;
const Draft: React.FC = () => {
  const [search, setSearch] = useState("");
  const [players] = useState(samplePlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCardProps | null>(null);

  const [sortBy, setSortBy] = useState<"ca_score" | "level" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter players by search
  const filteredPlayers = players
    .filter((p) =>
      p.username.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (sortOrder === "asc") return valA - valB;
      return valB - valA;
    });

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
        {/* Search Bar and Sort Buttons */}
        <HStack w="100%" maxW="800px" mb={4} mt={2} spacing={4} align="center">
          <Input
            placeholder="Search by username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="400px"
          />
          <Text fontWeight="semibold" color="gray.600" ml={2} mt={3}>
            Sort by:
          </Text>
          <Button
            size="sm"
            variant={sortBy === "ca_score" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => {
              if (sortBy === "ca_score") {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortBy("ca_score");
                setSortOrder("desc");
              }
            }}
            leftIcon={
              sortBy === "ca_score" ? (
                sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />
              ) : undefined
            }
          >
            CA Score
          </Button>
          <Button
            size="sm"
            variant={sortBy === "level" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => {
              if (sortBy === "level") {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortBy("level");
                setSortOrder("desc");
              }
            }}
            leftIcon={
              sortBy === "level" ? (
                sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />
              ) : undefined
            }
          >
            Total Level
          </Button>
        </HStack>
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
          <SimpleGrid
            minChildWidth="260px"
            spacing={4}
            w="100%"
          >
            {filteredPlayers.map((player) => (
              <Box
                key={player.id}
                onClick={() =>
                  selectedPlayer && selectedPlayer.id === player.id
                    ? setSelectedPlayer(null)
                    : setSelectedPlayer(player)
                }
                cursor="pointer"
                outline={
                  selectedPlayer && selectedPlayer.id === player.id
                    ? "3px solid #3182ce"
                    : "1px solid transparent"
                }
                bg="gray.100"
                borderRadius="md"
                boxShadow="none"
                transition="border 0.2s"
                w="100%"
                boxSizing="border-box"
                p={1}
              >
                <DraftPlayerCard {...player} />
              </Box>
            ))}
          </SimpleGrid>
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
          mt="75px"
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
          <Button
            mt={4}
            colorScheme="blue"
            width="100%"
            onClick={() => alert("Drafting player...")}
          >
            Draft Player
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default Draft;
