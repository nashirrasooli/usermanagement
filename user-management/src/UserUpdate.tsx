// import { useEffect, useState, FormEvent } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { createUser, getUser, updateUser, User } from './api';

// const blank: User = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   role: 'USER',
//   enabled: true,
//   password: '',
// };

// export default function UserUpdate() {
//   const { id } = useParams(); // "new" or real id
//   const isCreate = !id || id === 'new';
//   const nav = useNavigate();

//   const [form, setForm] = useState<User>(blank);
//   const [loading, setLoading] = useState(!isCreate);
//   const [error, setError] = useState('');

//   // load user for edit
//   useEffect(() => {
//     let alive = true;
//     if (!isCreate && id) {
//       (async () => {
//         try {
//           const u = await getUser(id);
//           if (!alive) return;
//           setForm({ ...u, password: '' }); // never prefill password
//           setLoading(false);
//         } catch (e: any) {
//           setError(e?.response?.data?.message || 'Failed to load user');
//           setLoading(false);
//         }
//       })();
//     }
//     return () => {
//       alive = false;
//     };
//   }, [id, isCreate]);

//   function onChange<K extends keyof User>(k: K, v: User[K]) {
//     setForm((prev) => ({ ...prev, [k]: v }));
//   }

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError('');
//     try {
//       // basic front-end validation
//       if (!form.firstName.trim()) throw new Error('First name is required');
//       if (!form.lastName.trim()) throw new Error('Last name is required');
//       if (!/^\S+@\S+\.\S+$/.test(form.email))
//         throw new Error('Valid email is required');

//       if (isCreate) {
//         const payload = { ...form };
//         if (!payload.password || payload.password.length < 6) {
//           throw new Error('Password (min 6 chars) is required for new users');
//         }
//         await createUser(payload);
//       } else {
//         const { password, ...rest } = form;
//         // If password left blank, backend should keep existing hash
//         await updateUser(id!, password ? form : (rest as any));
//       }

//       nav('/'); // back to list
//     } catch (e: any) {
//       setError(e?.response?.data?.message || e.message || 'Save failed');
//     }
//   }

//   if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

//   return (
//     <div
//       style={{
//         maxWidth: 560,
//         margin: '24px auto',
//         fontFamily: 'system-ui, Arial',
//       }}
//     >
//       <h2 style={{ marginBottom: 12 }}>
//         {isCreate ? 'Create user' : 'Update user'}
//       </h2>

//       <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
//         <label>
//           First name
//           <input
//             value={form.firstName}
//             onChange={(e) => onChange('firstName', e.target.value)}
//           />
//         </label>

//         <label>
//           Last name
//           <input
//             value={form.lastName}
//             onChange={(e) => onChange('lastName', e.target.value)}
//           />
//         </label>

//         <label>
//           Email
//           <input
//             type='email'
//             value={form.email}
//             onChange={(e) => onChange('email', e.target.value)}
//             disabled={!isCreate} // typically immutable after creation
//           />
//         </label>

//         <label>
//           Role
//           <select
//             value={form.role}
//             onChange={(e) => onChange('role', e.target.value as User['role'])}
//           >
//             <option value='USER'>USER</option>
//             <option value='ADMIN'>ADMIN</option>
//           </select>
//         </label>

//         <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <input
//             type='checkbox'
//             checked={form.enabled}
//             onChange={(e) => onChange('enabled', e.target.checked)}
//           />
//           Enabled
//         </label>

//         <label>
//           {isCreate
//             ? 'Password (required)'
//             : 'New password (leave blank to keep)'}
//           <input
//             type='password'
//             value={form.password ?? ''}
//             onChange={(e) => onChange('password', e.target.value)}
//             placeholder={isCreate ? 'min 6 chars' : '(unchanged if blank)'}
//           />
//         </label>

//         <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
//           <button type='submit'>{isCreate ? 'Create' : 'Save changes'}</button>
//           <button type='button' onClick={() => nav('/')}>
//             Cancel
//           </button>
//         </div>

//         {error && <p style={{ color: 'crimson' }}>{error}</p>}
//       </form>
//     </div>
//   );
// }

import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser, User } from './api';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

const blank: User = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
  enabled: true,
  password: '',
};

const roleOptions = [
  { label: 'USER', value: 'USER' },
  { label: 'ADMIN', value: 'ADMIN' },
] as const;

export default function UserUpdate() {
  const { id } = useParams(); // "new" or real id
  const isCreate = !id || id === 'new';
  const nav = useNavigate();

  const [form, setForm] = useState<User>(blank);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    if (!isCreate && id) {
      (async () => {
        try {
          const u = await getUser(id);
          if (!alive) return;
          setForm({ ...u, password: '' }); // never prefill password
        } catch (e: any) {
          setError(e?.response?.data?.message || 'Failed to load user');
        } finally {
          if (alive) setLoading(false);
        }
      })();
    } else {
      setLoading(false);
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
      // basic client-side validation
      if (!form.firstName.trim()) throw new Error('First name is required');
      if (!form.lastName.trim()) throw new Error('Last name is required');
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        throw new Error('Valid email is required');

      setSaving(true);

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
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className='flex align-items-center justify-content-center'
        style={{ height: 200 }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <Card
      title={isCreate ? 'Create User' : 'Update User'}
      className='p-3'
      style={{ maxWidth: 640, margin: '24px auto' }}
    >
      <form
        onSubmit={onSubmit}
        className='p-fluid'
        style={{ display: 'grid', gap: 12 }}
      >
        {/* First Name */}
        <div className='field'>
          <label htmlFor='firstName' className='block mb-2'>
            First name
          </label>
          <InputText
            id='firstName'
            value={form.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder='John'
          />
        </div>

        {/* Last Name */}
        <div className='field'>
          <label htmlFor='lastName' className='block mb-2'>
            Last name
          </label>
          <InputText
            id='lastName'
            value={form.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder='Doe'
          />
        </div>

        {/* Email */}
        <div className='field'>
          <label htmlFor='email' className='block mb-2'>
            Email
          </label>
          <InputText
            id='email'
            type='email'
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder='john@example.com'
            disabled={!isCreate} // typically immutable after creation
          />
        </div>

        {/* Role */}
        <div className='field'>
          <label htmlFor='role' className='block mb-2'>
            Role
          </label>
          <Dropdown
            id='role'
            value={form.role}
            options={
              roleOptions as unknown as { label: string; value: User['role'] }[]
            }
            onChange={(e: DropdownChangeEvent) =>
              onChange('role', e.value as User['role'])
            }
            placeholder='Select role'
          />
        </div>

        {/* Enabled */}
        <div className='field'>
          <div className='flex align-items-center gap-2'>
            <Checkbox
              inputId='enabled'
              checked={form.enabled}
              onChange={(e: CheckboxChangeEvent) =>
                onChange('enabled', !!e.checked)
              }
            />
            <label htmlFor='enabled' className='cursor-pointer'>
              Enabled
            </label>
          </div>
        </div>

        {/* Password */}
        <div className='field'>
          <label htmlFor='password' className='block mb-2'>
            {isCreate
              ? 'Password (required)'
              : 'New password (leave blank to keep)'}
          </label>
          <Password
            id='password'
            value={form.password ?? ''}
            onChange={(e) => onChange('password', e.target.value)}
            toggleMask
            feedback={isCreate} // show strength meter only when creating
            placeholder={isCreate ? 'min 6 chars' : '(unchanged if blank)'}
          />
        </div>

        {/* Error */}
        {error && <Message severity='error' text={error} />}

        {/* Actions */}
        <div className='flex gap-2 mt-2'>
          <Button
            type='submit'
            label={isCreate ? 'Create' : 'Save changes'}
            icon={isCreate ? 'pi pi-user-plus' : 'pi pi-save'}
            loading={saving}
          />
          <Button
            type='button'
            label='Cancel'
            icon='pi pi-times'
            severity='secondary'
            outlined
            onClick={() => nav('/')}
            disabled={saving}
          />
        </div>
      </form>
    </Card>
  );
}
