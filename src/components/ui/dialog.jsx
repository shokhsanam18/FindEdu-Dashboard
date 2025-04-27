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

import { Button } from "@/components/ui/button";

export const ShadcnDialog = ({ children }) => {
  return <Dialog>{children}</Dialog>;
};

export const ShadcnDialogTrigger = ({ children, ...props }) => (
  <DialogTrigger asChild>{children}</DialogTrigger>
);

export const ShadcnDialogContent = ({ children }) => {
  return <DialogContent>{children}</DialogContent>;
};

export const ShadcnDialogHeader = ({ children }) => {
  return <DialogHeader>{children}</DialogHeader>;
};

export const ShadcnDialogTitle = ({ children }) => {
  return <DialogTitle>{children}</DialogTitle>;
};

export const ShadcnDialogDescription = ({ children }) => {
  return <DialogDescription>{children}</DialogDescription>;
};

export const ShadcnDialogFooter = ({ children }) => {
  return <DialogFooter>{children}</DialogFooter>;
};

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
