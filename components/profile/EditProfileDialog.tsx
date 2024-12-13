'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type EditProfileDialogProps = {
  user: {
    displayName: string;
    bio: string;
    avatar: string;
    bgc: string;
  };
};

const FormSchema = z.object({
  displayName: z.string().min(1, 'Name cannot be empty.'),
  avatar: z.string().url('Avatar must be a valid URL.').optional(),
  bgc: z.string().url('Avatar must be a valid URL.').optional(),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters.')
    .max(160, 'Bio must not be longer than 160 characters.'),
});

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ user }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: user,
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`/api/profile/${session?.user?.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateData: {
            displayName: values.displayName,
            avatar: values.avatar,
            bgc: values.bgc,
            bio: values.bio,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Profile update error:', data.message);
        return;
      }

      console.log('Profile updated successfully:', data);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Pencil className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://example.com/avatar.jpg'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bgc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://example.com/background.jpg'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Tell us a little bit about yourself.'
                    />
                  </FormControl>
                  <FormDescription>
                    Your bio can be between 10 and 160 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
