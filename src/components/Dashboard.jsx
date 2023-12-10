import { Link, Route, Routes, useNavigate} from "react-router-dom"

import { FaUnlock, FaUserCircle, FaUserCog, FaUsers} from 'react-icons/fa';
import { FcCalendar } from "react-icons/fc"
import { PiGearSixDuotone } from "react-icons/pi";
import { Button } from "primereact/button";

import { GiNotebook } from 'react-icons/gi';
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
import Sessions from "./Sessions";
import { IconButton, Pane, Tab, Tablist } from "evergreen-ui";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import Fonctions from "./config/Fonctions";
import Rubriques from "./config/Rubriques";
import Attributionglobales from "./config/AttributionGlobale";
import AttributionFonctionnelle from "./config/AttributionFonctionnelle";
import Divisions from "./config/Divisions";
import Services from "./config/Services";
import Lots from "./Lots";
// import Nominations from "./config/Nominations";



function Dashboard() {
  const [showSidebar,setShowSidebar] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedIndex, setSelectedIndex] = useState(0)
  const tabs = useMemo(() => ['FONCTIONS','RUBRIQUES', 'ATTRIBUTIONS GLOBALES','ATTRIBUTIONS FONCTIONNELLES','DIVISIONS','SERVICES'], [])
  const auth = useAuthUser()();
  const qk = ["auth", auth?.id];
  const { data:user,isLoading } = useQuery(qk, () => getAuth(auth?.id), {
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
    <>
     <div className="layout-wrapper layout-content-navbar">
  <div className="layout-container">
    {showSidebar && <aside  className="menu-vertical bg-menu-theme">
      <div className="app-brand">
        <Link to="">
           <img src="/logo.png" alt="logo" style={{width: '200px', height: '200px'}} />
        </Link>
      </div>
      <div className="menu-inner-shadow" />
      <ul className="menu-inner py-1">
        {/* Dashboard */}
        <li className="menu-item">
          <Link to="/dashboard/sessions" className="menu-link">
            <FcCalendar className="h-5 w-5 mx-1" />
            <div >SESSIONS</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/employes" className="menu-link">
            <FaUsers className="h-5 w-5 mx-1" />
            <div >EMPLOYES</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/fiches" className="menu-link">
            <GiNotebook className="h-5 w-5 mx-1 text-blue-400" />
            <div >PRESENCES</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/lots" className="menu-link">
            <SiBookstack className="h-5 w-5 mx-1 text-green-500" />
            <div >LOTS DE BULLETIN</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/dashboard/users" className="menu-link">
            <FaUserCog className="h-5 w-5 mx-1" />
            <div >UTILISATEURS</div>
          </Link>
        </li>
       
      </ul>
    </aside>}   
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
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
           {user?.role === 'admin' && <li>
              <IconButton icon={<PiGearSixDuotone className="h-6 w-6"/>} onClick={open}/>           
            </li>}
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
                  <Button icon={<FaUnlock className="inline px-1 w-5 h-5"/>} label="Changer mot de passe" className="dropdown-item"/>
                  </Link>
                </li>
               
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <Button icon="bx bx-power-off me-2" label="Se Déconnecter" className="dropdown-item"
                   onClick={() =>logout()}
                    />
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
      <Route path="employes" element={<Employes />} />
      <Route path="lots" element={<Lots />} />
      <Route path="employes/:id" element={<Employe />} />
      <Route path="employes/:id/fichepresences" element={<FicheMonth />} />
      <Route path="fiches" element={<Fiches />} />
      <Route path="fiches/:id" element={<Fiche />} />
      <Route path="users" element={<Users />} />
      <Route path="sessions" element={<Sessions />} />
      <Route path="changepassword" element={<ChangePassword />} />
      </Routes>
     
      </div>
      </div>
      </div>
      <div>
  <div className="content-backdrop fade" />
  
  <div className="layout-overlay layout-menu-toggle" />
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
      <Pane padding={16} background="tint1" flex="1">
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
      </Pane>
    </Pane>
        
      </Modal>
    </>
  )
}

export default Dashboard