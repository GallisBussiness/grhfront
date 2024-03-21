import {
    Text,
    Group,
    LoadingOverlay,
    Avatar,
    Button,
  } from "@mantine/core";
  import { FaPhone, FaPrint } from "react-icons/fa";
  import TakePhotoModal from "../modals/TakePhotoModal";
  import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import ModalContainer from 'react-modal-promise';
import { useState } from "react";
import { Pane, Tab, Tablist, toaster } from "evergreen-ui";
import { EmployeInfo } from "../third/EmployeInfo";
import { getTemporaire, updateTemporaireProfile } from "../services/temporaireservice";
import { useAppStore } from "./app.store";
import { Can } from "../acl/Can";

function Temporaire() {
    const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['INFOS','BULLETINS','DOCUMENTS'])
    const { id } = useParams();
    const { role } = useAppStore();
  const qc = useQueryClient();
  const key = ["get_", id];
  const { data: employe, isLoading } = useQuery(key, () => getTemporaire(id));
//   const filterArrive =  (tab) => {
//     const p = tab?.find(t => t.type === "ARRIVEE");
//     if(p){
//        return format(parseISO(p.heure),"H:mm:ss");
//     }
//     return null;
//   }

  
//   const filterDepart =  (tab) => {
//     const p = tab?.find(t => t.type === "DEPART");
//     if(p){
//        return format(parseISO(p.heure),"H:mm:ss");
//     }
//     return null;
//   }

//   const {mutate:getFicheByMonth, isLoading: isLoadingByMonth} = useMutation((data) => getByMonthFiche(data),{
//       onSuccess:(fiches) => {
//         const presences = fiches.map(f => ({fiche: f.date, presences:f.presences.filter(p => p.employe._id === id)}));
//         const cpresences = presences.map(p => ({...p,presences: {arrive: filterArrive(p.presences) ?? "",depart: filterDepart(p.presences) ?? ""}}));
//         const cf = cpresences.map(f => {
//           if((f.presences.arrive !== "") && (f.presences.depart !== "")){
//               //calcul des intervales
//               const start = parse(f.presences.arrive,"H:mm:ss",new Date());
//               const pend = parse(f.presences.depart,"H:mm:ss",new Date());
//               const end = pend.getHours() > 13 ? subMinutes(pend,30) : pend;
//               const intervale = intervalToDuration({start, end});
//               return {...f,presences:{...f.presences,time: {heures: intervale.hours,minutes: intervale.minutes}}};
//           }
//           return {...f,presences:{...f.presences,time:{heures: 0,minutes:0}}};
//         })
//         setPresences(cf);
//       },
//       onError: (_) => {
//         toaster.danger(`Une erreur est survenue !`);
//       },
//   })

  const { mutate: update, isLoading: loadingU } = useMutation(
    ({ id, data }) => updateTemporaireProfile(id, data),
    {
      onSuccess: (_) => {
        toaster.success("La photo de profile à été modifié !");
        qc.invalidateQueries(key);
      },
      onError: (_) => {
        toaster.danger(`Une erreur est survenue !`);
      },
    }
  );

  const handleUpdatePhoto = () => {
    TakePhotoModal().then((v) => {
        const fd = new FormData();
        fd.append("profile", v[0]);
        update({ id, data: fd })
  })
  };

//   const handleChooseMonth = () => {
//     ChooseMonthModal().then(data => {
//       const [mois,annee] = data.split('/');
//       setSelectedMonth(data);
//       getFicheByMonth({mois,annee});
//       navigate("fichepresences");
//     });
// }
 
  return (
    <>
    <Can I='manage' a={role}>
      <div className="px-5 py-10 bg-slate-50 w-full">
      <LoadingOverlay visible={loadingU || isLoading } zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }} />
      <div className="flex items-center justify-between w-11/12 mx-auto">
        <Group>
        {employe && <Avatar
          src={`${import.meta.env.VITE_BACKURL}/uploads/profiles/${employe?.profile}`}
          size={94}
          radius="xl"
          onClick={handleUpdatePhoto}
        />}
        <div>
          <Text
            size="lg"
            sx={{ textTransform: "uppercase" }}
            weight={700}
          >
            {employe?.prenom}
          </Text>

          <Text size="lg" weight={500} >
            {employe?.nom}
          </Text>

          <Text size="lg" weight={500} >
            {employe?.matricule_de_solde}
          </Text>


          <Group spacing={10} mt={5}>
            <FaPhone size={16}  />
            <Text size="md">{employe?.telephone}</Text>
          </Group>
        </div>
      </Group>
       <div>
       {/* <Button
          className="bg-orange-500 hover:bg-cyan-700"
          leftSection={<FaPrint />}
          onClick={handleChooseMonth}
        >
          Rapport Presences Mensuel
        </Button> */}
       </div>
      </div>
      
      <div className="w-11/12 my-5 mx-auto">
        <Pane height={120}>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            aria-controls={`panel-${tab}`}
            isSelected={index === selectedIndex}
            key={tab}
            onSelect={() => setSelectedIndex(index)}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} background="tint1" flex="1">
      <Pane
            aria-hidden={selectedIndex !== 0}
            display={selectedIndex === 0 ? 'block' : 'none'}
            role="tabpanel"
          >
            {employe && <EmployeInfo employe={employe}/>}
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 5}
            display={selectedIndex === 5 ? 'block' : 'none'}
            role="tabpanel"
          >
           {/* {employe && <Bulletins employe={employe} />}  */}
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 6}
            display={selectedIndex === 6 ? 'block' : 'none'}
            role="tabpanel"
          >
           {/* {employe && <Documents employe={employe} />}  */}
          </Pane>
      </Pane>
    </Pane>
      </div>
      
    </div>
   
    <ModalContainer />
    </Can>
      
    </>
  )
}

export default Temporaire