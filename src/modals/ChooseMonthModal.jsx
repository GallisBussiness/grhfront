import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Button} from "@mantine/core";
import { Calendar } from 'primereact/calendar';
import { format } from "date-fns";

const schema = yup
  .object({
    month: yup.date().required(),
  })
  .required();

function ChooseMonthModal({ isOpen, onResolve, onReject }) {

    const defaultValues = {
        month: new Date(),
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
        const {month} = data;
        if(month !== ""){
             const m = format(month,"MM/yyyy");
            onResolve(m);
        }
       
      };

  return (
    <>
     <Dialog
        header="SELECTIONNEZ UN MOIS"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-1/2"
        
      >
        <form onSubmit={handleSubmit(onCreate)} method="POST" className="flex flex-col space-y-2 ">
        <div>
                      <Controller
                        control={control}
                        name="month"
                        render={({ field }) => (
                          <Calendar value={field.value} onChange={(e) => field.onChange(e.value)} showIcon view="month" dateFormat="mm/yy" className="w-full" placeholder="Entrer un mois" />
                        )}
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
      </Dialog>
    </>
  )
}

export default create(ChooseMonthModal)