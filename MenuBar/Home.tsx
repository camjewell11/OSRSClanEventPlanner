import { Flex } from "@chakra-ui/react";
import PlayerCard from "../PlayerCard"

export default function Home() {
  return (
    <Flex
      direction="row"
      flexWrap="wrap"
      gap={4}
      py={2}
      px={2}
      width="100%"
      maxH="80vh"
      overflowY="auto"
      alignItems="flex-start"
    >
      <PlayerCard
        level={2277}
        account_type={"MAIN"}
        username={"test"}
        ca_score={2525}
        hours={"40 - 50"}
        timezone={"EST"}
        has_shadow={true}
        notes="test"
      />
      <PlayerCard
        level={2173}
        account_type={"MAIN"}
        username={"ThePrestiege"}
        ca_score={1122}
        hours={"40"}
        timezone={"CST"}
        has_shadow={true}
        notes="A true gamer if there ever was one"
      />
      <PlayerCard
        level={1916}
        account_type={"MAIN"}
        username={"Maverick1184"}
        ca_score={850}
        hours={"25"}
        timezone={"CST"}
        has_shadow={true}
        has_tbow={true}
        has_quiver={true}
        has_infernal={true}
        notes="Shadow spooner"
      />
    </Flex>
  );
}