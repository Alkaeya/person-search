'use client';

import { useEffect, useState } from 'react';
import { searchUsers, deleteUser, updateUser } from '@/app/actions/actions';
import { type User, type UserFormData } from '@/app/actions/schemas';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditUserDialog } from './edit-user-dialog';
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
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Get all users by searching with empty query
        const results = await searchUsers(searchQuery || '');
        setUsers(results);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      const results = await searchUsers(searchQuery || '');
      setUsers(results);
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
      const results = await searchUsers(searchQuery || '');
      setUsers(results);
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
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name, email, or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      />

      {users.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No users found. Add one to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Phone</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phoneNumber}</td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
