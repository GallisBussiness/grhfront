import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, Modal, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import fr from "dayjs/locale/fr";


const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    nci: yup.string().required(),
    npp: yup.string().required(),
    civilite: yup.string().required(),
    nationalite: yup.string().required(),
    genre: yup.string().required(),
    date_de_naissance: yup.string().required(),
    date_de_fin_de_contrat: yup.string().required(),
    lieu_de_naissance: yup.string().required(),
    date_de_recrutement: yup.string().required(),
    adresse: yup.string().required(),
    nombre_de_parts: yup.number(),
    telephone: yup.string().required(),
    poste: yup.string().required(),
    mensualite: yup.number().required(),
  })
  .required();


function UpdateCddModal({ emp,isOpen, onResolve, onReject }) {


  const defaultValues = {
    _id:emp?._id,
    prenom: emp?.prenom,
    nom: emp?.nom,
    nci: emp?.nci,
    npp:emp?.npp,
    poste: emp?.poste,
    civilite: emp?.civilite,
    nationalite: emp?.nationalite,
    genre: emp?.genre,
    date_de_naissance: new Date(emp?.date_de_naissance),
    date_de_fin_de_contrat: new Date(emp?.date_de_fin_de_contrat) ,
    lieu_de_naissance: emp?.lieu_de_naissance,
    date_de_recrutement: new Date(emp?.date_de_recrutement),
    adresse: emp?.adresse,
    nombre_de_parts:emp?.nombre_de_parts,
    telephone: emp?.telephone,
    mensualite:emp?.mensualite,
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
        <Modal
        title="MODIFICATION CDD"
        opened={isOpen}
        onClose={() => onReject(false)}
        size="xl"
        centered
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
                              placeholder="prenom"
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
                              placeholder="nom"
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
                              className="flex space-x-1"
                            >
                              <Radio value="Homme" label="HOMME" />
                              <Radio value="Femme" label="FEMME" />
                            </Radio.Group>
                          )}
                        />
                      </div>
                      <div>
                      <Controller
                        control={control}
                        name="date_de_naissance"
                        render={({ field }) => (
                         <DateInput onChange={field.onChange} value={field.value} placeholder="Date de Naissance" label="DATE DE NAISSANCE" locale={fr}  error={errors.date_de_naissance && errors.date_de_naissance.message}/>
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
                        name="poste"
                        render={({ field }) => (
                          <TextInput
                            value={field.value}
                            onChange={field.onChange}
                            label="POSTE"
                            error={
                              errors.poste && errors.poste.message
                            }
                            placeholder="poste"
                            withAsterisk
                          />
                        )}
                      />
                    </div>
                    
            </div>
            <div className="flex flex-col space-y-1 w-full">
          
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
                 <DateInput onChange={field.onChange} locale={fr} value={field.value} placeholder="Date de Recrutement"
                  label="DATE DE RECRUTEMENT"
                  error={errors.date_de_recrutement && errors.date_de_recrutement.message} />
              )}
            />
          </div>
          <div>
                      <Controller
                        control={control}
                        name="date_de_fin_de_contrat"
                        render={({ field }) => (
                         <DateInput onChange={field.onChange} value={field.value} placeholder="Date de Fin de Contrat" label="DATE DE FIN DE CONTRAT" locale={fr} error={errors.date_de_fin_de_contrat && errors.date_de_fin_de_contrat.message}/>
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
          <div>
              <Controller
                control={control}
                name="nationalite"
                render={({ field }) => (
                  <TextInput
                    label="NATIONALITE"
                    error={errors.nationalite && errors.nationalite.message}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="nationalite"
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="civilite"
                render={({ field }) => (
                  <Select
                    label="CIVILITE"
                    error={errors.civilite && errors.civilite.message}
                    value={field.value}
                    onChange={field.onChange}
                    data={["Marié(e)","Célibataire"]}
                    placeholder="civilite"
                  />
                )}
              />
            </div>
</div>
             <div className="flex flex-col space-y-1 w-full">
            
                     
                      <div>
                        <Controller
                          control={control}
                          name="nci"
                          render={({ field }) => (
                            <TextInput
                              label="NUMERO DE CARTE D'IDENTITE"
                              error={errors.nci && errors.nci.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="numero carte d'identite"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="npp"
                          render={({ field }) => (
                            <TextInput
                              label="NUMERO DE PASSPORT"
                              error={errors.npp && errors.npp.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="numero de passport"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={control}
                          name="mensualite"
                          render={({ field }) => (
                            <NumberInput
                              label="MENSUALITE"
                              error={errors.mensualite && errors.mensualite.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="mensualite"
                            />
                          )}
                        />
                      </div>
                      <div>
                      <Controller
                        control={control}
                        name="date_de_fin_de_contrat"
                        render={({ field }) => (
                          <DateInput onChange={field.onChange} value={field.value} locale={fr} placeholder="Date de fin de contrat"
                          label="DATE DE FIN DE CONTRAT"
                          error={errors.date_de_fin_de_contrat && errors.date_de_fin_de_contrat.message} />
                        )}
                      />
                    </div>
                    <div>
                        <Controller
                          control={control}
                          name="nombre_de_parts"
                          render={({ field }) => (
                            <NumberInput
                              label="NOMBRE DE PARTS"
                              error={errors.nombre_de_parts && errors.nombre_de_parts.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="nombre de parts"
                            />
                          )}
                        />
                      </div>
          </div>
          </div>
         
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                MODIFIER CDD
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default create(UpdateCddModal)