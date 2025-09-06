import { Link } from 'react-router-dom';
import { useListUsersQuery, useDeleteUserMutation } from './features/usersApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export default function UsersList() {
  const { data: users = [], isLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const actions = (row: any) => (
    <div className='flex gap-2'>
      <Link to={`/users/${row.id}/edit`}>
        <Button label='Edit' icon='pi pi-pencil' size='small' />
      </Link>
      <Button
        label='Delete'
        icon='pi pi-trash'
        severity='danger'
        size='small'
        onClick={async () => {
          if (row.id && window.confirm(`Delete ${row.email}?`))
            await deleteUser(row.id);
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
        loading={isLoading}
        paginator
        rows={5}
        stripedRows
        emptyMessage='No users found'
      >
        <Column header='Name' body={(r) => `${r.firstName} ${r.lastName}`} />
        <Column field='email' header='Email' />
        <Column field='role' header='Role' />
        <Column header='Enabled' body={(r) => (r.enabled ? 'Yes' : 'No')} />
        <Column header='Actions' body={actions} style={{ width: 220 }} />
      </DataTable>
    </div>
  );
}
