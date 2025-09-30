import { useState } from "react";
import { TextField, Button, Container, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { saveUserId } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (data.success) {
      saveUserId(data.data.id);
      navigate("/prompt");
    } else {
      alert(data.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Typography>
    </Container>
  );
}
