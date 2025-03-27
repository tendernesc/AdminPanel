// src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AxiosResponse } from 'axios';

interface IUser {
  id: number;
  name: string;
  email: string;
  lastLogin: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response: AxiosResponse<IUser[]> = await api.get('/admin/users');
      // Сортировка: по последнему входу (если нет - по времени регистрации)
      const sorted = response.data.sort((a, b) => {
        const dateA = a.lastLogin ? new Date(a.lastLogin) : new Date(a.createdAt);
        const dateB = b.lastLogin ? new Date(b.lastLogin) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setUsers(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(userId => userId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAction = async (action: string) => {
    if (!selectedIds.length) {
      alert("Select at least one user.");
      return;
    }
    try {
      await api.post(`/admin/${action}`, { userIds: selectedIds });
      setMessage(`Users ${action === 'delete' ? 'deleted' : (action === 'block' ? 'blocked' : 'unblocked')}`);
      fetchUsers();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <button className="btn btn-warning me-2" onClick={() => handleAction('block')}>Block</button>
        <button className="btn btn-success me-2" onClick={() => handleAction('unblock')}>Unblock</button>
        <button className="btn btn-danger" onClick={() => handleAction('delete')}>Delete</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleSelect(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
