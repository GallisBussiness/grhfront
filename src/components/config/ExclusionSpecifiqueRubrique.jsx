import { LoadingOverlay, ScrollArea } from '@mantine/core';
import { format } from 'date-fns';
import { Button } from 'evergreen-ui';
import { DataTable } from 'mantine-datatable';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useState } from 'react'
import { notifications } from '@mantine/notifications';
import { useMutation,useQueryClient } from 'react-query';
import { deleteExclusionSpecifique } from '../../services/exclusion-specifique';
import { useNavigate } from 'react-router-dom';


function ExclusionSpecifiqueRubrique({data}) {

    const [selectedRecords, setSelectedRecords] = useState([]);
    const qc = useQueryClient();
    const navigate = useNavigate();
    const qk = ['get_AT']
    const columns = [
        { accessor: 'createdAt',render: ({createdAt}) => format(createdAt,'dd/MM/yyyy'), width: '20%', textAlign: 'right' },
        { accessor:'employe.prenom', width: '40%' },
        { accessor: 'employe.nom', width: '20%' },
        { accessor: 'employe.matricule_de_solde', width: 160 },
      ];

      const {mutate: supprimer,isLoading:isLoadingde} = useMutation((id) =>  deleteExclusionSpecifique(id), {
        onSuccess: (_) => {
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

      const handleDeleteAttribution = (event) => {
        confirmPopup({
          target: event.currentTarget,
          message: 'Etes vous sure de supprimer ?',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept: () => {
            for(let i=0;i<selectedRecords.length;i++) {
                supprimer(selectedRecords[i]._id);
            }
            notifications.show({
                title: 'SUPPRESSION',
                message: 'Suppression reussie !!!',
                color:"green"
              })
              navigate('/')
          },
          reject:() => toaster.notify('suppression annule !!')
      });
       }

  return (
    <>
    <LoadingOverlay visible={isLoadingde} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
       <ScrollArea h={350}>
       <DataTable
         striped
         highlightOnHover
         withTableBorder
         withColumnBorders
         records={data}
         backgroundColor="#eafcee"
         idAccessor="_id"
         columns={columns}
         selectedRecords={selectedRecords}
         onSelectedRecordsChange={setSelectedRecords}
       />
   </ScrollArea>
   <div className="w-3/12 mx-auto my-10">
   <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={(ev) => handleDeleteAttribution(ev)}>
       SUPPRIMER {selectedRecords.length} enregistrement(s)
   </Button>
   </div>
   <ConfirmPopup />
     </>
  )
}

export default ExclusionSpecifiqueRubrique