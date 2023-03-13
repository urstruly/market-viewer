import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const headerElement = screen.getByText(/Welcome to Deribit Market Viewer!/i);
  expect(headerElement).toBeInTheDocument();
});
