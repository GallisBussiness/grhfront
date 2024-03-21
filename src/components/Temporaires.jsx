import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { BsFillPenFill } from 'react-icons/bs'
import createTemporaireModal from '../modals/CreateTemporaireModal'
import updateTemporaireModal from '../modals/UpdateTemporaireModal'
import { createTemporaire, getTemporaires, updateTemporaire } from '../services/temporaireservice'
import { FaEye, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IconButton, toaster } from 'evergreen-ui'
import { Button, LoadingOverlay, TextInput } from '@mantine/core'
import { Can } from '../acl/Can'
import { useAppStore } from './app.store'

function Temporaires() {
    const [selectedTemporaires, setSelectedTemporaires] = useState(null);
    const qc = useQueryClient()
    const { role } = useAppStore();
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

    const qk = ['get_Temporaires']

    const {data: Temporaires, isLoading } = useQuery(qk, () => getTemporaires());

    const {mutate: create} = useMutation((data) => createTemporaire(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateTemporaire(data._id, data.data), {
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
                <Button  variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateTemporaire()} >Nouveau Temporaire</Button>
            </>
        )
    }


    const handleUpdateTemporaire = (d) => {
        updateTemporaireModal({temp: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateTemporaire = () => {
        createTemporaireModal().then(create);
    }

 

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES TEMPORAIRES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton type="button"  onClick={() => handleUpdateTemporaire(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        </div>;
        
    }

    const header = renderHeader();

  return (
    <>
    <Can I='manage' a={role}>
         <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
      <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
            <div className="card p-4">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={Temporaires} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedTemporaires} onSelectionChange={e => setSelectedTemporaires(e.value)}
                    filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['matricule_de_solde','nom', 'prenom']}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column field="prenom" header="Prenom" sortable style={{ minWidth: '14rem' }} />
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} /> 
                    <Column field="status.nom" header="STATUS" sortable style={{ minWidth: '14rem' }} /> 
                    <Column field="telephone" header="TELEPHONE" sortable style={{ minWidth: '14rem' }} /> 
                    <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
       </div>
   </div>
    <ModalContainer />
    </Can>
    
    </>
  )
}

export default Temporaires