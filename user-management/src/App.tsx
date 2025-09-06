// src/App.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import UsersList from './UsersList';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

export default function App() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const onLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  const left = (
    <div className='flex align-items-center gap-2'>
      <h2 className='m-0'>Users</h2>
    </div>
  );

  const right = (
    <Button
      label='Logout'
      icon='pi pi-sign-out'
      onClick={onLogout}
      severity='secondary'
    />
  );

  return (
    <div className='min-h-screen w-full surface-ground flex flex-column'>
      <Toolbar
        className='px-4 py-3 surface-0 shadow-1 border-none border-round-0'
        left={left}
        right={right}
      />

      <main className='flex-1 w-full p-4'>
        {/* No maxWidth here — let it breathe */}
        <UsersList />
      </main>
    </div>
  );
}
