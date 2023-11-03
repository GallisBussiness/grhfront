import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createAttributionSpecifique, getAttributionSpecifiqueByEmploye, updateAttributionSpecifique } from '../../services/attribution-specifique';
import { IconButton } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { getRubriques } from '../../services/rubriqueservice'
import { isNumber, isString } from 'lodash'


const schema = yup
  .object({
    rubrique: yup.string().required(),
    employe: yup.string().required(),
    valeur_par_defaut: yup.number(),
  })
  .required();

  
  function AttributionSpecifique({employe}) {
    const [rubriques,setRubriques] = useState([]);
    const defaultValues = {
        _id:"",
        rubrique: "",
        valeur_par_defaut: 0,
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
    
    const [curAttributionSpecifique,setCurAttributionSpecifique] = useState(null);
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

    const qk = ['get_AttributionSpecifiques',employe?._id]

    const {data: AttributionSpecifiques, isLoading } = useQuery(qk, () => getAttributionSpecifiqueByEmploye(employe?._id));

    const key = ['get_Rubriques'];

    const {isLoading: isLoadingR} = useQuery(key,() => getRubriques(),{
      onSuccess(data){
        const nd = data.map(d => ({label:d.libelle,value:d._id}));
        setRubriques(nd);
      }
    })


    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createAttributionSpecifique(data), {
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

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateAttributionSpecifique(data._id, data.data), {
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
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateAttributionSpecifique()}>Nouveau</Button>
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
  

    const handleCreateAttributionSpecifique = () => {
      setCurAttributionSpecifique(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
      setValue('employe',employe?._id);
       toggle();
    }

    const handleUpdateAttributionSpecifique = (row) => {
        setCurAttributionSpecifique(row);
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


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES ATTRIBUTIONS SPECIFIQUES</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton onClick={() => handleUpdateAttributionSpecifique(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewAttributionSpecifique(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();
    return (
      <>
      <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={AttributionSpecifiques} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['fonction.nom','rubrique.libelle']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                <Column field="rubrique.libelle" header="RUBRIQUE" sortable style={{ minWidth: '10rem' }} /> 
                 <Column field="valeur_par_defaut" header="VALEUR" sortable style={{ minWidth: '10rem' }} />      
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curAttributionSpecifique ? "UPDATE ATTRIBUTION SPECIFIQUE" : "CREATION ATTRIBUTION SPECIFIQUE"} centered>
   <form onSubmit={curAttributionSpecifique ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                  <div>
                        <Controller control={control} name="rubrique" render={({field}) => (
                           <Select label="RUBRIQUE" className="w-full" placeholder="RUBRIQUE DE L ATTRIBUTION"
                            error={errors.rubrique && errors.rubrique.message}
                            data={rubriques}
                            value={field.value} onChange={field.onChange} searchable/>
                        )} />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="valeur_par_defaut"
                          render={({ field }) => (
                            <NumberInput
                              label="VALEUR PAR DEFAULT"
                              error={errors.valeur_par_defaut && errors.valeur_par_defaut.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                   
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curAttributionSpecifique ? "MODIFIER L'ATTRIBUTION" : "CREER L'ATTRIBUTION"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
      
      </>
    )
  }
  
  export default AttributionSpecifique