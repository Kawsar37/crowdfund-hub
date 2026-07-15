'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.updateUserRole(id, newRole);
      toast.success('Role updated!');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      toast.success('User deleted!');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded" />)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-3">
                    {u.photo_url ? (
                      <img src={u.photo_url} alt={u.display_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-xs font-medium">{u.display_name?.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium">{u.display_name}</span>
                  </div>
                </td>
                <td className="text-gray-500">{u.user_email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="supporter">Supporter</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="font-semibold">{u.credits}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
