import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, TextInput } from "@mantine/core";

const schema = yup
  .object({
    nom: yup.string().required(),
  })
  .required();

function CreateSessionModal({ isOpen, onResolve, onReject }) {

      const defaultValues = {
          nom: ""
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
        onResolve(data);
      };
  return (
    <>
     <Dialog
        header="CREATION SESSION"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-1/2"
      >
        <form onSubmit={handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
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
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                CREER UNE SESSION
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default create(CreateSessionModal)