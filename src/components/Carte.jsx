import Recto from './Recto'
import { PDFViewer } from '@react-pdf/renderer'
import Verso from './Verso'
import QRGenerator from './QrCodeGenerator'
import { TextInput, toaster } from 'evergreen-ui'
import { useState } from 'react'
import { Button, LoadingOverlay } from '@mantine/core'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { getEmpByMat } from '../services/employeservice'

function Carte() {
const [mat,setMat] = useState("");
const [user, setUser] = useState(null);
const key = ["get_User",mat];
const navigate = useNavigate();
const {mutate,isLoading} = useMutation(key, () => getEmpByMat(mat),{
    onSuccess:(data) => {
        if(data) {
          setUser(data);  
        }
        else {
            toaster.danger("Employe non trouvé !!!");
        }
        
    },
    onError: (err) => {
        toaster.danger(`Une erreur est survenue!!!`);
    }
});

const handleSearch = () => mutate(mat);

  return (
     <>
     <LoadingOverlay visible={isLoading} overlayBlur={1} />
     <div className="flex items-center justify-center space-x-2 w-1/3 mx-auto my-5 p-5">
           <Button className="bg-orange-500 hover:bg-orange-800" onClick={() => navigate("/")}>FICHES</Button>
            <TextInput value={mat} onChange={(e) => setMat(e.target.value)} />
            <Button className="bg-cyan-500 hover:bg-cyan-800" loading={isLoading} onClick={() => handleSearch()}>RECHERCHER EMPLOYE</Button>
    </div>
    {user ? 
    <>
     <div className="hidden">
      <QRGenerator value={user?.code} documentId="qrcode" />
    </div>
    <div className="flex items-center justify-evenly">
        <PDFViewer width={400} height={400}>
       <Recto user={user}/>
    </PDFViewer>
    <PDFViewer width={400} height={400}>
       <Verso />
    </PDFViewer>
    </div>
    </>
     : 
        <div className="flex flex-col items-center justify-center w-2/3 mx-auto">
           <img src="/employe.png" className="h-96 object-cover" />
            <div className="text-2xl font-semibold">
              VEUILLEZ ENTRER LE NUMERO DE CNI
            </div>
            </div>
             }
    
    </>
  )
}

export default Carte