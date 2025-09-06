// // src/UsersList.tsx
// import { Link } from 'react-router-dom';
// import { useListUsersQuery, useDeleteUserMutation } from './features/usersApi';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
// import { toast } from 'react-toastify';
// import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

// export default function UsersList() {
//   const { data: users = [], isLoading } = useListUsersQuery();
//   const [deleteUser] = useDeleteUserMutation();

//   const onDelete = (row: any) => {
//     confirmDialog({
//       message: `Are you sure you want to delete ${row.email}?`,
//       header: 'Confirm Delete',
//       icon: 'pi pi-exclamation-triangle',
//       acceptClassName: 'p-button-danger',
//       acceptLabel: 'Yes, Delete',
//       rejectLabel: 'Cancel',
//       accept: async () => {
//         try {
//           await deleteUser(row.id).unwrap();
//           toast.success('User deleted!');
//         } catch {
//           toast.error('Delete failed');
//         }
//       },
//       reject: () => {
//         toast.info('Delete cancelled');
//       },
//     });
//   };

//   const actions = (row: any) => (
//     <div className='flex gap-2'>
//       <ConfirmDialog />

//       <Link to={`/users/${row.id}/edit`}>
//         <Button label='Edit' icon='pi pi-pencil' severity='info' />
//       </Link>
//       <Button
//         label='Delete'
//         icon='pi pi-trash'
//         severity='danger'
//         // onClick={async () => {
//         //   try {
//         //     if (row.id && window.confirm(`Delete ${row.email}?`)) {
//         //       await deleteUser(row.id).unwrap();
//         //       toast.success('User deleted');
//         //     }
//         //   } catch (e: any) {
//         //     toast.error('Delete failed');
//         //   }
//         // }}
//         onClick={() => onDelete(row)}
//       />
//     </div>
//   );

//   return (
//     <div className='surface-card p-4 border-round-lg w-full'>
//       <div className='flex justify-content-between align-items-center mb-3'>
//         {/* (No second “Users” title here) */}
//         <div />
//         <Link to='/users/new'>
//           <Button label='Create User' icon='pi pi-plus' severity='success' />
//         </Link>
//       </div>

//       <DataTable
//         value={users}
//         loading={isLoading}
//         paginator
//         rows={10}
//         stripedRows
//         emptyMessage='No users found'
//         className='w-full'
//         responsiveLayout='scroll'
//       >
//         <Column header='Name' body={(r) => `${r.firstName} ${r.lastName}`} />
//         <Column field='email' header='Email' />
//         <Column field='role' header='Role' />
//         <Column header='Enabled' body={(r) => (r.enabled ? 'Yes' : 'No')} />
//         <Column header='Actions' body={actions} style={{ width: 260 }} />
//       </DataTable>
//     </div>
//   );
// }

// src/UsersList.tsx
import { Link } from 'react-router-dom';
import { useListUsersQuery, useDeleteUserMutation } from './features/usersApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function UsersList() {
  const { data: users = [], isLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const onDelete = (row: any) => {
    confirmDialog({
      message: `Delete ${row.email}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      // make it drop from the top
      position: 'top',
      // UX: highlight danger, focus cancel by default
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      defaultFocus: 'accept',
      // closes automatically on accept/reject; no manual visible state needed
      accept: async () => {
        try {
          await deleteUser(row.id).unwrap();
          toast.success('User deleted');
        } catch {
          toast.error('Delete failed');
        }
      },
      reject: () => {
        // dialog auto-closes; this is just a toast
        toast.info('Delete cancelled');
      },
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

  return (
    <div className='surface-card p-4 border-round-xl w-full'>
      {/* Mount a single global confirm dialog ONCE per page */}
      <ConfirmDialog
        draggable={false}
        closable={false}
        dismissableMask
        breakpoints={{ '960px': '80vw', '640px': '95vw' }}
        className='cool-confirm'
      />

      <div className='flex justify-content-between align-items-center mb-3'>
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
