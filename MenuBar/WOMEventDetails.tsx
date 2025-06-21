import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  HStack,
  Spacer,
} from "@chakra-ui/react";

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
  const [competitionDetails, setCompetitionDetails] =
    useState<CompetitionDetails | null>(null);
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
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
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
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading competition details...</Text>
      </Box>
    );
  }

  if (!competitionDetails) {
    return (
      <Box textAlign="center" mt={8}>
        <Text fontSize="lg" color="red.500">
          Failed to load competition details.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack pb={4} alignItems="flex-start">
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Text as="h2" fontSize="2xl">
              {competitionDetails.title}
            </Text>
          </Box>
          <Text mb={2}>
            <strong>Start Date:</strong>{" "}
            {new Date(competitionDetails.startsAt).toLocaleString()}
          </Text>
          <Text mb={2}>
            <strong>End Date:</strong>{" "}
            {new Date(competitionDetails.endsAt).toLocaleString()}
          </Text>
        </Box>
        <Spacer />
        <Box
          textAlign="center"
          bg="gray.800"
          color="white"
          w="300px"
          p={4}
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize="md" mb={2}>
            {new Date() < new Date(competitionDetails.startsAt)
              ? "Time Until Start"
              : "Time Remaining"}
          </Text>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                {timeRemaining.days}
              </Text>
              <Text fontSize="sm">days</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                {timeRemaining.hours}
              </Text>
              <Text fontSize="sm">hours</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                {timeRemaining.minutes}
              </Text>
              <Text fontSize="sm">mins</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                {timeRemaining.seconds}
              </Text>
              <Text fontSize="sm">secs</Text>
            </Box>
          </Box>
        </Box>
      </HStack>
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Gamer</Th>
            <Th textAlign="right">XP Gained</Th>
            <Th textAlign="right">Starting XP</Th>
            <Th textAlign="right">Ending XP</Th>
          </Tr>
        </Thead>
        <Tbody>
          {competitionDetails.participants
            .filter((participant) => participant.gained > 0)
            .map((participant) => (
              <Tr key={participant.displayName}>
                <Td>{participant.displayName}</Td>
                <Td textAlign="right">{participant.gained.toLocaleString()}</Td>
                <Td textAlign="right">
                  {participant.start?.toLocaleString() || "N/A"}
                </Td>
                <Td textAlign="right">
                  {participant.end?.toLocaleString() || "N/A"}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default WOMEventDetails;
