import { useState } from "react";
import { TextField, Button, Container, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch("http://localhost:8080/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (data.success) {
      alert("Signup successful! Please login.");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <TextField fullWidth margin="normal" label="Name" value={name} onChange={e => setName(e.target.value)} />
      <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleSignup} sx={{ mt: 2 }}>Sign Up</Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link href="/">Login</Link>
      </Typography>
    </Container>
  );
}
