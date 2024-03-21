import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button, Modal, NumberInput, Radio, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useQuery } from "react-query";
import { useState } from "react";
import fr from "dayjs/locale/fr";
import { getStatusTemporaires } from "../services/statusTemporaire";

const schema = yup
  .object({
    prenom: yup.string().required(),
    nom: yup.string().required(),
    nci: yup.string().required(),
    genre: yup.string().required(),
    status: yup.string().required(),
    mensualite: yup.number().required(),
  })
  .required();

   const CreateTemporaireModal = ({ isOpen, onResolve, onReject }) =>{
    const [status,setStatus] = useState([]);
  const defaultValues = {
    prenom: "",
    nom: "",
    nci: "",
    status: "",
    genre: "",
    mensualite:0,
  };


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const qk = ['get_StatusTemporaire']

    useQuery(qk, () => getStatusTemporaires(),{
        onSuccess(data) {
          const nd = data.map(d => ({label:d.nom,value:d._id}));
          setStatus(nd);
        }
    }
    );



  const onCreate = (data) => {
    onResolve(data);
  };
    return (
      <>
        <Modal
        title="CREATION TEMPORAIRE"
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
                name="status"
                render={({ field }) => (
                  <Select
                    label="STATUS"
                    error={errors.status && errors.status.message}
                    value={field.value}
                    onChange={field.onChange}
                    data={status}
                    placeholder="status temporaire"
                    searchable
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
                
          </div>
          </div>
         
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                CREER TEMPORAIRE
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      </>
    )
  }
  
  export default create(CreateTemporaireModal)