import { PDFDownloadLink } from "@react-pdf/renderer";
import FicheMonthPrint from "./FicheMonthPrint"
import { Button, LoadingOverlay } from "@mantine/core";
import { FaPrint } from "react-icons/fa";
import { Pulsar, Table } from "evergreen-ui";
import { useAppStore } from "./app.store";
import { useQuery } from "react-query";
import { getEmploye } from "../services/employeservice";
import { useParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Can } from "../acl/Can";


function FicheMonth() {

    const { id } = useParams();
  const key = ["get_employe", id];
  const { role } = useAppStore();
  const { data: employe, isLoading } = useQuery(key, () => getEmploye(id));

  const presences = useAppStore((state) => state.presences);
  const selectedMonth = useAppStore((state) => state.selectedMonth);



  return (
    <>
    <Can I='manage' a={role}>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }} />
      <div className="flex flex-col w-11/12 my-5 mx-auto">
              <div className="w-1/3 mx-auto">
                <PDFDownloadLink document={<FicheMonthPrint presences={presences} selectedMonth={selectedMonth} employe={employe} />} fileName={`FICHE_PRESENCE_MENSUEL`}>
                  <Button className="bg-green-600 w-auto">IMPRIMER LA FICHE <FaPrint/>  <Pulsar /></Button>
                </PDFDownloadLink>
                
              </div>
                
               <div className="text-2xl font-bold p-1 bg-cyan-700 rounded-md my-5 text-center text-white">
              LISTE DES PRESENCES DE {format(parse(selectedMonth,"MM/yyyy",new Date()),"MMMM/yyyy",{locale:fr})} {`${employe?.prenom} ${employe?.nom}, ${employe?.poste}`}
            </div>
            <div>

                <Table>
                <Table.Head>
                <Table.TextHeaderCell>DATE</Table.TextHeaderCell>
                <Table.TextHeaderCell>ARRIVE</Table.TextHeaderCell>
                <Table.TextHeaderCell>DEPART</Table.TextHeaderCell>
                <Table.TextHeaderCell>DUREE</Table.TextHeaderCell>
                </Table.Head>
                <Table.VirtualBody height={500}>
                {presences?.map((p,i) => (
                <Table.Row key={i} isSelectable onSelect={() => alert(p.fiche)}>
                  <Table.TextCell>{p.fiche}</Table.TextCell>
                  <Table.TextCell>{p.presences.arrive}</Table.TextCell>
                  <Table.TextCell>{p.presences.depart}</Table.TextCell>
                  <Table.TextCell>{`${p.presences.time.heures} heure(s) ${p.presences.time.minutes} minutes`}</Table.TextCell>
                </Table.Row>
                ))}
                </Table.VirtualBody>
                </Table>
                </div>
            </div>
    </Can>
    
    </>
  )
}

export default FicheMonth