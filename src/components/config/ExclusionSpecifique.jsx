import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createExclusionSpecifique, deleteExclusionSpecifique, getExclusionSpecifiqueByEmploye, updateExclusionSpecifique } from '../../services/exclusion-specifique';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, Select, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { getRubriques } from '../../services/rubriqueservice'
import { isNumber, isString } from 'lodash'
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';


const schema = yup
  .object({
    rubrique: yup.string().required(),
    employe: yup.string().required(),
    description: yup.string(),
  })
  .required();

  
  function ExclusionSpecifique({employe}) {
    const [rubriques,setRubriques] = useState([]);
    const defaultValues = {
        _id:"",
        rubrique: "",
        description: 0,
        employe: "",
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
    
    const [curExclusionSpecifique,setCurExclusionSpecifique] = useState(null);
    const [opened, { close,toggle }] = useDisclosure(false);
    const qc = useQueryClient()
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'rubrique.libelle': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_ExclusionSpecifiques',employe?._id]
    const qkex = ['get_AttributionGlobaleEmploye',employe?._id]

    const {data: ExclusionSpecifiques, isLoading } = useQuery(qk, () => getExclusionSpecifiqueByEmploye(employe?._id));

    const key = ['get_Rubriques'];

    const {isLoading: isLoadingR} = useQuery(key,() => getRubriques(),{
      onSuccess(data){
        const nd = data.map(d => ({label:`${d.code} ${d.libelle}`,value:d._id}));
        setRubriques(nd);
      }
    })


    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createExclusionSpecifique(data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'CREATION',
                message: 'Creation reusie !!!',
                color:"green"
              })
         qc.invalidateQueries(qk);
         qc.invalidateQueries(qkex);
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

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateExclusionSpecifique(data._id, data.data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'MIS A JOUR',
                message: 'Mise à jour réussie !!! 🤥',
                color:"green"
              })
            qc.invalidateQueries(qk);
            qc.invalidateQueries(qkex);
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

    const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) => deleteExclusionSpecifique(id), {
      onSuccess: (_) => {
          notifications.show({
              title: 'SUPPRESSION',
              message: 'Suppression reusie !!!',
              color:"green"
            })
       qc.invalidateQueries(qk);
       qc.invalidateQueries(qkex);
      },
      onError: (_) => {
          notifications.show({
              title: 'SUPPRESSION',
              message: 'Suppression échouée !!!',
              color:"red"
            })
      }
  })

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateExclusionSpecifique()}>Nouveau</Button>
            </>
        )
    }


    const onCreate = (data) => {
        const {_id,...rest} = data;
       create(rest);
    };

    const onUpdate = (d) => {
        const {_id,...rest} = d;
        update({_id,data: rest});
     };
  

    const handleCreateExclusionSpecifique = () => {
      setCurExclusionSpecifique(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
      setValue('employe',employe?._id);
       toggle();
    }

    const handleUpdateExclusionSpecifique = (row) => {
        setCurExclusionSpecifique(row);
        for(const p in defaultValues){
            if(isString(row[p]) || isNumber(row[p])){
                setValue(`${p}`,row[p]);
            }
            else {
                setValue(`${p}`,row[p]._id);
            }
            
        }
        toggle();
    }

    const handleDeleteExclusion = (event,row) => {
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
                <h5 className="m-0">LISTE DES EXCLUSIONS SPECIFIQUES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
          <IconButton onClick={(event) => handleDeleteExclusion(event,rowData)} icon={<FaTrash className="text-red-500"/>} />
        <IconButton onClick={() => handleUpdateExclusionSpecifique(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewExclusionSpecifique(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();
    return (
      <>
      <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu || isLoadingR || isLoadingde} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={ExclusionSpecifiques} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['fonction.nom','rubrique.libelle']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                  <Column field="rubrique.code" header="CODE" sortable style={{ minWidth: '10rem' }} />
                <Column field="rubrique.libelle" header="RUBRIQUE" sortable style={{ minWidth: '10rem' }} /> 
                 <Column field="description" header="DESCRIPTION" sortable style={{ minWidth: '10rem' }} />      
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curExclusionSpecifique ? "UPDATE EXCLUSION SPECIFIQUE" : "CREATION EXCLUSION SPECIFIQUE"} centered>
   <form onSubmit={curExclusionSpecifique ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                  <div>
                        <Controller control={control} name="rubrique" render={({field}) => (
                           <Select label="RUBRIQUE" className="w-full" placeholder="RUBRIQUE DE L'EXCLUSION"
                            error={errors.rubrique && errors.rubrique.message}
                            data={rubriques}
                            value={field.value} onChange={field.onChange} searchable/>
                        )} />
                      </div>
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
               {curExclusionSpecifique ? "MODIFIER L'EXCLUSION" : "CREER L'EXCLUSION"}
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
  
  export default ExclusionSpecifique