import { FilterMatchMode, FilterOperator } from 'primereact/api'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRubrique, getRubriques, removeRubrique, updateRubrique } from '../../services/rubriqueservice';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getSections } from '../../services/sectionservice';
import { confirmPopup } from 'primereact/confirmpopup';

const schema = yup.object({
    libelle: yup.string().required(),
    code:yup.number().required(),
    section: yup.string().required(),
  })
  .required();

function Rubriques() {

  const defaultValues = {
    _id:"",
    libelle: "",
    code: 0,
    section:""
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

const [curRubrique,setCurFontion] = useState(null);
const [opened, {  close,toggle }] = useDisclosure(false);
const [sections,setSections] = useState();
const qc = useQueryClient()
const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'libelle': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
});
const [globalFilterValue, setGlobalFilterValue] = useState('');

const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
}



const qk = ['get_Rubriques'];
const qks = 'get_Sections';

const {isLoadingS} = useQuery(qks,() => getSections(),{
  onSuccess:(s) => {
    const ns = s.map(se => ({label: se.nom,value: se._id}));
    setSections(ns);
  }
})

const {data: Rubriques, isLoading } = useQuery(qk, () => getRubriques());
const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createRubrique(data), {
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

const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateRubrique(data._id, data.data), {
    onSuccess: (_) => {
        notifications.show({
            title: 'MIS A JOUR',
            message: 'Mise à jour réussie !! 🤥',
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

const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) => removeRubrique(id), {
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
            <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateRubrique()}>Nouveau</Button>
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


const handleCreateRubrique = () => {
  setCurFontion(null);
  for(const p in defaultValues){
    setValue(`${p}`,"");
}
   toggle();
}

const handleUpdateRubrique = (row) => {
    setCurFontion(row);
    for(const p in defaultValues){
        setValue(`${p}`,row[p]);
        setValue('section',row.section._id);
    }
    toggle();
}

const handleDeleteRubrique = (event,row) => {
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
            <h5 className="m-0">LISTE DES RUBRIQUES</h5>
                <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
        </div>
    )
}

const actionBodyTemplate = (rowData) => {
    return <div className="flex items-center justify-center space-x-1">
      <IconButton onClick={(event) => handleDeleteRubrique(event,rowData)} icon={<FaTrash className="text-red-500"/>} />
    <IconButton onClick={() => handleUpdateRubrique(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
    {/* <Button type="button" onClick={() => handleViewRubrique(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

    </div>;
    
}

const header = renderHeader();

  return (
    <>
      <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu || isLoadingS || isLoadingde} zIndex={10000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={Rubriques} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['libelle']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="libelle" header="LIBELLE" sortable style={{ minWidth: '10rem' }} />
                 <Column field="code" header="CODE" sortable style={{ minWidth: '10rem' }} />   
                 <Column field="section.nom" header="SECTION" sortable style={{ minWidth: '10rem' }} />   
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curRubrique ? "UPDATE RUBRIQUE" : "CREATION RUBRIQUE"} centered>
   <form onSubmit={curRubrique ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                      <div>
                        <Controller
                          control={control}
                          name="libelle"
                          render={({ field }) => (
                            <TextInput
                              label="LEBELLE"
                              error={errors.libelle && errors.libelle.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="code"
                          render={({ field }) => (
                            <NumberInput
                              label="CODE"
                              error={errors.code && errors.code.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div>
              <Controller
                control={control}
                name="section"
                render={({ field }) => (
                  <Select
                    label="SECTION"
                    error={errors.section && errors.section.message}
                    value={field.value}
                    onChange={field.onChange}
                    data={sections}
                    placeholder="section"
                    searchable
                  />
                )}
              />
            </div>
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curRubrique ? "MODIFIER LA RUBRIQUE" : "CREER LA RUBRIQUE"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
    </>
  )
}

export default Rubriques