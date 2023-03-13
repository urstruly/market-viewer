import React from "react";
import { Typography } from "@mui/material";
import { InstrumentGrid } from "./components/InstrumentGrid";

import "./App.css";

function App() {
  return (
    <div className="App">
      <title>Deribit Market Viewer</title>
      <link rel="icon" href="/favicon.ico" />

      <main>
        <Typography variant="h3">Welcome to Deribit Market Viewer!</Typography>
        <InstrumentGrid />
      </main>
    </div>
  );
}

export default App;
