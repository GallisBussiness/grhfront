import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, Radio, TextInput } from "@mantine/core";
import { Calendar } from 'primereact/calendar';

const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    nci: yup.string().required(),
    npp: yup.string().required(),
    categorie: yup.number().required(),
    nombre_de_parts: yup.number().required(),
    civilite: yup.string().required(),
    nationalite: yup.string().required(),
    qualification: yup.string().required(),
    genre: yup.string().required(),
    date_de_naissance: yup.string().required(),
    lieu_de_naissance: yup.string().required(),
    date_de_recrutement: yup.string().required(),
    adresse: yup.string().required(),
    telephone: yup.string().required(),
    poste: yup.string().required(),
  })
  .required();

function CreateEmployeModal({ isOpen, onResolve, onReject }) {

  const defaultValues = {
    prenom: "",
    nom: "",
    nci: "",
    npp: "",
    categorie: 0,
    nombre_de_parts: 0,
    civilite: "",
    nationalite: "",
    qualification: "",
    genre: "",
    date_de_naissance: "",
    lieu_de_naissance: "",
    date_de_recrutement: "",
    adresse: "",
    telephone: "",
    poste: "",
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
        header="CREATION EMPLOYE(E)"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-1/2"
      >
        <form onSubmit={handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2">
          <div className="flex space-x-1 w-full">
             <div className="flex flex-col space-y-1 w-full">
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
                          name="poste"
                          render={({ field }) => (
                            <TextInput
                              label="POSTE"
                              error={errors.poste && errors.poste.message}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    
                      <div>
                        <Controller
                          control={control}
                          name="genre"
                          render={({ field }) => (
                            <Radio.Group
                              value={field.value}
                              onChange={field.onChange}
                              name="genre"
                              error={errors.sexe && errors.sexe.message}
                              label="GENRE"
                              withAsterisk
                              className="flex flex-col space-y-1"
                            >
                              <Radio value="Homme" label="HOMME" />
                              <Radio value="Femme" label="FEMME" />
                            </Radio.Group>
                          )}
                        />
                      </div>
          </div>
          <div className="flex flex-col space-y-1 w-full">
          <div>
          <h5 className="text-sm font-bold">DATE DE NAISSANCE</h5>
                      <Controller
                        control={control}
                        name="date_de_naissance"
                        render={({ field }) => (
                          <Calendar value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="dd/mm/yy" className="w-full" />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="lieu_de_naissance"
                        render={({ field }) => (
                          <TextInput
                            value={field.value}
                            onChange={field.onChange}
                            label="Lieu de Naissance"
                            error={
                              errors.lieu_de_naissance && errors.lieu_de_naissance.message
                            }
                            placeholder="Lieu de Naissance"
                            withAsterisk
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="adresse"
                        render={({ field }) => (
                          <TextInput
                            value={field.value}
                            onChange={field.onChange}
                            label="Adresse"
                            error={errors.adresse && errors.adresse.message}
                            placeholder="Adresse"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold">DATE DE RECRUTEMENT</h5>
                      <Controller
                        control={control}
                        name="date_de_recrutement"
                        render={({ field }) => (
                            <Calendar value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="dd/mm/yy"className="w-full" />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="telephone"
                        render={({ field }) => (
                          <TextInput
                            value={field.value}
                            onChange={field.onChange}
                            label="TELEPHONE"
                            error={errors.telephone && errors.telephone.message}
                            placeholder="TELEPHONE"
                          />
                        )}
                      />
                    </div>
        </div>
          </div>
         
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                CREER UN(E) EMPLOYE(E)
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default create(CreateEmployeModal)