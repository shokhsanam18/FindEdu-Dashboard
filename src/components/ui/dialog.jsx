import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@shadcn/ui";

import { Button } from "@/components/ui/button"; // Assuming you're using your custom Button component

// A generic Dialog component for various use cases
export const ShadcnDialog = ({ children }) => {
  return <Dialog>{children}</Dialog>;
};

// Dialog Trigger that opens the dialog when clicked
export const ShadcnDialogTrigger = ({ children, ...props }) => (
  <DialogTrigger asChild>{children}</DialogTrigger>
);

// Dialog Content for displaying the main body of the dialog
export const ShadcnDialogContent = ({ children }) => {
  return <DialogContent>{children}</DialogContent>;
};

// Dialog Header for the title of the dialog
export const ShadcnDialogHeader = ({ children }) => {
  return <DialogHeader>{children}</DialogHeader>;
};

// Dialog Title for the title text inside the header
export const ShadcnDialogTitle = ({ children }) => {
  return <DialogTitle>{children}</DialogTitle>;
};

// Dialog Description for the description text inside the dialog
export const ShadcnDialogDescription = ({ children }) => {
  return <DialogDescription>{children}</DialogDescription>;
};

// Dialog Footer for actions (Cancel/Confirm buttons, etc.)
export const ShadcnDialogFooter = ({ children }) => {
  return <DialogFooter>{children}</DialogFooter>;
};

// Example of an Alert Dialog used for confirmations (like the Delete Confirmation)
export const ShadcnAlertDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. Do you want to proceed with deleting the
          user?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
