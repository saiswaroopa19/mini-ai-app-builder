import { useState } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  CircularProgress 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/auth";

export default function PromptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt before generating.");
      return;
    }

    setLoading(true);
    try {
      const user_id = getUserId();
      const res = await fetch("http://localhost:8080/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id }),
        credentials: "include", // ✅ ensures JWT cookie is sent
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("[✅ Response from server]:", data);

      if (data.success) {
        // store result for Results page
        localStorage.setItem("latestResult", JSON.stringify(data.data));
        navigate("/results");
      } else {
        alert(data.message || "Something went wrong while generating the app.");
      }
    } catch (err) {
      console.error("[❌ Error in handleGenerate]:", err);
      alert("Server not responding or invalid response. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        🚀 Generate App Requirements
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        label="Describe your app idea..."
        placeholder='e.g., "I want an app to manage student courses and grades..."'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mt: 4 }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Generate App"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/results")}
        >
          View Last Result
        </Button>
      </Stack>
    </Container>
  );
}
