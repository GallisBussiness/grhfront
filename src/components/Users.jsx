import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import {  useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createUser, getUsers, updateUser } from '../services/userservice';
import { IconButton } from 'evergreen-ui'
import { useDisclosure } from '@mantine/hooks'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, LoadingOverlay, Modal, PasswordInput, Select, TextInput } from '@mantine/core'
import { BsFillPenFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { notifications } from '@mantine/notifications'

const schema = yup
  .object({
    prenom:yup.string().required(),
    nom: yup.string().required(),
    login: yup.string().required(),
    password: yup.string().required(),
    role: yup.string().required(),
  })
  .required();

function Users() {
    const defaultValues = {
        _id:"",
        prenom:"",
        nom: "",
        login:"",
        password:"",
        role:"",
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
    
    const [curUser,setCurFontion] = useState(null);
    const [opened, {  close,toggle }] = useDisclosure(false);
    const qc = useQueryClient()
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    const qk = ['get_Users']

    const {data: Users, isLoading } = useQuery(qk, () => getUsers());

    const {mutate: create,isLoading:isLoadingc} = useMutation((data) => createUser(data), {
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

    const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateUser(data._id, data.data), {
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
                <Button variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateUser()}>Nouveau</Button>
            </>
        )
    }


    const onCreate = (data) => {
        const {_id,...rest} = data;
       create(rest);
    };

    const onUpdate = (d) => {
        const {_id,password,...rest} = d;
        update({_id,data: rest});
     };
  

    const handleCreateUser = () => {
      setCurFontion(null);
      for(const p in defaultValues){
        setValue(`${p}`,"");
    }
       toggle();
    }

    const handleUpdateUser = (row) => {
        setCurFontion(row);
        for(const p in defaultValues){
            setValue(`${p}`,row[p]);
        }
        toggle();
    }


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">LISTE DES UTILISATEURS</h5>
                    <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <IconButton onClick={() => handleUpdateUser(rowData)} icon={<BsFillPenFill className="text-blue-500"/>} />
        {/* <Button type="button" onClick={() => handleViewUser(rowData._id)} className="bg-gray-500" icon={<FaEye className="text-white"/>}></Button> */}

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
             <DataTable value={Users} paginator className="p-datatable-customers" header={header} rows={10}
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                 dataKey="_id" rowHover
                 filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
                 globalFilterFields={['prenom','nom']}
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="prenom" header="Prenom" sortable style={{ minWidth: '10rem' }} />
                 <Column field="nom" header="Nom" sortable style={{ minWidth: '5rem' }} /> 
                 <Column field="login" header="Login" sortable style={{ minWidth: '10rem' }} />
                 <Column field="role" header="Role" sortable style={{ minWidth: '10rem' }} />     
                 <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
             </DataTable>
         </div>
     </div>
    </div>
   {/* Modals */}

   <Modal opened={opened} onClose={close} title={curUser ? "UPDATE UTILISATEUR" : "CREATION UTILISATEUR"} centered>
   <form onSubmit={curUser ? handleSubmit(onUpdate) : handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
                      <div>
                        <Controller
                          control={control}
                          name="prenom"
                          render={({ field }) => (
                            <TextInput
                              label="PRENOM"
                              error={errors.prenom && errors.prenom.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
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
                      <div>
                        <Controller
                          control={control}
                          name="login"
                          render={({ field }) => (
                            <TextInput
                              label="LOGIN"
                              error={errors.login && errors.login.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="password"
                          render={({ field }) => (
                            <PasswordInput
                              label="MOT DE PASSE"
                              error={errors.password && errors.password.message}
                              value={field.value}
                              onChange={field.onChange}
                              disabled={curUser}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="role"
                          render={({ field }) => (
                            <Select
                              label="ROLE"
                              error={errors.role && errors.role.message}
                              data={[{label:'Utilisateur',value:'user'},{label:'Administrateur',value:'admin'}]}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit"  variant="gradient">
               {curUser ? "MODIFIER UTILISATEUR" : "CREER UTILISATEUR"}
              </Button>
            </div>
          </div>
        </form>
   </Modal>
</div>
  )
}

export default Users