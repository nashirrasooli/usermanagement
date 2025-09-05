import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import UsersList from './UsersList';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function App() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const onLogout = () => {
    logout();
    nav('/login', { replace: true });
  };

  return (
    <Card style={{ maxWidth: 900, margin: '24px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>Users</h2>
        <Button
          label='Logout'
          icon='pi pi-sign-out'
          severity='secondary'
          onClick={onLogout}
        />
      </div>

      <UsersList />
    </Card>
  );
}
