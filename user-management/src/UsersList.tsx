// src/UsersList.tsx
import { Link } from 'react-router-dom';
import { useListUsersQuery, useDeleteUserMutation } from './features/usersApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';

export default function UsersList() {
  const { data: users = [], isLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const actions = (row: any) => (
    <div className='flex gap-2'>
      <Link to={`/users/${row.id}/edit`}>
        <Button label='Edit' icon='pi pi-pencil' severity='info' />
      </Link>
      <Button
        label='Delete'
        icon='pi pi-trash'
        severity='danger'
        // onClick={async () => {
        //   if (row.id && window.confirm(`Delete ${row.email}?`)) {
        //     await deleteUser(row.id);
        //   }
        // }}
        onClick={async () => {
          try {
            if (row.id && window.confirm(`Delete ${row.email}?`)) {
              await deleteUser(row.id).unwrap();
              toast.success('User deleted');
            }
          } catch (e: any) {
            toast.error('Delete failed');
          }
        }}
      />
    </div>
  );

  return (
    <div className='surface-card p-4 border-round-lg w-full'>
      <div className='flex justify-content-between align-items-center mb-3'>
        {/* (No second “Users” title here) */}
        <div />
        <Link to='/users/new'>
          <Button label='Create User' icon='pi pi-plus' severity='success' />
        </Link>
      </div>

      <DataTable
        value={users}
        loading={isLoading}
        paginator
        rows={10}
        stripedRows
        emptyMessage='No users found'
        className='w-full'
        responsiveLayout='scroll'
      >
        <Column header='Name' body={(r) => `${r.firstName} ${r.lastName}`} />
        <Column field='email' header='Email' />
        <Column field='role' header='Role' />
        <Column header='Enabled' body={(r) => (r.enabled ? 'Yes' : 'No')} />
        <Column header='Actions' body={actions} style={{ width: 260 }} />
      </DataTable>
    </div>
  );
}
