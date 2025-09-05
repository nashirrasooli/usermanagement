import { useEffect, useState } from 'react';
import { listUsers, deleteUser, User } from './api';
import { Link } from 'react-router-dom';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  async function refresh() {
    setUsers(await listUsers());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link to='/users/new'>
          <button>Create user</button>
        </Link>
      </div>

      <table
        width='100%'
        cellPadding={8}
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.enabled ? 'Yes' : 'No'}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <Link to={`/users/${u.id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button
                  onClick={async () => {
                    if (!u.id) return;
                    if (window.confirm(`Delete ${u.email}?`)) {
                      await deleteUser(u.id);
                      refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 16, color: '#666' }}>
                No users yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
