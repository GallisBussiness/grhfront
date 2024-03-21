import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom"
import { getLot, updateLot } from "../services/lotservice";
import { useState } from "react";
import { ActionIcon, Drawer, LoadingOverlay, ScrollArea, Switch, Text, TextInput, rem } from "@mantine/core";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useForm } from "@mantine/form";
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useAuthUser } from "react-auth-kit";
import { getCommentairesByLot,deleteCommentaire, createCommentaire } from "../services/commentaire-service";
import { App, Divider, Popconfirm,Button as Buttond, FloatButton } from "antd";
import { FaArrowRight, FaComment, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";
import { useDisclosure } from "@mantine/hooks";
import { toaster } from "evergreen-ui";
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';
import { notifications } from "@mantine/notifications";
import { useAppStore } from "./app.store";

const schemaCom = yup.object().shape({
    contenu: yup.string().min(3,'minimun 3 caractères svp!').required('Invalid contenu'),
    lot: yup.string().required('Lot Invalide'),
    auteur: yup.string().min(3,'minimun 3 caractères svp!').required('Engagement Invalide')
  });
  

function LotCdi() {
    const {id} = useParams();
    const auth =  useAuthUser()();
    const [opened, { open, close }] = useDisclosure(false);
    const {message} = App.useApp();
    const { role } = useAppStore();
    const qc = useQueryClient();
    const formCom = useForm({
        initialValues:{
         contenu:'',
         lot: id,
         auteur: auth?.id,
        },
        validate: yupResolver(schemaCom),
      });
    const [fileName,setFileName] = useState(null);
    const key= ['get_lotcdi',id];
    const keyCom = ['get_Commentaires',id];
    const {data:lot,isLoading} = useQuery(key,() => getLot(id),{
        onSuccess:(_) => {
             const fileName = `${_._id}-${_.mois}-${_.annee}.pdf`;
      setFileName({uri:`${import.meta.env.VITE_BACKURL}/uploads/bulletins/${fileName}`,fileName});
        }
    });

const {data: commentaires,isLoading: loadingCom} = useQuery(keyCom,() => getCommentairesByLot(id));
const {mutate:createCom,isLoading:loadingCreateCom} = useMutation((data) => createCommentaire(data),{
    onSuccess:(_) => {
      message.success("Enregistrement du commentaire effectué");
      qc.invalidateQueries(keyCom);
      formCom.reset()
    }
  });

  const {mutate: update,isLoading: isLoadingu} = useMutation((data) => updateLot(data._id, data.data), {
    onSuccess: (_) => {
        notifications.show({
            title: 'MIS A JOUR',
            message: 'Mise à jour réussie !!! 🤥',
            color:"green"
          })
        qc.invalidateQueries(key);
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

  const {mutate:delCom,isLoading:loadingDeleteCommentaire} = useMutation((id) => deleteCommentaire(id),{
    onSuccess:(_) => {
        message.success("Le Commentaire  a été supprimé!");
        qc.invalidateQueries(keyCom);
    },
    onError:(_) => {
    message.error('Erreur de Suppression');
    }
  });

  const createComment = (values) => {
    createCom(values);
}

const confirmDelCom = (id) => {
    delCom(id)
  };

  const cancel = () => {
    message.info("L'action a été annulé !");
  };

  const handlePublish = (event) => {
    const r  = event.currentTarget.checked;
    confirmPopup({
      target: event.currentTarget,
      message: 'vous etes sur de publier?',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () =>   {
           update({_id:lot._id,data: {isPublished: r}})
        },
      reject:() => toaster.notify('action annulé')
  }
)
  }

  return (
    <>
     <LoadingOverlay visible={isLoading || loadingCom || isLoadingu} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
  <div className="flex flex-col space-y-5">
  {(lot?.etat === "VALIDE") && (role === 'csa') && <div className="my-5 p-4 flex items-end justify-between mx-40 bg-green-300 rounded-md">
       <Text fw="bold">PUBLIER LES BULLETINS SUR L'APPICATION MOBILE </Text> 
        <Switch
          title="Publier les bulletins"
          size="lg"
          onLabel={<FaEye className='w-4 h-4 text-blue-500'/>} offLabel={<FaEyeSlash className='w-4 h-4'/>}
            checked={lot.isPublished}
            onChange={handlePublish}
          />
      </div>}
     {fileName && <DocViewer prefetchMethod="GET" documents={[
            fileName
          ]} pluginRenderers={DocViewerRenderers} config={{pdfVerticalScrollByDefault:true}} />}
    
    </div>
    <Drawer opened={opened} onClose={close} title="LES COMMENTAIRES">
    <LoadingOverlay visible={loadingCreateCom || loadingDeleteCommentaire} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="w-full">
        <div className="p-2 font-semibold bg-blue-400 text-white text-md rounded-md mb-2">COMMENTAIRES</div>
        {/* <!-- Chat Bubble --> */}
      <ScrollArea h={300}>
        <ul className="space-y-3">
  {/* <!-- Chat --> */}
  {commentaires?.map((c) => (
    <li key={c._id} className={c.auteur._id === auth?.id ? "max-w-lg flex gap-x-2 sm:gap-x-4 justify-end text-wrap" : "max-w-lg flex gap-x-2 sm:gap-x-4 text-wrap"}>
    {/* <!-- Card --> */}
    <div className={c.auteur._id === auth?.id ? "bg-blue-200 border border-blue-200 rounded-2xl p-2 space-y-2 dark:bg-slate-900 dark:border-gray-700":
  "bg-white border border-blue-200 rounded-2xl p-2 space-y-2 dark:bg-slate-900 dark:border-gray-700"
  }>
      <div className="font-semibold text-sm text-gray-800 dark:text-white max-w-96 break-words">
       {c.contenu}
      </div>
      <Divider/>
      <div className="flex items-center space-x-2">
        <Text size="xs"  c="dimmed" className="text-gray-800 dark:text-white">
         {format(parseISO(c.createdAt),'dd/MMMM/yyyy H:m:s',{locale: fr})} par {`${c.auteur.prenom}  ${c.auteur.nom}`}
        </Text>
        {c.auteur._id === auth?.id && <Popconfirm
        title="Suppression"
        description="Etes vous sure de supprimer?"
        onConfirm={() => confirmDelCom(c._id)}
        onCancel={() => cancel()}
        okText="Confirmer"
        okButtonProps={{className: "bg-blue-500"}}
        cancelButtonProps={{className: "bg-red-500"}}
        cancelText="Annuler"
      >
        <Buttond
          type="primary"
          icon={<FaTrash className="text-red-500"/>}
          loading={loadingDeleteCommentaire}
        />
        </Popconfirm>}
      </div>
    </div>
    {/* <!-- End Card --> */}
  </li>
  ))}

  {/* <!-- End Chat Bubble --> */}
</ul>
      </ScrollArea>

{/* <!-- End Chat Bubble --> */}
<div className="my-10 mx-5">
      <form  onSubmit={formCom.onSubmit(createComment)}>
      <TextInput
      radius="xl"
      size="md"
      {...formCom.getInputProps('contenu')}
      placeholder="Entrer votre commentaire..."
      rightSectionWidth={42}
      leftSection={<FaComment style={{ width: rem(18), height: rem(18) }}/>}
      rightSection={
        <ActionIcon type="submit" size={32} radius="xl" color='blue' variant="filled">
          <FaArrowRight style={{ width: rem(18), height: rem(18) }}/>
        </ActionIcon>
      }
    />
      </form>
      
</div>

        </div>
      </Drawer>
    <FloatButton tooltip={<div>Commentaires</div>} onClick={open}/>
    <ConfirmPopup />
    </>
    
  )
}

export default LotCdi