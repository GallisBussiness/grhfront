import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';
import { createStatusTemporaire, getStatusTemporaires, removeStatusTemporaire } from '../../services/statusTemporaire'

const schema = yup
  .object({
    nom: yup.string().required(),
  })
  .required();

function StatusTemporaire() {

    const defaultValues = {
        _id:"",
        nom: ""
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
    
      const [curStatus,setCurStatus] = useState(null);
    const [opened, {  close,toggle }] = useDisclosure(false);
    const qc = useQueryClient()
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

    const qk = ['get_StatusTemporaire']

    const {data: FonctionsTemporaire, isLoading } = useQuery(qk, () => getStatusTemporaires());

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createStatusTemporaire(data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'CREATION',
                message: 'Creation reusie !!!',
                color:"green"
              })
         qc.invalidateQueries(qk);
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

    const {mutate: supprimer,isLoading:isLoadingd} = useMutation((id) => removeStatusTemporaire(id), {
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
  })

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateStatusTemporaire(data._id, data.data), {
        onSuccess: (_) => {
            notifications.show({
                title: 'MIS A JOUR',
                message: 'Mise à jour réussie !!! 🤥',
                color:"green"
              })
            qc.invalidateQueries(qk);
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

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateStatus()}>Nouvelle Fonction Temporaire</Button>
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
  

    const handleCreateStatus = () => {
      setCurStatus(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
       toggle();
    }

    const handleUpdateStatus = (row) => {
        setCurStatus(row);
        for(const p in defaultValues){
            setValue(`${p}`,row[p]);
        }
        toggle();
    }

    const handleDeleteStatus = (event,row) => {
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
                <h5 className="m-0">LISTE DES STATUS TEMPORAIRES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton onClick={(event) => handleDeleteStatus(event,rowData)} icon={<FaTrash className="text-red-500"/>} />
        <IconButton onClick={() => handleUpdateStatus(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewFonction(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();

  return (
    <div className="content-wrapper">
    <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu || isLoadingd} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
      <div className="container-xxl flex-grow-1 container-p-y">
      <div className="datatable-doc">
           <div className="card p-4">
           <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
               <DataTable value={FonctionsTemporaire} paginator className="p-datatable-customers" header={header} rows={10}
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                   dataKey="_id" rowHover
                   filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                   globalFilterFields={['nom']}
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                   <Column field="nom" header="Nom" sortable style={{ minWidth: '10rem' }} />      
                   <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
               </DataTable>
           </div>
       </div>
      </div>
     {/* Modals */}
  
     <Modal opened={opened} onClose={close} title={curStatus ? "UPDATE STATUS TEMPORAIRE" : "CREATION STATUS TEMPORAIRE"} centered>
     <form onSubmit={curStatus ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                        <div>
                          <Controller
                            control={control}
                            name="nom"
                            render={({ field }) => (
                              <TextInput
                                label="NOM"
                                error={errors.nom && errors.nom.message}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
            <div className="flex items-center justify-center">
              <div>
                <Button type="submit"  variant="gradient">
                 {curStatus ? "MODIFIER LA STATUS TEMPORAIRE" : "CREER LA STATUS TEMPORAIRE"}
                </Button>
              </div>
            </div>
          </form>
     </Modal>
     <ConfirmPopup />
  </div>
  )
}

export default StatusTemporaire