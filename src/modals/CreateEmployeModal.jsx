import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, Modal, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useQuery } from "react-query";
import { getCategories } from "../services/categorieservice";
import { useState } from "react";
import fr from "dayjs/locale/fr";
import { format } from "date-fns";

const schema = yup
  .object({
    prenom: yup.string().required(),
    matricule_de_solde: yup.string(),
    nom: yup.string().required(),
    nci: yup.string().required(),
    npp: yup.string(),
    categorie: yup.string().required(),
    nombre_de_parts: yup.number().required(),
    civilite: yup.string().required(),
    nationalite: yup.string().required(),
    qualification: yup.string().required(),
    genre: yup.string().required(),
    date_de_naissance: yup.string().required(),
    lieu_de_naissance: yup.string(),
    date_de_recrutement: yup.string().required(),
    adresse: yup.string().required(),
    telephone: yup.string(),
    poste: yup.string().required(),
  })
  .required();

function CreateEmployeModal({ isOpen, onResolve, onReject }) {
const [categ,setCateg] = useState([]);
  const defaultValues = {
    prenom: "",
    matricule_de_solde:"",
    nom: "",
    nci: "",
    npp: "",
    categorie: "",
    nombre_de_parts: 1,
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
    type:"CDI"
  };


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const qk = ['get_Categories']

    useQuery(qk, () => getCategories(),{
        onSuccess(data) {
          const nd = data.map(d => ({label:d.code.toString(),value:d._id}));
          setCateg(nd);
        }
    }
    );



  const onCreate = (data) => {
    const { date_de_naissance,date_de_recrutement} = data;
      const nddn = format(new Date(date_de_naissance),"yyyy-MM-dd");
      const nddr = format(new Date(date_de_recrutement),"yyyy-MM-dd");
      onResolve({...data,date_de_naissance:nddn,date_de_recrutement:nddr})
  };

  return (
    <>
    <Modal
        title="CREATION EMPLOYE(E)"
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
                         <DateInput onChange={field.onChange} value={field.value} placeholder="Date de Naissance" label="DATE DE NAISSANCE" error={errors.date_de_naissance && errors.date_de_naissance.message} locale={fr}/>
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
                name="categorie"
                render={({ field }) => (
                  <Select
                    label="CATEGORIE"
                    error={errors.categorie && errors.categorie.message}
                    value={field.value}
                    onChange={field.onChange}
                    data={categ}
                    placeholder="categorie"
                    searchable
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
                 <DateInput onChange={field.onChange} value={field.value} placeholder="Date de Recrutement"
                  label="DATE DE RECRUTEMENT"
                  error={errors.date_de_recrutement && errors.date_de_recrutement.message} locale={fr} />
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
                          name="matricule_de_solde"
                          render={({ field }) => (
                            <TextInput
                              label="MATRICULE DE SOLDE"
                              error={errors.matricule_de_solde && errors.matricule_de_solde.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="matricule de solde"
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
                              placeholder="poste"
                            />
                          )}
                        />
                      </div>
                    
                     
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
                          name="qualification"
                          render={({ field }) => (
                            <TextInput
                              label="QUALIFICATION"
                              error={errors.qualification && errors.qualification.message}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="qualification"
                            />
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
                CREER UN(E) EMPLOYE(E)
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default create(CreateEmployeModal)