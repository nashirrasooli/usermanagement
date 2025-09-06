import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDeleteUserMutation, useListUsersQuery } from './usersApi';

type SearchArgs = {
  firstName?: string;
  lastName?: string;
} | void;

export default function UsersList() {
  // UI inputs (what the user is typing)
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // The args we actually send to the API (only change on Search / Clear)
  const [queryArgs, setQueryArgs] = useState<SearchArgs>(undefined);

  const {
    data: users = [],
    isLoading,
    refetch,
    isFetching,
  } = useListUsersQuery(queryArgs);

  const [deleteUser] = useDeleteUserMutation();

  const onDelete = (row: any) => {
    confirmDialog({
      message: `Delete ${row.email}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      position: 'top',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      defaultFocus: 'accept',
      accept: async () => {
        try {
          await deleteUser(row.id).unwrap();
          toast.success('User deleted');
          refetch();
        } catch {
          toast.error('Delete failed');
        }
      },
      reject: () => toast.info('Delete cancelled'),
    });
  };

  const actions = (row: any) => (
    <div className='flex gap-2'>
      <Link to={`/users/${row.id}/edit`}>
        <Button label='Edit' icon='pi pi-pencil' severity='info' size='small' />
      </Link>
      <Button
        label='Delete'
        icon='pi pi-trash'
        severity='danger'
        size='small'
        onClick={() => onDelete(row)}
      />
    </div>
  );

  const onSearch = () => {
    const first = firstNameInput.trim();
    const last = lastNameInput.trim();
    if (!first && !last) {
      // no filters -> load all
      setQueryArgs(undefined);
    } else {
      setQueryArgs({
        firstName: first || undefined,
        lastName: last || undefined,
      });
    }
  };

  const onClear = () => {
    setFirstNameInput('');
    setLastNameInput('');
    setQueryArgs(undefined); // load all
  };

  const resultsInfo =
    isLoading || isFetching ? 'Loading…' : `${users.length} result(s)`;

  return (
    <div className='surface-card p-4 border-round-xl w-full'>
      {/* Global confirm dialog host */}
      <ConfirmDialog
        draggable={false}
        closable={false}
        dismissableMask
        className='cool-confirm'
      />

      {/* Header row: search + create */}
      <div className='flex flex-column md:flex-row gap-2 justify-content-between align-items-end mb-3'>
        <div className='flex flex-wrap gap-2 align-items-end'>
          <div className='flex flex-column gap-1'>
            <label htmlFor='firstName' className='text-600 text-sm'>
              First name
            </label>
            <span className='p-input-icon-left'>
              <InputText
                id='firstName'
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
                placeholder='e.g. Ali'
                className='w-full'
              />
              <i className='pi pi-user' style={{ marginLeft: '-30px' }} />
            </span>
          </div>

          <div className='flex flex-column gap-1'>
            <label htmlFor='lastName' className='text-600 text-sm'>
              Last name
            </label>
            <span className='p-input-icon-left'>
              <InputText
                id='lastName'
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
                placeholder='e.g. Ahmadi'
                className='w-full'
              />
              <i className='pi pi-user' style={{ marginLeft: '-30px' }} />
            </span>
          </div>

          <Button label='Search' icon='pi pi-search' onClick={onSearch} />

          <Button
            label='Clear'
            icon='pi pi-times'
            severity='secondary'
            outlined
            onClick={onClear}
          />
        </div>

        <Link to='/users/new'>
          <Button label='Create User' icon='pi pi-plus' severity='success' />
        </Link>
      </div>

      <DataTable
        value={users}
        loading={isLoading || isFetching}
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
