import { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { getUserId } from "../utils/auth";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
        const res = await fetch(`http://localhost:8080/prompts/history/${getUserId()}`, {
  method: "GET",
  credentials: "include", // ✅ this sends the cookie (JWT) with the request
  headers: {
    "Content-Type": "application/json"
  }
});

      const data = await res.json();
      if (data.success) setHistory(data.data);
    };
    fetchHistory();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Prompt History</Typography>
      <List>
        {history.map(item => (
          <ListItem key={item._id}>
            <ListItemText
              primary={item.app_name}
              secondary={`Prompt: ${item.prompt}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
