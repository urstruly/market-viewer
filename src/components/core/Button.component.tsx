import React from "react";
import { Button as MuiButton } from "@mui/material";
import classNames from "classnames";

import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  primary?: boolean;
};

export function Button(props: ButtonProps): JSX.Element {
  const { children, className, icon, onClick, primary } = props;

  return (
    <MuiButton
      className={classNames("button", className)}
      onClick={onClick}
      startIcon={icon}
      variant={primary ? "contained" : "outlined"}
    >
      {children}
    </MuiButton>
  );
}
