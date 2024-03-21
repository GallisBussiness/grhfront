import { useMutation, useQuery, useQueryClient } from "react-query";
import { createDoc, deleteDoc, getDocByEmp, updateDoc } from "../services/docservice";
import { Box, Button, Drawer, Group, LoadingOverlay, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useForm } from '@mantine/form';
import { useCallback, useState } from "react";
import { FileCard, FileUploader, Pane, toaster } from "evergreen-ui";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ConfirmPopup } from 'primereact/confirmpopup';
import { confirmPopup } from 'primereact/confirmpopup';

const schema = yup.object().shape({
    nom: yup.string().min(2, 'Le nom doit avoir plus de 2 lettres'),
    description: yup
      .string(),
    employe: yup
      .string().required(),
  });
  

function Documents({employe}) {
    const [files, setFiles] = useState([])
    const [filesM, setFilesM] = useState([])
    const [docs,setDocs] = useState([]);
    const qc = useQueryClient();
  const [fileRejections, setFileRejections] = useState([])
  const handleChange = useCallback((files) => setFiles([files[0]]), [])
  const handleRejected = useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
  const handleRemove = useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])
  const [fileRejectionsM, setFileRejectionsM] = useState([])
  const handleChangeM = useCallback((files) => setFilesM([files[0]]), [])
  const handleRejectedM = useCallback((fileRejections) => setFileRejectionsM([fileRejections[0]]), [])
  const handleRemoveM = useCallback(() => {
    setFilesM([])
    setFileRejectionsM([])
  }, [])
  const [opened, { open, close }] = useDisclosure(false);
  const [openedM, { open:openM, close:closeM }] = useDisclosure(false);
    const key = ['get_doc',employe?._id];
    const {isLoading} = useQuery(key,() => getDocByEmp(employe?._id),{
        onSuccess:(data) => {
            const nd = data.map(d => {
                const fileName = d.nom;
                const uri =  import.meta.env.VITE_BACKURL + '/uploads/documents/'+ d.chemin;
                const id = d._id;
                return {uri,fileName,id,nom:d.nom,description:d.description};
               });
               setDocs(nd);
        }
    });
    const {mutate,isLoading:enCreation} = useMutation((fd) => createDoc(fd),{
        onSuccess: (d) => {
            toaster.success("Le doc à été bien enrégistré !!");
            close();
            qc.invalidateQueries(key);
        }
    });

    const {mutate:modifier,isLoading:enModification} = useMutation(({id,fd}) => updateDoc(id,fd),{
      onSuccess: (d) => {
          toaster.success("Le doc à été bien modifié !!");
          closeM();
          qc.invalidateQueries(key);
      }
  });

  const {mutate:supprimer,isLoading:enSuppression} = useMutation((id) => deleteDoc(id),{
    onSuccess: (d) => {
        toaster.success("Le doc à été bien supprimé !!");
        qc.invalidateQueries(key);
    }
});
    
    const form = useForm({
        initialValues: {
          nom: '',
          description: '',
          employe: employe?._id,
        },
        validate: yupResolver(schema),
      });

      const formM = useForm({
        initialValues: {
          nom: '',
          description: '',
          employe: employe?._id,
          id:'',
        },
        validate: yupResolver(schema),
      });


      const update = (values) => {
        console.log(values)
        const fd = new FormData();
        fd.append('nom',values.nom);
        fd.append('description',values.description);
        fd.append('employe',values.employe);
        fd.append('doc',filesM[0]);
        modifier({id:values.id,fd});
      }

      const updateDocument = (state) => {
        formM.setValues(state);
        openM();
      }

    const save = (values) => {
        const fd = new FormData();
        fd.append('nom',values.nom);
        fd.append('description',values.description);
        fd.append('employe',values.employe);
        fd.append('doc',files[0]);
        mutate(fd);
    }

    const confirm = (state,event) => {
      confirmPopup({
          target: event.currentTarget,
          message: 'Etes vous sure de vouloir supprimer ?',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept: () => supprimer(state.id),
          reject:() => toaster.notify('suppression annule !!')
      });
  };

    
const MyHeader = (state, previousDocument, nextDocument) => {
  if (!state.currentDocument || state.config?.header?.disableFileName) {
    return null;
  }

  return (
    <>
      <div className="text-lg font-bold">{state.currentDocument.fileName || ""}</div>
      <div className="flex space-x-2">
          
        <Button  onClick={previousDocument} disabled={state.currentFileNo === 0}>
         <FaArrowLeft/> PRECEDANT
        </Button>
        <Button
          onClick={nextDocument}
          disabled={state.currentFileNo >= state.documents.length - 1}
        >
          SUIVANT<FaArrowRight/>
        </Button>
        <Button
          onClick={() => updateDocument(state.currentDocument)}
         bg='orange'
        >
          MODIFIER 
        </Button>
        <Button
          onClick={(event) => confirm(state.currentDocument,event)}
         bg='red'
        >
          SUPPRIMER 
          {/* {state.currentDocument.id} */}
        </Button>
      </div>
    </>
  );
};

  return (
    <>
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    <div className="flex flex-col items-center justify-center">
        <Button bg='cyan' onClick={open}>AJOUTER UN DOCUMENT</Button>
        {docs && <DocViewer  prefetchMethod="GET" documents={docs} pluginRenderers={DocViewerRenderers}  config={{
    header: {
      overrideComponent:MyHeader,
    },
  }} />}
      </div>
    <Drawer opened={opened} onClose={close} title="AJOUT DE DOCUMENT">
    <LoadingOverlay visible={enCreation} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(save)}>
        <TextInput
          withAsterisk
          label="NOM DU DOCUMENT"
          placeholder="nom du document"
          {...form.getInputProps('nom')}
        />

        <Textarea
          withAsterisk
          label="DESCRIPTION DU DOCUMENT"
          placeholder="description du document"
          {...form.getInputProps('description')}
        />

<Pane maxWidth={654}>
      <FileUploader
        label="Uploader Le Document"
        description="You can upload 1 file. File can be up to 50 MB."
        maxSizeInBytes={50 * 1024 ** 2}
        maxFiles={1}
        onChange={handleChange}
        onRejected={handleRejected}
        renderFile={(file) => {
          const { name, size, type } = file
          const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
          const { message } = fileRejection || {}
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          )
        }}
        values={files}
      />
    </Pane>

        <Group justify="flex-end" mt="md">
          <Button type="submit">AJOUTER</Button>
        </Group>
      </form>
    </Box>

    </Drawer>
    <Drawer opened={openedM} onClose={closeM} position="right" title="MODIFICATION DE DOCUMENT">
    <LoadingOverlay visible={enModification} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    <Box maw={340} mx="auto">
      <form onSubmit={formM.onSubmit(update)}>
        <TextInput
          withAsterisk
          label="NOM DU DOCUMENT"
          placeholder="nom du document"
          {...formM.getInputProps('nom')}
        />

        <Textarea
          withAsterisk
          label="DESCRIPTION DU DOCUMENT"
          placeholder="description du document"
          {...formM.getInputProps('description')}
        />

<Pane maxWidth={654}>
      <FileUploader
        label="Uploader Le Document"
        description="You can upload 1 file. File can be up to 50 MB."
        maxSizeInBytes={50 * 1024 ** 2}
        maxFiles={1}
        onChange={handleChangeM}
        onRejected={handleRejectedM}
        renderFile={(file) => {
          const { name, size, type } = file
          const fileRejection = fileRejectionsM.find((fileRejection) => fileRejection.file === file)
          const { message } = fileRejection || {}
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemoveM}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          )
        }}
        values={filesM}
      />
    </Pane>

        <Group justify="flex-end" mt="md">
          <Button type="submit">MODIFIER</Button>
        </Group>
      </form>
    </Box>

    </Drawer>
    <ConfirmPopup />
    </>
  )
}

export default Documents