import React from "react";
import {
  Box,
  Flex,
  Badge,
  Image,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { stopwatch, defaultImage, type_unknown, ca_easy } from "./imageImports";
import { accountTypes, caIcons, achievementIcons } from "./Information";

interface PlayerCardProps {
  level: number;
  account_type: string;
  ca_score: number;
  username: string;
  timezone: string;
  hours: string;
  notes: string;
  has_shadow?: boolean;
  has_tbow?: boolean;
  has_scythe?: boolean;
  has_quiver?: boolean;
  has_infernal?: boolean;
  inDraft?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  level,
  account_type,
  ca_score,
  username,
  timezone,
  hours,
  notes,
  has_shadow = false,
  has_tbow = false,
  has_scythe = false,
  has_quiver = false,
  has_infernal = false,
  inDraft = false,
}) => {
  let account_type_ico = type_unknown;
  if (accountTypes.has(account_type)) {
    account_type_ico = accountTypes.get(account_type);
  }

  let ca_icon = ca_easy;
  for (const [minPoints, ico] of caIcons) {
    if (ca_score >= minPoints) {
      ca_icon = ico;
      break;
    }
  }

  const activeAchievements = achievementIcons.filter((icon) => {
    switch (icon.prop) {
      case "has_quiver":
        return has_quiver;
      case "has_infernal":
        return has_infernal;
      case "has_scythe":
        return has_scythe;
      case "has_shadow":
        return has_shadow;
      case "has_tbow":
        return has_tbow;
      default:
        return false;
    }
  });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      w="300px"
      boxShadow="md"
      flexShrink={0}
    >
      <Flex align="center" bg="gray.100" borderTopRadius="lg">
        <VStack spacing={-5} ml={4}>
          <Text color="gray.600" lineHeight="1.1">
            Total:
          </Text>
          <Badge
            bg="green"
            color="white"
            borderRadius="full"
            px={3}
            minH="25px"
            alignItems="center"
            justifyContent="center"
            display="flex"
            mt="-10px"
          >
            {level}
          </Badge>
        </VStack>
        <Flex flex="1" mx={4} mt={4} align="center">
          <Text
            fontWeight="bold"
            fontSize="xl"
            color="white"
            bg="gray.700"
            borderRadius="md"
            px={3}
            py={1}
            w="100%"
            minH="50px"
            alignContent={"center"}
            textAlign={"center"}
          >
            {username}
          </Text>
        </Flex>
      </Flex>

      {!inDraft ? (
        <Flex justify="center" align="center" p={3}>
          <Image src={defaultImage} maxW="280px" borderRadius="md" />
        </Flex>
      ) : (
        <Box mt={3} />
      )}

      <HStack mr="10px" mb="10px">
        <VStack width="60px">
          <Image src={stopwatch} maxW="40px" />
        </VStack>
        <VStack width="120px" mr="10px">
          <Badge
            bg="blue.500"
            color="white"
            fontSize="md"
            borderRadius="md"
            w="full"
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
            minH="40px"
          >
            {timezone}
          </Badge>
          <Badge
            bg="gray.600"
            color="white"
            fontSize="md"
            borderRadius="md"
            w="full"
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
            minH="40px"
          >
            {hours} hrs
          </Badge>
        </VStack>
        <VStack maxW="90px">
          <HStack
            alignContent={"center"}
            justifyContent={"center"}
            display={"flex"}
            textAlign={"center"}
          >
            <Image src={ca_icon} w="40px" h="40px" />
            <Badge
              bg={"transparent"}
              textAlign={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              fontWeight="bold"
              fontSize="md"
            >
              {ca_score}
            </Badge>
          </HStack>
          <HStack
            alignContent={"center"}
            justifyContent={"center"}
            display={"flex"}
            textAlign={"center"}
          >
            <Image src={account_type_ico} maxW="40px" />
            <Badge bg={"transparent"} fontWeight="bold" fontSize="md">
              {account_type}
            </Badge>
          </HStack>
        </VStack>
      </HStack>

      {activeAchievements.length > 0 && (
        <Flex p={3} justify="left" align="center">
          <HStack>
            {activeAchievements.map((icon) => (
              <Image key={icon.prop} src={icon.img} maxW="40px" maxH="40px" />
            ))}
          </HStack>
        </Flex>
      )}

      {!inDraft && (
        <Box p={3} borderBottomRadius="lg" bg="gray.50">
          <Text fontSize="sm" color="gray.700">
            {notes}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default PlayerCard;
