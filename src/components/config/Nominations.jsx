import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createNomination, deleteNomination, getNominationByEmploye, toggleStateNomination, updateNomination } from '../../services/nominationservice';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, Select, Switch, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { getFonctions } from '../../services/fonctionservice'
import { DateInput, DatesProvider } from '@mantine/dates'
import 'dayjs/locale/fr';
import { getDivisions } from '../../services/divisionservice'
import { getServiceByDivision } from '../../services/serviceservice'
import { format, parseISO } from 'date-fns'
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';

const schema = yup
  .object({
    date: yup.string().required(),
    description: yup.string(),
    fonction: yup.string().required(),
    division: yup.string().required(),
    service: yup.string().nullable()
  })
  .required();

function Nominations({employe}) {
  const [divis,setDivi] = useState([]);
  const [services,setServices] = useState(null)
    const defaultValues = {
        _id:"",
        date: "",
        employe:"",
        fonction:"",
        division:"",
        service:"",
        description:""
      };
      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
      });

    const [curNomination,setCurNomination] = useState(null);
    const [fonctions,setFonctions] = useState([]);
    const [opened, {  close,toggle }] = useDisclosure(false);
    const qc = useQueryClient()
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const keyF = ["get_Fonctions"];

    const{isLoading: isLoadingF} = useQuery(keyF,() => getFonctions(),{
      onSuccess(data){
       const nf = data.map(d => ({label:d.nom,value: d._id}));
       setFonctions(nf);
      }
    });

    const qkd = ['get_Divisions']

    const {isLoading:isLoadingd } = useQuery(qkd, () => getDivisions(),{
        onSuccess(data) {
          const nd = data.map(d => ({label:d.nom,value:d._id}));
          setDivi(nd);
        }
    });

    const qk = ['get_Services']

    const {mutate: getServices,isLoading:isLoadings } = useMutation((id) => getServiceByDivision(id),{
      onSuccess(data) {
        const nd = data.map(d => ({label:d.nom,value:d._id}));
        setServices(nd);
      }
    });

    const key= ['get_Nomination',employe?._id];

    const {data: Nominations, isLoading } = useQuery(key, () => getNominationByEmploye(employe?._id));

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createNomination(data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'CREATION',
                message: 'Creation reusie !!!',
                color:"green"
              })
         qc.invalidateQueries(key);
         close();
        },
        onError: (_) => {
            notifications.show({
                title: 'CREATION',
                message: 'Creation échouée !!!',
                color:"red"
              })
        }
    })
    const qkat = ['get_AttributionFonctionnelleEmploye',employe?._id]
    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateNomination(data._id, data.data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'MIS A JOUR',
                message: 'Mise à jour réussie !!! 🤥',
                color:"green"
              })
            qc.invalidateQueries(key);
            qc.invalidateQueries(qkat);
            close();
           },
           onError: (_) => {
            notifications.show({
                title: 'MIS A JOUR',
                message: 'Mis a jour échouée !!!',
                color:"red"
              })
           }
    })

    const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) => deleteNomination(id), {
      onSuccess: (_) => {
          notifications.show({
              title: 'SUPPRESSION',
              message: 'Suppression reusie !!!',
              color:"green"
            })
       qc.invalidateQueries(qk);
      },
      onError: (_) => {
          notifications.show({
              title: 'SUPPRESSION',
              message: 'Suppression échouée !!!',
              color:"red"
            })
      }
  });

  const { mutate: toggleState, isLoading: loadingT } = useMutation(
    (data) =>  toggleStateNomination(data._id, data.data),
    {
      onSuccess: (_) => {
        qc.invalidateQueries(key);
        notifications.show({
          title: 'MODIFICATION',
          message: 'ETAT NOMINATION CHANGE !!!',
          color:"green"
        })
      },
      onError: (_) => {
        notifications.show({
          title: 'MODIFICATION',
          message: 'Changement etat échouée !!!',
          color:"red"
        })
      },
    }
  );

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateNomination()}>Nouveau</Button>
            </>
        )
    }


    const onCreate = (data) => {
        const {_id,date,service,...rest} = data;
        const nd = format(new Date(date),"yyyy-MM-dd")
        if(!service){
         create({date: nd,...rest});
      }else {
        create({date: nd,service,...rest});
      } 
    };

    const onUpdate = (data) => {
      const {_id,date,service,description,fonction,division} = data;
      const nd = format(new Date(date),"yyyy-MM-dd")
      if(service === ""){
        update({_id,data: {date:nd,division,description,fonction}});
    }else {
      update({_id,data: {date:nd,division,service,description,fonction}});
    } 
      
     };
  

    const handleCreateNomination = () => {
      setCurNomination(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
    setValue('employe',employe?._id);
       toggle();
    }

    const handleUpdateNomination = (row) => {
        setCurNomination(row);
        for(const p in defaultValues){
            setValue(`${p}`,row[p]);
        }
        setValue('employe',employe?._id);
        setValue("division",row.division._id);
        setValue('fonction',row.fonction._id);
        setValue("service",row?.service?._id ?? '');
        setValue('date',parseISO(row.date))
        toggle();
    }

    const handleDivisionChange = (v,onchange) => {
      setServices(null);
      setValue("service","");
      onchange(v);
      getServices(v);
    }


    const handleDeleteNomination = (event,row) => {
      confirmPopup({
        target: event.currentTarget,
        message: 'Etes vous sure de vouloir supprimer ?',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => supprimer(row._id),
        reject:() => toaster.notify('suppression annule !!')
    });
     }


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES NOMINATIONS</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
           <IconButton onClick={(event) => handleDeleteNomination(event,rowData)} icon={<FaTrash className="text-red-500"/>} />
        <IconButton onClick={() => handleUpdateNomination(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewNomination(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();

    const handleChangeState = (v,id) => {
      const data = {_id: id, data: {est_active : v}};
      toggleState(data);
    };

    const FormatDate = (row) => format(parseISO(row.date),"yyyy-MM-dd");
    const statusTemplate = (row) => <Switch checked={row.est_active} size='xs' onChange={(e) => handleChangeState(e.currentTarget.checked,row._id)} />;


  return (
    <>
      <div className="content-wrapper">
     <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu || isLoadingF || isLoadings || isLoadingd || isLoadingde ||loadingT} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={Nominations} paginator  header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['date']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="date" header="Date" body={FormatDate} sortable style={{ minWidth: '10rem' }} /> 
                 <Column field="fonction.nom" header="Fonction" sortable style={{ minWidth: '10rem' }} />
                 <Column field="division.nom" header="Division" sortable style={{ minWidth: '10rem' }} /> 
                 <Column field="service.nom" header="Service" sortable style={{ minWidth: '10rem' }} /> 
                 <Column field="est_active" header="ACTIVE" body={statusTemplate} sortable style={{ minWidth: '10rem' }} /> 
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curNomination ? "MIS A JOUR NOMINATION" : "CREATION NOMINATION"} size="lg" centered>
   <form onSubmit={curNomination ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                    <div>
                        <Controller control={control} name="date" render={({field}) => (
                          <DatesProvider settings={{ locale: 'fr',timezone: 'UTC' }}>

                           <DateInput valueFormat="YYYY-M-DD" label="DATE" placeholder="Date de la nomination"
                            error={errors.date && errors.date.message}
                            value={field.value} onChange={field.onChange} />
                          </DatesProvider>
                        )} />
                      </div>
                      <div>
                        <Controller control={control} name="fonction" render={({field}) => (
                           <Select label="FONCTION" placeholder="Fonction de la nomination"
                            error={errors.fonction && errors.fonction.message}
                            data={fonctions}
                            value={field.value} onChange={field.onChange} searchable/>
                        )} />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="division"
                          render={({ field }) => (
                            <Select label="DIVISION" placeholder="division"
                            error={errors.division && errors.division.message}
                            data={divis}
                            value={field.value} onChange={(v) => handleDivisionChange(v,field.onChange)} searchable/>
                          )}
                        />
                      </div>
                      {services && <div>
                        <Controller
                          control={control}
                          name="service"
                          render={({ field }) => (
                            <Select label="SERVICE" placeholder="service"
                            error={errors.service && errors.service.message}
                            data={services}
                            value={field.value} onChange={field.onChange} searchable/>
                          )}
                        />
                      </div>}
                      <div>
                        <Controller
                          control={control}
                          name="description"
                          render={({ field }) => (
                            <TextInput
                              label="DESCRIPTION"
                              error={errors.description && errors.description.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                     
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curNomination ? "MODIFIER LA NOMINATION" : "CREER LA NOMINATION"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
<ConfirmPopup />
    </>
  )
}

export default Nominations