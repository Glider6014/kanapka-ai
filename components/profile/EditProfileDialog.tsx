"use client";

import React from "react";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

type EditProfileDialogProps = {
    user: {
      displayName: string;
      bio: string;
      avatar: string;
    };
  };

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ user }) => {
  return (
    <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline">
            <Pencil className="w-4 h-4"/>
        </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
            Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Name
            </Label>
            <Input
                id="name"
                defaultValue={user.displayName}
                className="col-span-3"
            />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
                Avatar
            </Label>
            <Input
                id="avatar"
                defaultValue={user.avatar}
                className="col-span-3"
            />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Bio" className="text-right">
                Bio
            </Label>
            <Textarea 
                id="Bio" 
                className="col-span-3"
                defaultValue={user.bio} 
                placeholder="Type your message here." 
            />
            </div>
        </div>
        <DialogFooter>
            <Button type="submit">Save changes</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
