import { useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Card,
  CardContent,
  Grid,
  Button
} from "@mui/material";

export default function Results() {
  const result = JSON.parse(localStorage.getItem("latestResult"));
  const [tabIndex, setTabIndex] = useState(0);

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h5" color="error">
           No result found. Please generate first.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* App Title */}
      <Typography variant="h3" gutterBottom>
        {result.app_name}
      </Typography>

      {/* High-level details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography><strong>Entities:</strong> {result.entities?.join(", ")}</Typography>
          <Typography><strong>Roles:</strong> {result.roles?.join(", ")}</Typography>
          <Typography><strong>Features:</strong> {result.features?.join(", ")}</Typography>
        </CardContent>
      </Card>

      {/* Menu Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {result.menu_options?.map((menu, idx) => (
            <Tab key={idx} label={menu} />
          ))}
        </Tabs>
      </Box>

      {/* Dynamic Forms for Each Entity */}
      <Box sx={{ mt: 4 }}>
        {Object.entries(result.forms || {}).map(([entity, fields], idx) => (
          tabIndex === idx && (
            <Card key={entity} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {entity} Form
                </Typography>

                <Grid container spacing={2}>
                  {Object.entries(fields).map(([fieldName, fieldType]) => (
                    <Grid item xs={12} sm={6} key={fieldName}>
                      <TextField
                        fullWidth
                        label={fieldName}
                        type={fieldType === "number" ? "number" : "text"}
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )
        ))}
      </Box>
     <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
  {/*  Button 1: Regenerate current result */}
  <Button
    variant="contained"
    color="secondary"
    onClick={() => window.location.reload()}
  >
    Regenerate App
  </Button>

  {/*  Button 2: Go back to prompt page */}
  <Button
    variant="outlined"
    color="primary"
    onClick={() => (window.location.href = "/prompt")}
  >
     New Prompt
  </Button>
</Box>



    </Container>
  );
}
