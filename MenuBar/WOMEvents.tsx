import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await fetch("/api/wom/group/competitions/");
        const data = await res.json();
        if (data.success) {
          setCompetitions(data.competitions);
        } else {
          setError("Failed to load competitions.");
        }
      } catch (e) {
        setError("Error fetching competitions.");
        console.error("Error fetching competitions:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  const getRowBg = (comp: Competition) => {
    const now = new Date();
    const start = new Date(comp.startsAt);
    const end = new Date(comp.endsAt);

    if (now >= start && now <= end) {
      return "green.200";
    } else if (now > end) {
      return "red.200";
    } else {
      return undefined;
    }
  };

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="60vh"
        w="100%"
      >
        <Spinner size="xl" my={10} />
      </Flex>
    );
  }

  return (
    <Box
      w="100%"
      minH="80vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={{ base: 2, md: 0 }}
    >
      <Text
        as="h2"
        fontSize="2xl"
        fontWeight="bold"
        alignSelf="flex-start"
        ml={{ base: 0, md: "2.5vw" }}
        mb={4}
      >
        Clan Events
      </Text>
      {error && (
        <Alert status="error" mb={4} w="95vw" maxW="container.lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Box w="95vw" maxW="container.lg" overflowX="auto">
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Event Name</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {competitions.map((comp) => (
              <Tr key={comp.id} bg={getRowBg(comp)}>
                <Td>{comp.title}</Td>
                <Td>{new Date(comp.startsAt).toLocaleString()}</Td>
                <Td>{new Date(comp.endsAt).toLocaleString()}</Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => navigate(`/wom/event/${comp.id}`)}
                  >
                    View Event
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex flex="1" />
      <Box w="95vw" maxW="container.lg" my={6}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          You must have the WiseOldMan plugin installed in Runelite to track
          event statistics.
        </Alert>
      </Box>
    </Box>
  );
};

export default WOMEvents;
