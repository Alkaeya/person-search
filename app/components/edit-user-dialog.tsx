'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type User, type UserFormData } from '@/app/actions/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserForm } from './user-form';
import { useState } from 'react';

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!!user);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    } : undefined,
  });

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
      setIsOpen(false);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <UserForm form={form} />
          <div className="mt-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsOpen(false);
                onClose();
              }} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
