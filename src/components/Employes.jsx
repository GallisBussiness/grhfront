import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { InputText } from 'primereact/inputtext'
import { BsFillPenFill } from 'react-icons/bs'
import createEmployeModal from '../modals/CreateEmployeModal'
import updateEmployeModal from '../modals/UpdateEmployeModal'
import { createEmploye, getEmployes, updateEmploye } from '../services/employeservice'
import { FaEye, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IconButton, toaster } from 'evergreen-ui'
import { Button, LoadingOverlay, TextInput, useMantineTheme } from '@mantine/core'

function Employes() {
  const theme = useMantineTheme()
    const [selectedEmployes, setSelectedEmployes] = useState(null);
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

    const qk = ['get_Employes']

    const {data: Employes, isLoading } = useQuery(qk, () => getEmployes());

    const {mutate: create} = useMutation((data) => createEmploye(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            console.log(_);
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateEmploye(data._id, data.data), {
        onSuccess: (_) => {
            toaster.success("Mise à jour réussie !!!");
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            console.log(_);
            toaster.danger("Mise à jour échouée !!!");
           }
    })

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button  variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateEmploye()} >Nouveau</Button>
            </>
        )
    }


    const handleUpdateEmploye = (d) => {
        updateEmployeModal({employe: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateEmploye = () => {
        createEmployeModal().then(create);
    }

    const handleViewEmploye = (id) => {
      navigate('/dashboard/employes/'+id);
    }

 

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES EMPLOYES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton type="button"  onClick={() => handleUpdateEmploye(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        <IconButton type="button"  onClick={() => handleViewEmploye(rowData._id)} icon={<FaEye className="text-blue-500"/>}/>

        </div>;
        
    }

    const header = renderHeader();

    const actifTemplate = (row) => row.is_actif ? <div className="h-3 w-3 rounded-full bg-green-500"></div> : <div className="h-3 w-3 rounded-full bg-red-500"></div>;


  return (
    <>
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
      <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
            <div className="card p-4">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={Employes} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedEmployes} onSelectionChange={e => setSelectedEmployes(e.value)}
                    filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['matricule_de_solde','nom', 'prenom']}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column field="matricule_de_solde" header="MAT SOLDE" sortable style={{ minWidth: '4rem' }} />
                    <Column field="prenom" header="Prenom" sortable style={{ minWidth: '14rem' }} />
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} /> 
                    <Column field="poste" header="POSTE" sortable style={{ minWidth: '14rem' }} />
                    <Column field="is_actif" header="ACTIF" body={actifTemplate} sortable style={{ minWidth: '4rem' }} />       
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

export default Employes