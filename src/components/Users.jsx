import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ModalContainer from 'react-modal-promise';
import { InputText } from 'primereact/inputtext';
import { BsFillPenFill } from 'react-icons/bs';
import createUserModal from '../modals/CreateUserModal';
import updateUserModal from '../modals/UpdateUserModal';
import { createUser, getUsers, updateUser } from '../services/userservice';
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toaster } from 'evergreen-ui'

function Users() {

    const qc = useQueryClient()
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'prenom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_Users']

    const {data: Users, isLoading } = useQuery(qk, () => getUsers());

    const {mutate: create} = useMutation((data) => createUser(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateUser(data._id, data.data), {
        onSuccess: (_) => {
            toaster.success("Mise à jour réussie !!!");
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toaster.danger("Mise à jour échouée !!!");
           }
    })

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Nouveau" className="bg-green-700 mr-2" icon={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateUser()} />
            </>
        )
    }


    const handleUpdateUser = (d) => {
        updateUserModal({User: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateUser = () => {
        createUserModal().then(create);
    }

    const handleViewUser = (id) => {
      navigate(id);
    }

 

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES UTILISATEURS</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Button type="button" onClick={() => handleUpdateUser(rowData)} className="bg-gray-500" icon={<BsFillPenFill className="text-white"/>}></Button>
        <Button type="button" onClick={() => handleViewUser(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button>

        </div>;
        
    }

    const header = renderHeader();

  return (
    <>
      <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
            <div className="card p-4">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={Users} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover
                    filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'prenom']}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column field="prenom" header="Prenom" sortable style={{ minWidth: '14rem' }} />
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} /> 
                    <Column field="role" header="Role" sortable style={{ minWidth: '14rem' }} />
                    <Column field="login" header="Login" sortable style={{ minWidth: '4rem' }} />       
                    <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
       </div>
   </div>
    <ModalContainer />
    </>
  )
}

export default Users