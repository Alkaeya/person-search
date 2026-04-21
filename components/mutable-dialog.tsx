// component/mutable-dialog.tsx

'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "../hooks/use-toast"; // Using shadcn toast hook for notifications.
import { ZodType } from 'zod';

export interface ActionState <T>{
    success: boolean;
    message: string | null;
    data?: T;
  }
interface GenericDialogProps<T extends FieldValues> {
  formSchema: ZodType<T>;
  FormComponent: React.ComponentType<{ form: UseFormReturn<T> }>;
  action?: (data: T) => Promise<ActionState<T>>;
  triggerButtonLabel?: string;
  addDialogTitle?: string;
  editDialogTitle?: string;
  dialogDescription?: string;
  submitButtonLabel?: string;
  defaultValues?: DefaultValues<T>; // If present, this will indicate edit mode
}

export default function MutableDialog<T extends FieldValues>({
  formSchema,
  FormComponent,
  action, 
  defaultValues,
  triggerButtonLabel = defaultValues ? 'Edit' : 'Add',
  addDialogTitle = 'Add',
  editDialogTitle = 'Edit',
  dialogDescription = defaultValues ? 'Make changes to your item here. Click save when you\'re done.' : 'Fill out the form below to add a new item.',
  submitButtonLabel = defaultValues ? 'Save' : 'Add',
}: GenericDialogProps<T>) {
  const [open, setOpen] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // Reset the form when the dialog is closed
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function handleSubmit(data: T) {
    if (!action) {
      throw new Error("No action function provided");
    }

    const actions = await action(data);  // Call the provided action directly

    if (actions.success) {
      const toastMessage = actions.message;
      toast({
        title: "Success",
        description: toastMessage,
        variant: "default",
      });
      setOpen(false);
    } else {
      const toastMessage = actions.message;
      toast({
        title: "Error",
        description: toastMessage || "Failed to add User",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button >{triggerButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? editDialogTitle : addDialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormComponent form={form} />
          <div className="mt-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
              <Button type="submit">{submitButtonLabel}</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 