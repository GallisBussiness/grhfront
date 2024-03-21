import { create } from "react-modal-promise";
import { Button, Modal} from "@mantine/core";
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { format } from "date-fns";

const schema = yup.object().shape({
    range: yup.array(yup.date),
  });

function ChooseHebdoModal({ isOpen, onResolve, onReject }) {

    const form = useForm({
        initialValues: {
          range: []
        },
        validate: yupResolver(schema),
      });
    
    
    
      const onCreate = (data) => {
        const {range} = data;
        const start = format(range[0], 'dd/MM/yyyy');
        const end = format(range[1], 'dd/MM/yyyy')
        const mois = start.split('/')[1]
       onResolve({start,end,mois});
      };

  return (
    <>
     <Modal
        header="SELECTIONNEZ UN MOIS"
        opened={isOpen}
        onClose={() => onReject(false)}
        className="w-1/2"
        
      >
        <form onSubmit={form.onSubmit(onCreate)} method="POST" className="flex flex-col space-y-2 ">
        <div>
        <DatePickerInput
         type="range"
        label="DATE DE DEBUT ET DE FIN"
        placeholder="choisissez la date de debut et de fin"
        {...form.getInputProps('range')}
    />       
        </div>
          <div className="flex items-center justify-center">
            <div>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                VALIDER
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default create(ChooseHebdoModal)