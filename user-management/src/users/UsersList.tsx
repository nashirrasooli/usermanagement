import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDeleteUserMutation, useListUsersQuery } from './usersApi';

type SearchArgs = {
  firstName?: string;
  lastName?: string;
  q?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
} | void;

export default function UsersList() {
  // UI inputs
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  // Server-side pagination/sorting state
  const [page, setPage] = useState(0); // 0-based
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState<
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'role'
    | 'enabled'
    | 'createdAt'
    | 'updatedAt'
  >('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Build the args we send
  const queryArgs: SearchArgs = useMemo(() => {
    const args: any = { page, size: rows, sortField, sortOrder };
    if (firstNameInput.trim()) args.firstName = firstNameInput.trim();
    if (lastNameInput.trim()) args.lastName = lastNameInput.trim();
    return args;
  }, [firstNameInput, lastNameInput, page, rows, sortField, sortOrder]);

  const { data, isLoading, isFetching, refetch } = useListUsersQuery(queryArgs);

  const users = data?.content ?? [];
  const total = data?.totalElements ?? 0;

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

  // Search button: reset to first page with current filters
  const onSearch = () => setPage(0);

  const onClear = () => {
    setFirstNameInput('');
    setLastNameInput('');
    setPage(0);
    setRows(10);
    setSortField('createdAt');
    setSortOrder('desc');
  };

  // PrimeReact DataTable events
  const onPage = (e: DataTablePageEvent) => {
    setPage(Math.floor((e.first ?? 0) / (e.rows ?? rows)));
    setRows(e.rows ?? rows);
  };

  const onSort = (e: DataTableSortEvent) => {
    // e.sortField is column field when using single column sort
    const sf = (e.sortField as any) || 'createdAt';
    const so = e.sortOrder === 1 ? 'asc' : 'desc';
    setSortField(sf);
    setSortOrder(so);
    setPage(0); // go back to first page on sort change
  };

  const resultsInfo = isLoading || isFetching ? 'Loading…' : `${total} total`;

  return (
    <div className='surface-card p-4 border-round-xl w-full'>
      <ConfirmDialog
        draggable={false}
        closable={false}
        dismissableMask
        className='cool-confirm'
      />

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

          {/* <Button label='Search' icon='pi pi-search' onClick={onSearch} /> */}
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
        lazy
        paginator
        rows={rows}
        first={page * rows}
        totalRecords={total}
        onPage={onPage}
        sortField={sortField}
        sortOrder={sortOrder === 'asc' ? 1 : -1}
        onSort={onSort}
        stripedRows
        emptyMessage='No users found'
        className='w-full'
        responsiveLayout='scroll'
      >
        <Column header='Name' body={(r) => `${r.firstName} ${r.lastName}`} />
        <Column field='email' header='Email' sortable />
        <Column field='role' header='Role' sortable />
        <Column
          header='Enabled'
          body={(r) => (r.enabled ? 'Yes' : 'No')}
          sortable
          sortField='enabled'
        />
        <Column
          field='createdAt'
          header='Created'
          sortable
          body={(r) => new Date(r.createdAt).toLocaleString()}
        />
        <Column header='Actions' body={actions} style={{ width: 260 }} />
      </DataTable>
    </div>
  );
}
