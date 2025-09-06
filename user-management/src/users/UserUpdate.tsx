import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { toast } from 'react-toastify';

import {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  type User, // if you exported it from usersApi; otherwise keep your local type
} from './usersApi'; // same folder as UsersList in your project

const blank: User = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
  enabled: true,
  password: '',
};

export default function UserUpdate() {
  const { id } = useParams();
  const isCreate = !id || id === 'new';
  const nav = useNavigate();

  // RTK Query hooks
  const { data: loadedUser, isLoading } = useGetUserQuery(id!, {
    skip: isCreate,
  });
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [form, setForm] = useState<User>(blank);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loadedUser) setForm({ ...loadedUser, password: '' });
  }, [loadedUser]);

  function onChange<K extends keyof User>(k: K, v: User[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      // basic validation
      if (!form.firstName.trim()) throw new Error('First name is required');
      if (!form.lastName.trim()) throw new Error('Last name is required');
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        throw new Error('Valid email is required');

      if (isCreate) {
        if (!form.password || form.password.length < 6)
          throw new Error('Password (min 6 chars) is required for new users');
        await createUser(form).unwrap();
        toast.success('User created!');
      } else {
        const { password, ...rest } = form;
        await updateUser({
          id: id!,
          data: password ? form : (rest as Partial<User>),
        }).unwrap();
        toast.success('User updated!');
      }

      // go back; RTK Query will refetch the list because of invalidatesTags
      nav('/', { replace: true });
    } catch (e: any) {
      setError(e?.data?.message || e?.message || 'Save failed');
    }
  }

  if (!isCreate && isLoading) return <div className='p-4'>Loading…</div>;

  const saving = creating || updating;

  return (
    <Card
      title={isCreate ? 'Create User' : 'Update User'}
      className='mx-auto'
      style={{ maxWidth: 560 }}
    >
      <form onSubmit={onSubmit} className='flex flex-column gap-3'>
        {error && <Message severity='error' text={error} />}

        <div className='field'>
          <label htmlFor='firstName' className='block mb-2'>
            First name
          </label>
          <InputText
            id='firstName'
            value={form.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className='w-full'
          />
        </div>

        <div className='field'>
          <label htmlFor='lastName' className='block mb-2'>
            Last name
          </label>
          <InputText
            id='lastName'
            value={form.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className='w-full'
          />
        </div>

        <div className='field'>
          <label htmlFor='email' className='block mb-2'>
            Email
          </label>
          <InputText
            id='email'
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            className='w-full'
            // disabled={!isCreate}
          />
        </div>

        <div className='field'>
          <label htmlFor='role' className='block mb-2'>
            Role
          </label>
          <Dropdown
            id='role'
            value={form.role}
            options={[
              { label: 'USER', value: 'USER' },
              { label: 'ADMIN', value: 'ADMIN' },
            ]}
            onChange={(e) => onChange('role', e.value)}
            className='w-full'
          />
        </div>

        <div className='field flex align-items-center gap-2'>
          <Checkbox
            inputId='enabled'
            checked={form.enabled}
            onChange={(e) => onChange('enabled', !!e.checked)}
          />
          <label htmlFor='enabled'>Enabled</label>
        </div>

        <div className='field'>
          <label htmlFor='password' className='block mb-2'>
            {isCreate
              ? 'Password (required)'
              : 'New password (leave blank to keep)'}
          </label>
          <Password
            inputId='password'
            value={form.password ?? ''}
            onChange={(e) => onChange('password', e.target.value)}
            feedback={false}
            toggleMask
            className='w-full'
            inputClassName='w-full'
            placeholder={isCreate ? 'min 6 chars' : '(unchanged if blank)'}
          />
        </div>

        <div className='flex gap-2 mt-2'>
          <Button
            type='submit'
            label={isCreate ? 'Create' : 'Save changes'}
            loading={saving}
            icon='pi pi-user'
          />
          <Button
            type='button'
            label='Cancel'
            severity='secondary'
            onClick={() => nav('/')}
            icon='pi pi-times'
            disabled={saving}
          />
        </div>
      </form>
    </Card>
  );
}
