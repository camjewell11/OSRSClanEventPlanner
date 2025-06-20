import { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Account created! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(data.message || "Account creation failed");
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10}>
      <Text fontSize="2xl" mb={4}>
        Create Account
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
      <Input
        placeholder="Confirm Password"
        mb={2}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button colorScheme="green" onClick={handleCreate} w="full">
        Create Account
      </Button>
      {error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
      {success && (
        <Text color="green.500" mt={2}>
          {success}
        </Text>
      )}
      <Button variant="link" mt={2} onClick={() => navigate("/login")}>
        Back to Login
      </Button>
    </Box>
  );
};

export default CreateAccount;
