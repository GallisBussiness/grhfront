import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IconButton, toaster } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, Switch, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaEye, FaSearch, FaTrash } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'
import { DatePicker } from '@mantine/dates';
import fr from 'dayjs/locale/fr'
import { format, parse } from 'date-fns'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { FcRefresh } from 'react-icons/fc'
import CountUp from 'react-countup';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';
import { Tag } from 'primereact/tag';
import { Can } from '../acl/Can'
import { useAppStore } from './app.store'
import { createLotCdd, deleteLotCdd, generateBulletinCdd, getLotsCdd, updateLotCdd } from '../services/lotcddservice'


const schema = yup
  .object({
    libelle: yup.string().required(),
    range: yup.array().required(),
  })
  .required();
  
  function LotsCdd() {
    const [lots,setLots] = useState([]);
    const defaultValues = {
        _id:"",
        libelle: "",
        range:[],
      };
      const [pdf, setPdf] = useState(null);
      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
      });

      const { role } = useAppStore();
    
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

    const qk = ['get_LotsCdd']

    const {isLoading } = useQuery(qk, () => getLotsCdd(),{
      onSuccess:(_) =>{
        if(role === 'csa' || role === 'admin'){
          setLots(_.filter((el)=> el.etat !== 'BROUILLON' ));
          setLots(nl);
        }
        else {
          setLots(_);
        }
      }
    });

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createLotCdd(data), {
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
  
    const {mutate: genBulletin,isLoading:isLoadingG} = useMutation((id) => generateBulletinCdd(id), {
      onSuccess: (_) => {
        const fileName = _.split('/').slice(1).join('-');
       setPdf({uri:`${import.meta.env.VITE_BACKURL}/${_}`,fileName});
      },
      onError: (_) => {
          notifications.show({
              title: 'CREATION',
              message: 'Génération échouée !!!',
              color:"red"
            })
      }
  })

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateLotCdd(data._id, data.data), {
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


    const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) => deleteLotCdd(id), {
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

    const leftToolbarTemplate = () => {
        return (
            <>
            <Can I='crud' a={role}>
          <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateLot()}>Nouveau</Button>
            </Can>
            </>
        )
    }


    const onCreate = (data) => {
        const {range,libelle} = data;
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

    const handleViewLot = (row) => {
      const fileName = `${row._id}-${row.mois}-${row.annee}.pdf`;
      setPdf({uri:`${import.meta.env.VITE_BACKURL}/uploads/bulletins/cdd/${fileName}`,fileName});
  }

    const handleGenerateBulletin = (lot) => {
      genBulletin(lot?._id);
    }


    const handleWaiting1State = (event,lot) => {
        const r  = event.currentTarget.checked;
       confirmPopup({
        target: event.currentTarget,
        message: 'Etes vous sure ?',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () =>  update({_id:lot._id,data: {etat: r ? 'WAITING1': 'BROUILLON'}}),
        reject:() => toaster.notify('action annulé')
    });
      }
  
      const handleWaiting2State = (event,lot) => {
        const r  = event.currentTarget.checked;
        confirmPopup({
         target: event.currentTarget,
         message: 'Etes vous sure ?',
         icon: 'pi pi-exclamation-triangle',
         defaultFocus: 'accept',
         accept: () =>  update({_id:lot._id,data: {etat: r ? 'WAITING2': 'WAITING1'}}),
         reject:() => toaster.notify('action annulé')
     });
       }
  
      const handleValidateState = (event,lot) => {
        const r  = event.currentTarget.checked;
        confirmPopup({
          target: event.currentTarget,
          message: 'Etes vous sure ?',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept: () =>  {
             update({_id:lot._id,data: {etat: r ? 'VALIDE': 'WAITING2'}})
             genBulletin(lot?._id);
          },
          reject:() => toaster.notify('action annulé')
      }
    )}

    const handleDeleteLot = (event,row) => {
      confirmPopup({
        target: event.currentTarget,
        message: 'Etes vous sure ?',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => supprimer(row._id),
        reject:() => toaster.notify('suppression annule !!')
    });
     }



    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES LOTS DE BULLETIN CDD</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
          <Can I='submit1' a={role}>
         {(rowData.etat === "BROUILLON" || rowData.etat === "WAITING1") && <Switch
            checked={rowData.etat === "WAITING1"}
            onChange={(e) => handleWaiting1State(e,rowData)}
          />}
          </Can>
          <Can I='submit2' a={role}>
          {(rowData.etat === "WAITING1" || rowData.etat === "WAITING2") && <Switch
            checked={rowData.etat === "WAITING2"}
            onChange={(ev) => handleWaiting2State(ev,rowData)}
          />}
          </Can>
          <Can I='submit3' a={role}>
          {(rowData.etat === "WAITING2" || rowData.etat === "VALIDE") && <Switch
                      checked={rowData.etat === "VALIDE"}
                      onChange={(event) => handleValidateState(event,rowData)}
                    />}
            </Can>
          
            {(rowData.etat === "BROUILLON") && <div className='flex'>
          <IconButton onClick={() => handleViewLot(rowData)} icon={<FaEye className="text-amber-500"/>} title='voir le bulletins' />
        <Can I='crud' a={role}>
        <IconButton onClick={() => handleGenerateBulletin(rowData)} isLoading={isLoadingG} icon={<FcRefresh className="text-green-500"/>} title='generer les bulletins' />
        <IconButton onClick={() => handleUpdateLot(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} title='modifier' />
        <IconButton onClick={(event) => handleDeleteLot(event,rowData)} isLoading={isLoadingde} icon={<FaTrash className="text-red-500"/>} title='supprimer' />
        </Can></div>}
        {(rowData.etat === "VALIDE") && <div className='flex'>
          <IconButton onClick={() => handleViewLot(rowData)} icon={<FaEye className="text-amber-500"/>} title='voir le bulletins' />
         </div>}
        {(rowData.etat === "WAITING1") && <div className='flex'>
          <IconButton onClick={() => handleViewLot(rowData)} icon={<FaEye className="text-amber-500"/>} title='voir le bulletins' />
      </div>}
        {(rowData.etat === "WAITING2") && <div className='flex'>
          <IconButton onClick={() => handleViewLot(rowData)} icon={<FaEye className="text-amber-500"/>} title='voir le bulletins' />
       </div>}
        </div>;
        
    }

    const getSeverity = (status) => {
        switch (status) {
            case 'BROUILLON':
                return 'danger';
  
            case 'VALIDE':
                return 'success';
  
            case 'WAITING2':
                return 'info';
            case 'WAITING1':
                return 'warn';
        }
    };
  
    const getValueState = (status) => {
      switch (status) {
          case 'BROUILLON':
              return 'BROUILLON';
  
          case 'VALIDE':
              return 'VALIDE';
  
          case 'WAITING2':
              return 'EN VALIDATION...';
          case 'WAITING1':
              return 'EN EXAMEN...';
      }
  };
  
      const statusBodyTemplate = (rowData) => {
        return <Tag value={getValueState(rowData.etat)} severity={getSeverity(rowData.etat)} />;
    };

    const debutTemplate = (row) => row.debut ? format(parse(row.debut,"yyyy-MM-dd",new Date()),"dd-MM-yyyy"): "";
    const finTemplate = (row) => row.fin ? format(parse(row.fin,"yyyy-MM-dd",new Date()),"dd-MM-yyyy"): "";

    const header = renderHeader();
    return (
        <div className="content-wrapper">
  <LoadingOverlay visible={isLoadingc || isLoading || isLoadingu} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
  <LoadingOverlay visible={isLoadingG} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ children:<CountUp end={100} duration={60*2} suffix=' %' /> }} />

    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="datatable-doc">
         <div className="card p-4">
         <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
             <DataTable value={lots} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['libelle']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="libelle" header="Libelle" sortable style={{ minWidth: '10rem' }} />
                 <Column field="debut" header="DEBUT" body={debutTemplate} sortable style={{ minWidth: '10rem' }} />
                 <Column field="fin" header="FIN" body={finTemplate} sortable style={{ minWidth: '10rem' }} />
                 <Column field="etat" header="ETAT" sortable body={statusBodyTemplate} style={{ minWidth: '10rem' }} />      
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curLot ? "UPDATE LOT CDD" : "CREATION LOT CDD"} centered>
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
                            <DatePicker type="range" locale={fr} allowSingleDateInRange value={field.value || []} onChange={(v) => field.onChange(v)} />
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
   <div className="my-5 w-10/12 mx-auto">
      {pdf && <DocViewer prefetchMethod="GET" documents={[
            pdf
          ]} pluginRenderers={DocViewerRenderers} config={{pdfVerticalScrollByDefault:true}} />}
   </div>
  <ConfirmPopup />
</div>
    )
  }
  
  export default LotsCdd