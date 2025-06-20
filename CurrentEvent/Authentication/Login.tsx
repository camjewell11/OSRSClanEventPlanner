import { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export interface User {
  username: string;
  isAdmin: boolean;
}

interface LoginProps {
  setUser: (user: User | null) => void;
}

const Login = ({ setUser }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10}>
      <Text fontSize="2xl" mb={4}>
        Login
      </Text>
      <Input
        placeholder="Username"
        mb={2}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Password"
        mb={2}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleLogin} w="full">
        Login
      </Button>
      {error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
      <Button variant="link" mt={2} onClick={() => navigate("/create-account")}>
        Create Account
      </Button>
    </Box>
  );
};

export default Login;
