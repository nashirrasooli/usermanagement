import { useEffect, useState } from 'react';
import { listUsers, deleteUser, User } from './api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth'; // ← add

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const nav = useNavigate();
  const { logout } = useAuth(); // ← add

  async function refresh() {
    setUsers(await listUsers());
  }
  useEffect(() => {
    refresh();
  }, []);

  const onLogout = () => {
    // ← add
    logout(); // clears token (your hook)
    nav('/login', { replace: true }); // go to login
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '24px auto',
        fontFamily: 'system-ui, Arial',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Users</h2>
        <button onClick={onLogout}>Logout</button> {/* ← add */}
      </div>

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
