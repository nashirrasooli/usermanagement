import { useEffect, useState } from 'react';
import { listUsers, deleteUser, User } from './api';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  async function refresh() {
    setUsers(await listUsers());
  }

  useEffect(() => {
    refresh();
  }, []);

  // custom renderer for the "enabled" column
  const enabledTemplate = (row: User) => (
    <span>{row.enabled ? 'Yes' : 'No'}</span>
  );

  // custom renderer for the "actions" column
  const actionTemplate = (row: User) => (
    <div className='flex gap-2'>
      <Link to={`/users/${row.id}/edit`}>
        <Button label='Edit' icon='pi pi-pencil' severity='info' size='small' />
      </Link>
      <Button
        label='Delete'
        icon='pi pi-trash'
        severity='danger'
        size='small'
        onClick={async () => {
          if (!row.id) return;
          if (window.confirm(`Delete ${row.email}?`)) {
            await deleteUser(row.id);
            refresh();
          }
        }}
      />
    </div>
  );

  return (
    <div className='card'>
      <div style={{ marginBottom: 12 }}>
        <Link to='/users/new'>
          <Button label='Create User' icon='pi pi-plus' severity='success' />
        </Link>
      </div>

      <DataTable
        value={users}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        stripedRows
        emptyMessage='No users found'
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column
          header='Name'
          body={(row: User) => `${row.firstName} ${row.lastName}`}
        />
        <Column field='email' header='Email' />
        <Column field='role' header='Role' />
        <Column header='Enabled' body={enabledTemplate} />
        <Column
          header='Actions'
          body={actionTemplate}
          style={{ width: '200px' }}
        />
      </DataTable>
    </div>
  );
}
