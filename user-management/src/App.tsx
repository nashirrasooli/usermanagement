import { useEffect, useMemo, useState } from 'react';
import { createUser, deleteUser, listUsers, updateUser } from './api';
import type { Role, User, UserRequest } from './types';

const emptyForm: UserRequest = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
  enabled: true,
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserRequest>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string>(''); // simple client-side filter

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail || e.message || 'Failed to load users'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return users;
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    );
  }, [users, q]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      const errs = e?.response?.data?.errors;
      setError(
        errs ? errs.join('; ') : detail || e.message || 'Request failed'
      );
    }
  };

  const onEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      enabled: u.enabled,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await deleteUser(id);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e.message || 'Delete failed');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div
      style={{
        maxWidth: 960,
        margin: '40px auto',
        padding: '0 16px',
        fontFamily: 'system-ui, Arial',
      }}
    >
      <h1>User Management</h1>

      <form
        onSubmit={onSubmit}
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <input
          placeholder='First name'
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder='Last name'
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
        >
          <option value='USER'>USER</option>
          <option value='ADMIN'>ADMIN</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type='checkbox'
            checked={form.enabled}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          />
          Enabled
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type='submit'>{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type='button' onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: 16 }}>
        <input
          placeholder='Search name/email…'
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: '100%', maxWidth: 320 }}
        />
      </div>

      {error && <p style={{ color: 'crimson', marginTop: 10 }}>{error}</p>}
      {loading && <p>Loading…</p>}

      <h2 style={{ marginTop: 24 }}>Users</h2>
      <div style={{ overflowX: 'auto' }}>
        <table
          width='100%'
          cellPadding={8}
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr style={{ background: '#f3f3f3' }}>
              <th align='left'>Name</th>
              <th align='left'>Email</th>
              <th>Role</th>
              <th>Enabled</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td align='center'>{u.role}</td>
                <td align='center'>{u.enabled ? '✓' : '—'}</td>
                <td align='center'>{new Date(u.createdAt).toLocaleString()}</td>
                <td align='center' style={{ whiteSpace: 'nowrap' }}>
                  <button onClick={() => onEdit(u)}>Edit</button>{' '}
                  <button onClick={() => onDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={6} align='center'>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
