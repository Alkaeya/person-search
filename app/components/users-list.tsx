'use client';

import { useEffect, useMemo, useState } from 'react';
import { addUserSafe, getAllUsers, deleteUser, updateUser } from '@/app/actions/actions';
import { userFormSchema, type User, type UserFormData } from '@/app/actions/schemas';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditUserDialog } from './edit-user-dialog';
import { UserForm } from './user-form';
import { Input } from '@/components/ui/input';
import MutableDialog, { ActionState } from '@/components/mutable-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const { toast } = useToast();
  const pageSize = 8;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const results = await getAllUsers();
        setUsers(results);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.phoneNumber.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handleEditSubmit = async (data: UserFormData) => {
    if (!editingUser) {
      throw new Error('No user selected for editing');
    }

    try {
      await updateUser(editingUser.id, data);
      toast({
        title: 'Success',
        description: `User ${data.name} updated successfully`,
      });
      // Reload users
      const results = await getAllUsers();
      setUsers(results);
      setCurrentPage(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    const result = await addUserSafe(data);

    if (result.success) {
      const refreshedUsers = await getAllUsers();
      setUsers(refreshedUsers);
      setCurrentPage(1);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
    };
  };

  const handleDeleteConfirm = async () => {
    if (deletingUserId === null) return;

    try {
      await deleteUser(deletingUserId);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      setDeletingUserId(null);
      // Reload users
      const results = await getAllUsers();
      setUsers(results);
      setCurrentPage(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setDeletingUserId(null);
    }
  };

  if (loading && users.length === 0) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Directory</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredUsers.length} of {users.length} saved users
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by name, email, or phone"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <MutableDialog<UserFormData>
          formSchema={userFormSchema}
          FormComponent={UserForm}
          action={handleAddUser}
          triggerButtonLabel="Add Person"
          addDialogTitle="Add Person"
          dialogDescription="Fill out the details below to add a new person."
          submitButtonLabel="Save"
        />
      </div>

      {users.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No users found. Add one to get started!</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No matching users found.</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%] px-4">Name</TableHead>
                <TableHead className="w-[30%] px-4">Email</TableHead>
                <TableHead className="w-[25%] px-4">Phone Number</TableHead>
                <TableHead className="w-[15%] px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/25">
                  <TableCell className="px-4 py-3 font-medium">{user.name}</TableCell>
                  <TableCell className="px-4 py-3">{user.email}</TableCell>
                  <TableCell className="px-4 py-3">{user.phoneNumber}</TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="inline-flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeletingUserId(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredUsers.length > pageSize && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }}
                  aria-disabled={safeCurrentPage === 1}
                  className={safeCurrentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <Button
                    variant={pageNumber === safeCurrentPage ? 'outline' : 'ghost'}
                    size="sm"
                    className="h-9 min-w-9 px-3"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }}
                  aria-disabled={safeCurrentPage === totalPages}
                  className={safeCurrentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-sm text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingUserId !== null} onOpenChange={(open) => {
        if (!open) setDeletingUserId(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
