import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getFiche } from "../services/ficheservice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, LoadingOverlay } from "@mantine/core";
import { FaPrint } from "react-icons/fa";
import { Pulsar, Table } from "evergreen-ui";
import { useState } from "react";
import  FichePrint  from "./FichePrint";
import { groupBy, keys } from "lodash";
import { format, parseISO } from "date-fns";

function Fiche() {
  const [pres,setP] = useState([]);
  const [kpres,setKpre] = useState([]);
  const [curfiche,setCurfiche] = useState(null);
    const {id} = useParams();
    const key = ["get_fiche",id];
    const {isLoading} = useQuery(key,() => getFiche(id),{
      onSuccess:(_) => {
        setCurfiche(_[0]);
        const grouByEmp = groupBy(_[0].presences,v => v.employe._id);
      setKpre(keys(grouByEmp));
      setP(grouByEmp);
      },
      onError:console.log
    })


    const filterArrive =  (tab) => {
      const p = tab?.find(t => t.type === "ARRIVEE");
      if(p){
         return format(parseISO(p.heure),"H:mm:ss");
      }
      return null;
    }

    const findName =  (tab) => {
      const p = tab?.find(t => t.type === "ARRIVEE" || t.type === "DEPART" );
      if(p){
         return `${p.employe.prenom} ${p.employe.nom}` ;
      }
      return null;
    }

    const findPoste =  (tab) => {
      const p = tab?.find(t => t.type === "ARRIVEE" || t.type === "DEPART" );
      if(p){
         return p.employe.poste ;
      }
      return null;
    }

    const filterDepart =  (tab) => {
      const p = tab?.find(t => t.type === "DEPART");
      if(p){
         return format(parseISO(p.heure),"H:mm:ss");
      }
      return null;
    }

  return (
    <>
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }} />
      {curfiche && <div className="flex flex-col w-11/12 my-5 mx-auto">
              <div className="w-1/3 mx-auto">
                <PDFDownloadLink document={<FichePrint presences={pres} kpres={kpres} fiche={curfiche} />} fileName={`FICHE_PRESENCE_DU_${curfiche?.date}_${curfiche?.ref}`}>
                  <Button className="bg-green-600 w-auto">IMPRIMER LA FICHE <FaPrint/>  <Pulsar /></Button>
                </PDFDownloadLink>
                
              </div>
                
               <div className="text-2xl font-bold p-1 bg-cyan-700 rounded-md my-5 text-center text-white">
              LISTE DES PRESENCES DU {curfiche?.date}
            </div>
            <div>

                <Table>
                <Table.Head>
                <Table.TextHeaderCell>EMPLOYE</Table.TextHeaderCell>
                <Table.TextHeaderCell>POSTE</Table.TextHeaderCell>
                <Table.TextHeaderCell>ARRIVE</Table.TextHeaderCell>
                <Table.TextHeaderCell>DEPART</Table.TextHeaderCell>
                </Table.Head>
                <Table.VirtualBody height={500}>
                {kpres?.map((k,i) => (
                <Table.Row key={i} isSelectable onSelect={() => alert(pres[k][0]?.employe.prenom)}>
                  <Table.TextCell>{findName(pres[k])}</Table.TextCell>
                  <Table.TextCell>{findPoste(pres[k])}</Table.TextCell>
                  <Table.TextCell>{filterArrive(pres[k])}</Table.TextCell>
                  <Table.TextCell>{filterDepart(pres[k])}</Table.TextCell>
                </Table.Row>
                ))}
                </Table.VirtualBody>
                </Table>
                </div>
            </div>}
    </>
  )
}

export default Fiche