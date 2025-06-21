import { Flex, Image, Text } from "@chakra-ui/react";
import { defaultImage } from "../imageImports";

interface CaptainCardProps {
  username: string;
}

const CaptainCard: React.FC<CaptainCardProps> = ({ username }) => (
  <Flex
    alignItems="center"
    h="50px"
    bg="white"
    borderRadius="md"
    boxShadow="sm"
    px={2}
    minW="0"
  >
    <Image src={defaultImage} boxSize="36px" borderRadius="full" mr={3} />
    <Text fontWeight="bold" isTruncated>
      {username}
    </Text>
  </Flex>
);

export default CaptainCard;