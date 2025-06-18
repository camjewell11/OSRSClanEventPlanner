import React from 'react';
import {
  Box,
  Flex,
  Badge,
  Image,
  Text,
  Stack,
  HStack,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import {
  stopwatch,
  defaultImage,
  ca_gm,
  ca_master,
  ca_elite,
  ca_hard,
  ca_med,
  ca_easy,
  achieve_quiver,
  achieve_cape,
  mega_bow,
  mega_staff,
  mega_scythe,
  type_unknown,
  type_main,
  type_iron,
  type_hcim,
  type_uim,
  type_gim,
  type_hcgim,
  type_ugim,
  type_snowflake
} from './imageImports';

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
}

const accountTypes = new Map<string, any>([
  ["MAIN", type_main],
  ["IRON", type_iron],
  ["HCIM", type_hcim],
  ["UIM", type_uim],
  ["GIM", type_gim],
  ["HCGIM", type_hcgim],
  ["UGIM", type_ugim],
  ["SNOWFLAKE", type_snowflake],
]);

const caIcons = new Map<number, any>([
  [2525, ca_gm],
  [1841, ca_master],
  [1026, ca_elite],
  [394, ca_hard],
  [148, ca_med],
]);

const achievementIcons = [
  { prop: "has_quiver", img: achieve_quiver },
  { prop: "has_infernal", img: achieve_cape },
  { prop: "has_scythe", img: mega_scythe },
  { prop: "has_shadow", img: mega_staff },
  { prop: "has_tbow", img: mega_bow },
];

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

  const activeAchievements = achievementIcons.filter(icon => {
    switch (icon.prop) {
      case "has_quiver": return has_quiver;
      case "has_infernal": return has_infernal;
      case "has_scythe": return has_scythe;
      case "has_shadow": return has_shadow;
      case "has_tbow": return has_tbow;
      default: return false;
    }
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" w="300px" boxShadow="md">
      <Flex align="center" bg="gray.100" borderTopRadius="lg">
        <VStack spacing={-5} ml={4}>
          <Text color="gray.600" lineHeight="1.1">Total:</Text>
          <Badge bg="green" color="white" borderRadius="full" px={3} minH="25px" alignItems="center" justifyContent="center" display="flex" mt="-10px">{level}</Badge>
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

      <Flex justify="center" align="center" p={3}>
        <Image src={defaultImage} maxW="280px" borderRadius="md" />
      </Flex>

      <HStack alignItems={"center"} justify="space-between">
        <VStack width="60px">
          <Image src={stopwatch} maxW="40px" />
        </VStack>
        <VStack width="120px">
          <Badge bg="blue.500" color="white" fontSize="md" borderRadius="md" w="full" alignItems={"center"} justifyContent={"center"} minH="40px">
            {timezone}
          </Badge>
          <Badge bg="gray.600" color="white" fontSize="md" borderRadius="md" w="full"  alignItems={"center"} justifyContent={"center"} minH="40px">
            {hours} hours
          </Badge>
        </VStack>
        <VStack maxW="80px">
           <HStack>
            <Image src={ca_icon} w="40px" h="40px" />
            <Text fontWeight="bold" fontSize="md">{ca_score}</Text>
          </HStack>
          <HStack>
            <Image src={account_type_ico} maxW="40px" />
            <Text fontSize="md">{account_type}</Text>
          </HStack>
        </VStack>
      </HStack>

      {activeAchievements.length > 0 && (
        <Flex p={3} justify="left" align="center">
          <HStack >
            {activeAchievements.map((icon) => (
              <Image key={icon.prop} src={icon.img} maxW="40px" maxH="40px"/>
            ))}
          </HStack>
        </Flex>
      )}

      <Box p={3} borderBottomRadius="lg" bg="gray.50">
        <Text fontSize="sm" color="gray.700">{notes}</Text>
      </Box>
    </Box>
  );
};

export default PlayerCard;