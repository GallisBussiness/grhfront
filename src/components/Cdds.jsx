import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { BsFillPenFill } from 'react-icons/bs'
import createCddModal from '../modals/CreateCddModal'
import updateCddModal from '../modals/UpdateCddModal'
import { createEmploye, getCdds, toggleStateEmploye, updateEmploye } from '../services/employeservice'
import { FaEye, FaFilePdf, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IconButton, toaster } from 'evergreen-ui'
import { ActionIcon, Badge, Button, LoadingOverlay, Switch, TextInput } from '@mantine/core'
import { useAppStore } from './app.store'
import { Can } from '../acl/Can'
import { format, intervalToDuration, isBefore} from 'date-fns'

function Cdds() {
    const [selectedCdds, setSelectedCdds] = useState(null);
    const { role } = useAppStore();
    const dt = useRef(null);
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

    const qk = ['get_Cdds']

    const {data: Cdds, isLoading } = useQuery(qk, () => getCdds());

    const {mutate: create} = useMutation((data) => createEmploye(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateEmploye(data._id, data.data), {
        onSuccess: (_) => {
            toaster.success("Mise à jour réussie !!!");
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toaster.danger("Mise à jour échouée !!!");
           }
    });
    const { mutate: toggleState, isLoading: loadingT } = useMutation(
        (data) =>  toggleStateEmploye(data._id, data.data),
        {
          onSuccess: (_) => {
            qc.invalidateQueries(qk);
            toaster.success('ETAT EMPLOYE CHANGE !!!')
          },
          onError: (_) => {
            toaster.danger('Changement etat échouée !!!')
          },
        }
      );


      const cols = [
          { field: 'prenom', header: 'Prenom' },
          { field: 'nom', header: 'Nom' },
          { field: 'poste', header: 'Poste' }
      ];
  
      const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

      const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, Cdds.sort((a,b) => a.nom.toLowerCase() < b.nom.toLowerCase()));
                doc.save('Cdds.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                 <Can I='crud' a={role}>
                 <Button  variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateEmploye()} >Nouveau</Button>
                 </Can>
            </>
        )
    }


    const handleUpdateEmploye = (d) => {
        updateCddModal({emp: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateEmploye = () => {
        createCddModal().then(create);
    }

    const handleViewEmploye = (id) => {
      navigate('/dashboard/employescdd/'+id);
    }

 

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES CDD</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            <ActionIcon onClick={exportPdf} data-pr-tooltip="PDF" >
                <FaFilePdf />
            </ActionIcon>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <Can I='view' a={role}>
        <IconButton type="button"  onClick={() => handleViewEmploye(rowData._id)} icon={<FaEye className="text-blue-500"/>}/>
        </Can>
        <Can I='crud' a={role}>
        <IconButton type="button"  onClick={() => handleUpdateEmploye(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        </Can>
        </div>;
        
    }

    const handleChangeState = (v,id) => {
        const data = {_id: id, data: {is_actif : v}};
        toggleState(data);
      };

    const header = renderHeader();

    const alertState = (months) => {
       if(months > 4){
        return <Badge color='green'/>;
       }
       else if(months >= 0 && months <= 4){
         return <Badge color='orange'/>;
       }
       else {
        return  <Badge color='red'/>;
       }
    }

    // const actifTemplate = (row) => row.is_actif ? <div className="h-3 w-3 rounded-full bg-green-500"></div> : <div className="h-3 w-3 rounded-full bg-red-500"></div>;
    const actifTemplate = (row) => <Switch checked={row.is_actif} size='xs' onChange={(e) => handleChangeState(e.currentTarget.checked,row._id)} />;
    const dateRTemplate = (row) => row.date_de_recrutement ? format(new Date(row.date_de_recrutement),"dd/MM/yyyy") : "";
    const dateFCTemplate = (row) => row.date_de_fin_de_contrat ? format(new Date(row.date_de_fin_de_contrat),"dd/MM/yyyy") : "";
    const alertTemplate = (row) => {
        const intervale = intervalToDuration({start: new Date(row.date_de_recrutement), end: new Date(row.date_de_fin_de_contrat)}).months;
        if( isBefore(new Date(row.date_de_fin_de_contrat),new Date())){
            return  <Badge color='red'/>;
        }
        return alertState(intervale);
    };


  return (
    <>
    <Can I='manage' a={role}>
        <LoadingOverlay visible={isLoading || loadingT} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
      <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
            <div className="card p-4">
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable value={Cdds} paginator className="p-datatable-customers"  ref={dt} header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedCdds} onSelectionChange={e => setSelectedCdds(e.value)}
                    filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'prenom']}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                    <Column field="prenom" header="Prenom" sortable style={{ minWidth: '8rem' }} />
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '8rem' }} /> 
                    <Column field="poste" header="POSTE" sortable style={{ minWidth: '8rem' }} />
                    <Column field="date_de_fin_de_recrutement" header="RECRUTEMENT" body={dateRTemplate} sortable style={{ minWidth: '6rem' }} />
                    <Column field="date_de_fin_de_contrat" header="FIN CONTRAT" body={dateFCTemplate} sortable style={{ minWidth: '6rem' }} />
                    <Column  field='alert' header="ALERT" body={alertTemplate} sortable style={{ minWidth: '6rem' }} />
                    <Column field="is_actif" header="ACTIF" body={actifTemplate} sortable style={{ minWidth: '4rem' }} />       
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

export default Cdds