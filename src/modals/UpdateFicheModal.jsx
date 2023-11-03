import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, TextInput} from "@mantine/core";

const schema = yup.object({
    date: yup.string().required(),
    description: yup.string().required()
  })
  .required();


function UpdateFicheModal({ fiche,isOpen, onResolve, onReject}) {
  const defaultValues = {
    _id: fiche?._id,
    date: fiche?.date,
    description: fiche?.description,
    
  };
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onCreate = (data) => {
    const {date} = data;
    const [,mois,annee] = nd.split("/");
    onResolve({...data,date,mois,annee});
  }


  return (
    <>
      <Dialog
        header="Modifier une Fiche"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-8/12"
      >
        <form onSubmit={handleSubmit(onCreate)} method="POST">
          <div className="flex flex-col space-y-2 w-full ">
          <div>
            <h2 className="text-md font-bold"> DATE DE LA FICHE</h2>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <TextInput value={field.value} onChange={field.onChange} label="DATE" />
                )}
              />
            </div>

            <div>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                 <TextInput value={field.value} onChange={field.onChange} label="DESCRIPTION" />
                )}
              />
            </div>
           
            <div className="flex items-center justify-center">
              <Button type="submit" className="bg-green-900 hover:bg-green-900">
                MODIFIER LA FICHE
              </Button>
            </div>
              
            </div>
        </form>
      </Dialog>
    </>
  )
}

export default create(UpdateFicheModal)