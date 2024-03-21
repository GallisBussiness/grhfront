import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createCategorie, getCategories, removeCategorie, updateCategorie } from '../../services/categorieservice';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, NumberInput, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications';
import { confirmPopup } from 'primereact/confirmpopup';

const schema = yup
  .object({
    code: yup.number().required(),
    valeur: yup.number().required(),
  })
  .required();

function Categories() {
    const defaultValues = {
        _id:"",
        code: 0,
        valeur: 0
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

    // const [categ,setCateg] = useState([]);
    
    const [curCategorie,setCurCategorie] = useState(null);
    const [opened, {  close,toggle }] = useDisclosure(false);
    const qc = useQueryClient()
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'code': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const qk = ['get_Categories']

    const {data: Categories, isLoading } = useQuery(qk, () => getCategories());

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createCategorie(data), {
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

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateCategorie(data._id, data.data), {
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
    });


    const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) => removeCategorie(id), {
      onSuccess: (_) => {
          notifications.show({
              title: 'SUPPRESSION',
              message: 'Suppression reussie !!!',
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

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateCategorie()}>Nouveau</Button>
            </>
        )
    }


    const onCreate = (data) => {
          create(data);  
    };

    const onUpdate = (d) => {
        const {_id,...rest} = d;
          update({_id,data: {...rest}});
     };
  

    const handleCreateCategorie = () => {
      setCurCategorie(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
       toggle();
    }

    const handleUpdateCategorie = (row) => {
        setCurCategorie(row);
        for(const p in defaultValues){
            setValue(`${p}`,row[p]);
        }
        toggle();
    }


    const handleDeleteCategorie = (event,row) => {
      confirmPopup({
        target: event.currentTarget,
        message: 'Etes vous sure de supprimer ?',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => supprimer(row._id),
        reject:() => toaster.notify('suppression annule !!')
    });
     }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES CATEGORIES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
           <IconButton onClick={(event) => handleDeleteCategorie(event,rowData)} icon={<FaTrash className="text-red-500"/>} />
        <IconButton onClick={() => handleUpdateCategorie(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewCategorie(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();
  return (
    <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu || isLoadingde} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={Categories} paginator header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['code']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="code" header="CODE" sortable style={{ minWidth: '10rem' }} />
                 <Column field="valeur" header="VALEUR" sortable style={{ minWidth: '10rem' }} />       
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curCategorie ? "UPDATE CATEGORIE" : "CREATION CATEGORIE"} centered>
   <form onSubmit={curCategorie ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                      <div>
                        <Controller
                          control={control}
                          name="code"
                          render={({ field }) => (
                            <NumberInput
                              label="code"
                              error={errors.code && errors.code.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="code"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="valeur"
                          render={({ field }) => (
                            <NumberInput
                            label="valeur"
                            error={errors.valeur && errors.valeur.message}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="valeur"
                          />
                          )}
                        />
                      </div>
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curCategorie ? "MODIFIER LA CATEGORIE" : "CREER LA CATEGORIE"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
  )
}

export default Categories