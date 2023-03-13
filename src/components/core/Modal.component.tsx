import React from "react";
import { IconButton, Modal as MuiModel } from "@mui/material";
import { Button } from "./Button.component";
import { CloseIcon } from "../icons";

import "./Modal.css";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
};

export function Modal(props: ModalProps): JSX.Element {
  const { children, open, onClose, onSave, title } = props;

  return (
    <MuiModel open={open} onClose={onClose}>
      <div className="modal-content">
        <div className="modal-header">
          {title}
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        {children}
        <div className="modal-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </MuiModel>
  );
}
