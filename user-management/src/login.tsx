import { FormEvent, useState } from 'react';
import { useAuth } from './auth';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(true);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const r = await fetch(
        (process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080/api') +
          '/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!r.ok) throw new Error('Login failed');
      const data = await r.json();
      login(data.accessToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className='surface-ground min-h-screen flex align-items-center justify-content-center'>
      <Dialog
        header='Sign in'
        visible={visible}
        onHide={() => setVisible(false)}
        modal
        position='top'
        className='login-dialog p-fluid'
        style={{ width: '28rem', marginTop: '10vh' }}
        draggable={false}
        closable={false}
        dismissableMask={false}
        blockScroll
      >
        <form onSubmit={onSubmit} className='flex flex-column gap-3'>
          {/* Email */}
          <div className='field'>
            <label htmlFor='email' className='block mb-2'>
              Email
            </label>
            <InputText
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full'
              placeholder='admin@example.com'
            />
          </div>

          {/* Password */}
          <div className='field'>
            <label htmlFor='password' className='block mb-2'>
              Password
            </label>
            <Password
              inputId='password' // <-- use inputId for Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              className='w-full'
              inputClassName='w-full'
              placeholder='••••••••'
            />
          </div>

          {error && <Message severity='error' text={error} />}

          <Button
            type='submit'
            label='Login'
            icon='pi pi-sign-in'
            size='large'
            className='w-full'
          />
        </form>
      </Dialog>
    </div>
  );
}
