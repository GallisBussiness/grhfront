import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ModalContainer from 'react-modal-promise';
import { BsFillPenFill } from 'react-icons/bs';
import createSessionModal from '../modals/CreateSessionModal';
import updateSessionModal from '../modals/UpdateSessionModal';
import { createSession, getSessions, updateSession } from '../services/sessionservice';
import { FaEye, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IconButton, toaster } from 'evergreen-ui'
import { Button, TextInput } from '@mantine/core'

function Sessions() {
    const qc = useQueryClient()
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'nom': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_Sessions']

    const {data: Sessions, isLoading } = useQuery(qk, () => getSessions());

    const {mutate: create} = useMutation((data) => createSession(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateSession(data._id, data.data), {
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
                <Button variant="gradient" leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateSession()} >Nouveau</Button>
            </>
        )
    }


    const handleUpdateSession = (d) => {
        updateSessionModal({session: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateSession = () => {
        createSessionModal().then(create);
    }

    const handleViewSession = (id) => {
      navigate(id);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES SESSIONS</h5>
                <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton type="button"  onClick={() => handleUpdateSession(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        <IconButton type="button"  onClick={() => handleViewSession(rowData._id)} icon={<FaEye className="text-blue-500"/>}/>

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
                <DataTable value={Sessions} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover
                    filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom']}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} />      
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

export default Sessions