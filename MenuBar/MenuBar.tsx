import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Spacer,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Switch,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "My Profile", to: "/my-profile" },
  { name: "My Clan", to: "/my-clan" },
  { name: "WOM Events", to: "/wom-events" },
  { name: "Current Event", to: "/current-event" },
  { name: "Event Management", to: "/event-management" },
  { name: "Admin", to: "/admin" },
];

const MenuBar: React.FC = () => {
  const [streamerMode, setStreamerMode] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="nav" bg="blue.700" color="white" mb={3} px={2} py={5} boxShadow="md" w="100%" h="75px">
      <Flex align="center" justify="space-between">
        {/* Mobile Hamburger */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: "inline-flex", md: "none" }}
          onClick={onOpen}
          bg="blue.700"
          color="white"
          _hover={{ bg: "blue.600" }}
          mr={2}
        />
        {/* Brand */}
        <Text
          as={Link}
          to="/"
          fontWeight="bold"
          fontSize="lg"
          mx={6}
          _hover={{ textDecoration: "none", color: "blue.200" }}
          whiteSpace="nowrap"
          mt="-17px"
        >
          OSRS Clan Planner
        </Text>
        {/* Desktop Nav */}
        <HStack
          as="ul"
          spacing={2}
          display={{ base: "none", md: "flex" }}
          align="center"
        >
          {navLinks.map((link) => (
            <Box
              as="li"
              key={link.name}
              listStyleType="none"
              px={2}
              py={1}
              borderRadius="md"
              _hover={{ bg: "blue.600" }}
              transition="background 0.2s"
              whiteSpace="nowrap"
            >
              <Text
                as={Link}
                to={link.to}
                fontWeight="medium"
                color="white"
                _hover={{ color: "blue.100", textDecoration: "none" }}
                whiteSpace="nowrap"
              >
                {link.name}
              </Text>
            </Box>
          ))}
        </HStack>
        <Spacer />
        {/* Streamer Mode Switch */}
        <Flex align="center" ml={4} mt="-12px">
          <Switch
            id="streamerModeSwitch"
            colorScheme="teal"
            isChecked={streamerMode}
            onChange={() => setStreamerMode((v) => !v)}
            mr={2}
          />
          <Text fontSize="sm" whiteSpace="nowrap" mt="12px">
            Streamer Mode
          </Text>
        </Flex>
      </Flex>
      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blue.700" color="white">
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold">OSRS Clan Planner</Text>
              <IconButton
                aria-label="Close menu"
                icon={<CloseIcon />}
                onClick={onClose}
                bg="transparent"
                color="white"
                _hover={{ bg: "blue.600" }}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack as="ul" spacing={4} align="start" mt={4}>
              {navLinks.map((link) => (
                <Box
                  as="li"
                  key={link.name}
                  listStyleType="none"
                  w="full"
                  onClick={onClose}
                >
                  <Text
                    as={Link}
                    to={link.to}
                    fontWeight="medium"
                    color="white"
                    w="full"
                    display="block"
                    px={2}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: "blue.600", color: "blue.100", textDecoration: "none" }}
                  >
                    {link.name}
                  </Text>
                </Box>
              ))}
              <Flex align="center">
                <Switch
                  id="streamerModeSwitchMobile"
                  colorScheme="teal"
                  isChecked={streamerMode}
                  onChange={() => setStreamerMode((v) => !v)}
                  mr={2}
                />
                <Text fontSize="sm">
                  Streamer Mode
                </Text>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MenuBar;