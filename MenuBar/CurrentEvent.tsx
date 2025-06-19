import { Button, HStack, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function CurrentEvent() {
  return (
    <VStack spacing={6} align="start" p={6}>
      <h2>Current Event</h2>
      <HStack spacing={4}>
        <Button as={RouterLink} to="/draft" colorScheme="blue" variant="solid">
          Enter Draft
        </Button>
        <Button as={RouterLink} to="/teams" colorScheme="blue" variant="solid">
          Teams
        </Button>
        <Button as={RouterLink} to="/items" colorScheme="blue" variant="solid">
          Items
        </Button>
        <Button as={RouterLink} to="/card" colorScheme="blue" variant="solid">
          Card
        </Button>
      </HStack>
    </VStack>
  );
}
