import { FormEvent, useState } from 'react';
import { useAuth } from './auth';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useAuth(); // Redux-backed hook
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
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

      if (!r.ok) {
        const maybeJson = await r
          .json()
          .catch(() => ({ message: 'Login failed' }));
        throw new Error(maybeJson?.message || 'Login failed');
      }

      // Backend response shape: { accessToken, tokenType }
      const data = await r.json();

      // ✅ Save under "token" so axios interceptor picks it up
      localStorage.setItem('token', data.accessToken);

      // ✅ Also update Redux (keeps app state in sync)
      login(data.accessToken);
      toast.success('Logged in successfully!');

      // Redirect to app
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
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
              autoComplete='username'
            />
          </div>

          <div className='field'>
            <label htmlFor='password' className='block mb-2'>
              Password
            </label>
            <Password
              inputId='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              className='w-full'
              inputClassName='w-full'
              placeholder='••••••••'
              autoComplete='current-password'
            />
          </div>

          {error && <Message severity='error' text={error} />}

          <Button
            type='submit'
            label='Login'
            icon='pi pi-sign-in'
            size='large'
            className='w-full'
            loading={loading}
          />
        </form>
      </Dialog>
    </div>
  );
}
