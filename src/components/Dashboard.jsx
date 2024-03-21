import { Link, Route, Routes, useNavigate} from "react-router-dom"
import { FaBook, FaSignOutAlt, FaUnlock, FaUserCircle, FaUserCog, FaUsers} from 'react-icons/fa';
import { FcOvertime } from "react-icons/fc"
import { PiGearSixDuotone } from "react-icons/pi";
import { GiNotebook, GiPapers } from 'react-icons/gi';
import { SiBookstack } from 'react-icons/si';
import { useMemo, useState } from "react";
import Fiches from "./Fiches";
import Fiche from "./Fiche";
import Employes from "./Employes";
import Employe from "./Employe";
import FicheMonth from "./FicheMonth";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useQuery, useQueryClient } from "react-query";
import { getAuth } from "../services/authservice";
import ChangePassword from "./ChangePassword";
import Users from "./Users";
import { Pane, Tab, Tablist } from "evergreen-ui";
import { useDisclosure } from "@mantine/hooks";
import {Accordion, Button, Modal, ScrollArea } from "@mantine/core";
import Fonctions from "./config/Fonctions";
import Rubriques from "./config/Rubriques";
import Attributionglobales from "./config/AttributionGlobale";
import AttributionFonctionnelle from "./config/AttributionFonctionnelle";
import Divisions from "./config/Divisions";
import Services from "./config/Services";
import Lots from "./Lots";
import Categories from "./config/Categories";
import Temporaires from "./Temporaires";
import { Can } from "../acl/Can";
import { useAppStore } from "./app.store";
import LotsCdd from "./LotsCdd";
import Cdds from "./Cdds";
import Cdd from "./Cdd";
import StatusTemporaire from "./config/StatusTemporaire";
import LotsTemporaire from "./LotsTemporaire";
import LotCdi from "./LotCdi";



function Dashboard() {
  const [showSidebar,setShowSidebar] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const { role,setRole } = useAppStore();
  const [selectedIndex, setSelectedIndex] = useState(0)
  const tabs = useMemo(() => ['FONCTIONS','RUBRIQUES', 'ATTRIBUTIONS GLOBALES','ATTRIBUTIONS FONCTIONNELLES','DIVISIONS','SERVICES','CATEGORIES','STATUS TEMPORAIRES'], [])
  const auth = useAuthUser()();
  const qk = ["auth", auth?.id];
  const { data:user} = useQuery(qk, () => getAuth(auth?.id), {
    onSuccess(d){
      setRole(d.role);
    },
    stateTime: 100_000,
    refetchOnWindowFocus: false,
  });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const logout = () => {
    if (signOut()) {
      qc.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="bg-slate-200">
     <div className="layout-wrapper layout-content-navbar">
  <div className="layout-container">
    {showSidebar && <aside  className="menu-vertical bg-menu-theme">
      <ScrollArea>
        <div className="app-brand">
        <Link to="">
           <img src="/logo.png" alt="logo" style={{width: '200px', height: '200px'}} />
        </Link>
      </div>
      
      <div className="menu-inner-shadow" />
      <ul className="menu-inner py-1">
        {/* Dashboard */}
        <Can  I="manage" a={role}>
           <li className="menu-item">
          <Link to="/dashboard/employescdi" className="menu-link">
            <FaUsers className="h-5 w-5 mx-1 text-yellow-500" />
            <div >EMPLOYES CDI</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/employescdd" className="menu-link">
            <FaUsers className="h-5 w-5 mx-1 text-blue-500" />
            <div >EMPLOYES CDD</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/temporaires" className="menu-link">
            <FcOvertime className="h-5 w-5 mx-1 text-green-500" />
            <div>TEMPORAIRES</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/fiches" className="menu-link">
            <GiNotebook className="h-5 w-5 mx-1 text-blue-400" />
            <div >PRESENCES</div>
          </Link>
        </li>
        </Can>
        <li className="menu-item">
        <Accordion>
          <Accordion.Item  value="lot">
                <Accordion.Control icon={<SiBookstack className="h-5 w-5 mx-1 text-green-500" />}>LOTS DE BULLETIN</Accordion.Control>
                <Accordion.Panel>
                    <Link to="/dashboard/lotscdi" className="menu-link">
                      <div className="flex space-x-1">
                      <GiPapers className="h-5 w-5 mx-1 text-green-500" />
                        <div> LOT DE BULLETIN CDI</div>
                        </div>
                    </Link>
                </Accordion.Panel>
                <Accordion.Panel>
                    <Link to="/dashboard/lotscdd" className="menu-link">
                    <div className="flex space-x-1">
                      <FaBook className="h-5 w-5 mx-1 text-amber-500" />
                        <div> LOT DE BULLETIN CDD</div>
                        </div>
                    </Link>
                </Accordion.Panel>
                <Accordion.Panel>
                    <Link to="/dashboard/lotstemp" className="menu-link">
                    <div className="flex space-x-1">
                      <FaBook className="h-5 w-5 mx-1 text-blue-500" />
                        <div> LOT TEMPORAIRES</div>
                        </div>
                    </Link>
                </Accordion.Panel>
                  </Accordion.Item>
        </Accordion>
          
        </li>
        
        <li className="menu-item">
          <Link to="/dashboard/users" className="menu-link">
            <FaUserCog className="h-5 w-5 mx-1" />
            <div >UTILISATEURS</div>
          </Link>
        </li>
       
      </ul>
      </ScrollArea>
    </aside>
    }
    {/* / Menu */}
    {/* Layout container */}
    <div className="layout-page">
      {/* Navbar */}
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        <div onClick={(e) => setShowSidebar(v => !v)} className="navbar-nav align-items-xl-center me-3 cursor-pointer">
          <span className="nav-item nav-link px-0 me-xl-4">
            <i className="bx bx-menu bx-sm" />
          </span>
        </div>
        <marquee className="w-full text-3xl font-bold text-green-500">RESSOURCES HUMAINES CROUS/Z</marquee>
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
          <Can I="manage" a={role}>
            <div className="flex space-x-1">
              <Button leftSection={<PiGearSixDuotone className="h-6 w-6"/>} onClick={open}>PARAMETRE </Button>
            </div>
            
          </Can>

            {/* User */}
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a className="nav-link dropdown-toggle hide-arrow" href="!#" data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                  <span className="w-px-40 h-auto rounded-circle">
                    <FaUserCircle className="h-10 w-10" />
                     </span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="!#">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <span className="w-px-40 h-auto rounded-circle">
                          <FaUserCircle className="h-10 w-10" />
                             </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">{user?.prenom}</span>
                        <small className="text-muted">{user?.nom}</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <Link to='changepassword'>
                  <Button leftSection={<FaUnlock className="inline px-1 w-5 h-5"/>} className="dropdown-item"> 
                  Changer mot de passe
                  </Button>
                  </Link>
                </li>
               
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <Button leftSection={<FaSignOutAlt className="inline px-1 w-5 h-5"/>} className="dropdown-item"
                   onClick={() =>logout()}
                    >Se Déconnecter</Button>
                </li>
              </ul>
            </li>
            {/*/ User */}
          </ul>
        </div>
      </nav>

      {/* content here */}
      <Routes>
      <Route path="" element={<Employes />} />
      <Route path="employescdi" element={<Employes />} />
      <Route path="employescdd" element={<Cdds />} />
      <Route path="temporaires" element={<Temporaires />} />
      <Route path="employescdi/:id" element={<Employe />} />
      <Route path="employescdi/:id/fichepresences" element={<FicheMonth />} />
      <Route path="employescdd/:id" element={<Cdd />} />
      <Route path="employescdd/:id/fichepresences" element={<FicheMonth />} />
      <Route path="fiches" element={<Fiches />} />
      <Route path="fiches/:id" element={<Fiche />} />
      <Route path="users" element={<Users />} />
      <Route path="changepassword" element={<ChangePassword />} /> 
      <Route path="lotscdi" element={<Lots />} />
      <Route path="lotscdi/:id" element={<LotCdi />} />
      <Route path="lotscdd" element={<LotsCdd />} />
      <Route path="lotstemp" element={<LotsTemporaire />} />
      </Routes>
     
      </div>
      </div>
      </div>
      <div>
</div>
    <Modal
        opened={opened}
        onClose={close}
        title="PANNEAU DE CONFIGURATION"
        fullScreen
        radius={0}
        transitionProps={{ transition: 'scale', duration: 200 }}
      >

  <Pane display="flex" height={500} marginTop={5}>
      <Tablist flexBasis={200} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            aria-controls={`panel-${tab}`}
            isSelected={index === selectedIndex}
            key={tab}
            direction="vertical"
            onSelect={() => setSelectedIndex(index)}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} flex="1">
      <Pane
            aria-hidden={selectedIndex !== 0}
            display={selectedIndex === 0 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Fonctions/>
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 1}
            display={selectedIndex === 1 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Rubriques />
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 2}
            display={selectedIndex === 2 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Attributionglobales/>
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 3}
            display={selectedIndex === 3 ? 'block' : 'none'}
            role="tabpanel"
          >
           <AttributionFonctionnelle/>
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 4}
            display={selectedIndex === 4 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Divisions />
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 5}
            display={selectedIndex === 5 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Services />
          </Pane>
          <Pane
            aria-hidden={selectedIndex !== 6}
            display={selectedIndex === 6 ? 'block' : 'none'}
            role="tabpanel"
          >
           <Categories />
          </Pane>

          <Pane
            aria-hidden={selectedIndex !== 7}
            display={selectedIndex === 7 ? 'block' : 'none'}
            role="tabpanel"
          >
           <StatusTemporaire />
          </Pane>
      </Pane>
    </Pane>
        
      </Modal>
    </div>
  )
}

export default Dashboard