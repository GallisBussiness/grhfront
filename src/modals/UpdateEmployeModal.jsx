import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, Radio, TextInput } from "@mantine/core";
import { useMask } from "@react-input/mask";

const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    // nci: yup.string().required(),
    // npp: yup.string().required(),
    // categorie: yup.number().required(),
    // nombre_de_parts: yup.number().required(),
    // civilite: yup.string().required(),
    // nationalite: yup.string().required(),
    // qualification: yup.string().required(),
    genre: yup.string().required(),
    date_de_naissance: yup.string().required(),
    lieu_de_naissance: yup.string().required(),
    date_de_recrutement: yup.string().required(),
    adresse: yup.string().required(),
    telephone: yup.string().required(),
    poste: yup.string().required(),
  })
  .required();


function UpdateEmployeModal({employe, isOpen, onResolve, onReject }) {
  const date_de_naissanceRef = useMask({ mask: '____-__-__', replacement: { _: /\d/ } });
  const date_de_recrutementRef = useMask({ mask: '____-__-__', replacement: { _: /\d/ } });
  const defaultValues = {
    _id: employe?._id,
    prenom:  employe?.prenom,
    nom: employe?.nom,
    // nci: employe?.nci,
    // npp: employe?.npp,
    // categorie: 0,
    // nombre_de_parts: 0,
    // civilite: employe?.civilite,
    // nationalite: employe?.nationalite,
    // qualification: employe?.qualification,
    genre: employe?.genre,
    date_de_naissance: employe?.date_de_recrutement,
    lieu_de_naissance: employe?.lieu_de_naissance,
    date_de_recrutement: employe?.date_de_recrutement,
    adresse: employe?.adresse,
    telephone: employe?.telephone,
    poste: employe?.poste,
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
        header="MODIFICATION EMPLOYE(E)"
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
                      <Controller
                        control={control}
                        name="date_de_naissance"
                        render={({ field }) => (
                          <TextInput value={field.value} onChange={(e) => field.onChange(e.value)} ref={date_de_naissanceRef} label="DATE DE NAISSANCE"  className="w-full" />
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
                            label="LIEU DE NAISSANCE"
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
                            label="ADRESSE"
                            error={errors.adresse && errors.adresse.message}
                            placeholder="Adresse"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="date_de_recrutement"
                        render={({ field }) => (
                            <TextInput value={field.value} onChange={(e) => field.onChange(e.value)} ref={date_de_recrutementRef} label="DATE DE RECRUTEMENT" className="w-full" />
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
                MODIFIER UN(E) EMPLOYE(E)
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default create(UpdateEmployeModal)