import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createLot, getLots, updateLot } from '../services/lotservice';
import { IconButton } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { DatePicker } from '@mantine/dates';
import fr from 'dayjs/locale/fr'
import { format, parse } from 'date-fns'

const schema = yup
  .object({
    libelle: yup.string().required(),
    range: yup.array().required(),
  })
  .required();

function Lots() {
    const defaultValues = {
        _id:"",
        libelle: "",
        range:[],
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
    
    const [curLot,setCurFontion] = useState(null);
    const [opened, {  close,toggle }] = useDisclosure(false);
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

    const qk = ['get_Lots']

    const {data: Lots, isLoading } = useQuery(qk, () => getLots());

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createLot(data), {
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

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateLot(data._id, data.data), {
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
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateLot()}>Nouveau</Button>
            </>
        )
    }


    const onCreate = (data) => {
        const {_id,range,libelle} = data;
        const [debut,fin] = range.map(r => format(r,"yyyy-MM-dd"));
        
       create({libelle,debut,fin});
    };

    const onUpdate = (data) => {
      const {_id,range,libelle} = data;
      const [debut,fin] = range.map(r => format(r,"yyyy-MM-dd"));
        update({_id,data: {debut,fin,libelle}});
     };
  

    const handleCreateLot = () => {
      setCurFontion(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
       toggle();
    }

    const handleUpdateLot = (row) => {
        setCurFontion(row);
        for(const p in defaultValues){
            setValue(`${p}`,row[p]);
        }
        const debut = parse(row.debut,"yyyy-MM-dd",new Date());
        const fin = parse(row.fin,"yyyy-MM-dd",new Date());
        const range = [debut,fin];
        setValue('range',range);
        toggle();
    }


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES LOTS DE BULLETIN</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton onClick={() => handleUpdateLot(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewLot(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

        </div>;
        
    }

    const header = renderHeader();
  return (
    <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={Lots} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['libelle']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="libelle" header="Libelle" sortable style={{ minWidth: '10rem' }} />
                 <Column field="debut" header="DEBUT" sortable style={{ minWidth: '10rem' }} />
                 <Column field="fin" header="FIN" sortable style={{ minWidth: '10rem' }} />      
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curLot ? "UPDATE LOT" : "CREATION LOT"} centered>
   <form onSubmit={curLot ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-full">
                        <Controller
                          control={control}
                          name="libelle"
                          render={({ field }) => (
                            <TextInput
                              label="LIBELLE"
                              error={errors.libelle && errors.libelle.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="w-11/12 mx-auto">
                        <Controller
                          control={control}
                          name="range"
                          render={({ field }) => (
                            <DatePicker type="range" locale={fr} allowSingleDateInRange value={field.value} onChange={(v) => field.onChange(v)} />
                          )}
                        />
                      </div>
                     
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curLot ? "MODIFIER LOT" : "CREER LOT"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
  )
}

export default Lots