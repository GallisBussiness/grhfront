import { useQuery } from "react-query"
import { getNominationByEmploye } from "../services/nominationservice";
import { Button, LoadingOverlay } from "@mantine/core";


function Nomination({employe}) {
    const key= ['get_Nomination',employe];
  const {data,isLoading} = useQuery(key, () => getNominationByEmploye(employe));
  return (
    <>
  <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="flex w-11/12 mx-auto my-2">
      <Button color="green">AJOUTER NOMINATION</Button>
    </div>
    
    </>
  )
}

export default Nomination