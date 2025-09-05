import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import UsersList from './UsersList';

export default function App() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const onLogout = () => {
    logout();
    nav('/login', { replace: true });
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
        <button onClick={onLogout}>Logout</button>
      </div>

      <UsersList />
    </div>
  );
}
