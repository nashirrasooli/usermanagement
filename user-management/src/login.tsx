import { FormEvent, useState } from 'react';
import { useAuth } from './auth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

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
      const data = await r.json(); // { accessToken, tokenType }
      login(data.accessToken);
      // redirect
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '80px auto',
        fontFamily: 'system-ui, Arial',
      }}
    >
      <h1>Sign in</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder='Password'
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
