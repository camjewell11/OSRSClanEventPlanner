import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  Spacer,
  Switch,
  Link,
  Button,
} from "@chakra-ui/react";
import "../global.css";
import type { User } from "../CurrentEvent/Authentication/Login";
import { dummyUser } from "../test/sampleLogin";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "My Profile", to: "/my-profile" },
  { name: "My Clan", to: "/my-clan" },
  { name: "WOM Events", to: "/wom-events" },
  { name: "Current Event", to: "/current-event" },
  { name: "Event Management", to: "/event-management" },
  { name: "Admin", to: "/admin" },
];

interface MenuBarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ user, setUser }) => {
  const [streamerMode, setStreamerMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Box
      as="nav"
      bg="blue.700"
      color="white"
      mb={3}
      px={2}
      py={5}
      boxShadow="md"
      w="100%"
      h="75px"
    >
      <Flex align="center" justify="space-between">
        <Text
          as={RouterLink}
          to="/"
          fontWeight="bold"
          fontSize="lg"
          mx={6}
          whiteSpace="nowrap"
          mt="-17px"
        >
          OSRS Clan Planner
        </Text>
        <HStack as="ul" spacing={2} align="center">
          {navLinks
            .filter((link) => link.name !== "Admin" || (user && user.isAdmin))
            .map((link) => (
              <Box
                as="li"
                key={link.name}
                listStyleType="none"
                px={2}
                py={1}
                borderRadius="md"
                transition="background 0.2s"
                whiteSpace="nowrap"
              >
                <Link
                  as={RouterLink}
                  to={link.to}
                  fontWeight="medium"
                  whiteSpace="nowrap"
                  color={"white"}
                  _hover={{
                    color: "blue.200",
                    textDecoration: "underline !important",
                  }}
                >
                  {link.name}
                </Link>
              </Box>
            ))}
          {!user ? (
            <>
              <Button
                colorScheme="teal"
                variant="outline"
                size="sm"
                ml={2}
                onClick={() => navigate("/login")}
              >
                Login / Sign Up
              </Button>
              <Button
                colorScheme="yellow"
                variant="outline"
                size="sm"
                ml={2}
                onClick={() => setUser(dummyUser)}
              >
                Dummy Login
              </Button>
            </>
          ) : (
            <HStack>
              <Text fontSize="sm" mx={2}>
                {user.username}
              </Text>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          )}
        </HStack>
        <Spacer />
        <Flex align="center" mx={4} mt="-12px">
          <Switch
            id="streamerModeSwitch"
            colorScheme="teal"
            isChecked={streamerMode}
            onChange={() => setStreamerMode((v) => !v)}
            mr={2}
          />
          <Text fontSize="sm" whiteSpace="nowrap" mt="13px">
            Streamer Mode
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default MenuBar;
