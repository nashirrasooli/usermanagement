import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser, User } from './api';

const blank: User = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
  enabled: true,
  password: '',
};

export default function UserUpdate() {
  const { id } = useParams(); // "new" or real id
  const isCreate = !id || id === 'new';
  const nav = useNavigate();

  const [form, setForm] = useState<User>(blank);
  const [loading, setLoading] = useState(!isCreate);
  const [error, setError] = useState('');

  // load user for edit
  useEffect(() => {
    let alive = true;
    if (!isCreate && id) {
      (async () => {
        try {
          const u = await getUser(id);
          if (!alive) return;
          setForm({ ...u, password: '' }); // never prefill password
          setLoading(false);
        } catch (e: any) {
          setError(e?.response?.data?.message || 'Failed to load user');
          setLoading(false);
        }
      })();
    }
    return () => {
      alive = false;
    };
  }, [id, isCreate]);

  function onChange<K extends keyof User>(k: K, v: User[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      // basic front-end validation
      if (!form.firstName.trim()) throw new Error('First name is required');
      if (!form.lastName.trim()) throw new Error('Last name is required');
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        throw new Error('Valid email is required');

      if (isCreate) {
        const payload = { ...form };
        if (!payload.password || payload.password.length < 6) {
          throw new Error('Password (min 6 chars) is required for new users');
        }
        await createUser(payload);
      } else {
        const { password, ...rest } = form;
        // If password left blank, backend should keep existing hash
        await updateUser(id!, password ? form : (rest as any));
      }

      nav('/'); // back to list
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Save failed');
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div
      style={{
        maxWidth: 560,
        margin: '24px auto',
        fontFamily: 'system-ui, Arial',
      }}
    >
      <h2 style={{ marginBottom: 12 }}>
        {isCreate ? 'Create user' : 'Update user'}
      </h2>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          First name
          <input
            value={form.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
          />
        </label>

        <label>
          Last name
          <input
            value={form.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type='email'
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={!isCreate} // typically immutable after creation
          />
        </label>

        <label>
          Role
          <select
            value={form.role}
            onChange={(e) => onChange('role', e.target.value as User['role'])}
          >
            <option value='USER'>USER</option>
            <option value='ADMIN'>ADMIN</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type='checkbox'
            checked={form.enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
          />
          Enabled
        </label>

        <label>
          {isCreate
            ? 'Password (required)'
            : 'New password (leave blank to keep)'}
          <input
            type='password'
            value={form.password ?? ''}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder={isCreate ? 'min 6 chars' : '(unchanged if blank)'}
          />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type='submit'>{isCreate ? 'Create' : 'Save changes'}</button>
          <button type='button' onClick={() => nav('/')}>
            Cancel
          </button>
        </div>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
