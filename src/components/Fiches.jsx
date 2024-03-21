import { FilterMatchMode, FilterOperator } from "primereact/api";
import ModalContainer from "react-modal-promise";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useQuery,useMutation,useQueryClient } from "react-query";
import { BsPencilSquare } from "react-icons/bs";
import { FaDownload, FaEye, FaPrint, FaSearch, FaTrash } from "react-icons/fa";
import { createFiche, deleteFiche, getFiches, getFichesByWeek, toggleStateFiche, updateFiche } from "../services/ficheservice";
import { ActionIcon, Button, Loader, LoadingOverlay, Switch, TextInput } from "@mantine/core";
import CreateFicheModal from "../modals/CreateFicheModal";
import UpdateFicheModal from "../modals/UpdateFicheModal";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "./app.store";
import { Can } from "../acl/Can";
import ChooseHebdoModal from "../modals/ChooseHebdoModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FicheHebdoPrint from "./FicheHebdoPrint";

function Fiches() {
  const [hebdo,setHebdo] = useState(null);
  const linkref = useRef(null);
  const qk = ["get_Fiches"];
  const { data: Fiches, isLoading } = useQuery(qk, () => getFiches());
  const qc = useQueryClient();
  const { role } = useAppStore();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const { mutate: create, isLoading: loadingC } = useMutation(
    (data) => createFiche(data),
    {
      onSuccess: (_) => {
        qc.invalidateQueries(qk);
      }
    }
  );

  const { mutate: deleteD, isLoading: loadingD } = useMutation(
    (id) => deleteFiche(id),
    {
      onSuccess: (_) => {
       
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        
      },
    }
  );

  const { mutate: getHebdo, isLoading: loadingHebdo } = useMutation(
    (data) => getFichesByWeek(data),
    {
      onSuccess: (_) => {
      setHebdo(_);
      },
      onError: console.log,
    }
  );

  const { mutate: update, isLoading: loadingU } = useMutation(
    (data) => updateFiche(data._id, data.data),
    {
      onSuccess: (_) => {
       
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
       
      },
    }
  );

  const { mutate: toggle, isLoading: loadingT } = useMutation(
    (data) =>  toggleStateFiche(data._id, data.data),
    {
      onSuccess: (_) => {
        qc.invalidateQueries(qk);
      },
      onError:console.log,
    }
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700"
          onClick={handleCreateFiche}
          leftSection={<AiOutlinePlus />}
        >
          Nouvelle Fiche
        </Button>
        <div className="flex space-x-1">
           <Button
          bg={'green'}
          onClick={handlePrintFicheHebdo}
          leftSection={<FaPrint />}
        >
          Imprimer Hebdomaire
        </Button>
        
        {hebdo && <PDFDownloadLink document={<FicheHebdoPrint presences={hebdo}/>} fileName={"FicheHebdo.pdf"}> 
        {({ blob, url, loading, error }) =>
        loading ? <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'green', type: 'bars' }} />: <Button bg={'green'}><FaDownload /></Button>
         }
        </PDFDownloadLink>}
        </div>
       
      </div>
    );
  };

  const handleViewFiche = (id) => {
    navigate(id);
  }

  const handleUpdateFiche = (d) => {
    UpdateFicheModal({ fiche: d }).then((dt) => {
      const { _id, ...rest } = dt;
      update({ _id, data: rest });
    });
  };


  const handleCreateFiche = () => {
    CreateFicheModal().then(create);
  };

  const handlePrintFicheHebdo = () => {
    ChooseHebdoModal().then(getHebdo);
  };

  const handleDelete = async (event,id) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Etes vous sur de vouloir supprimer ?",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Supprimer",
      acceptClassName:
        "bg-red-500 hover:bg-red-700 border-none ring-node focus:ring-none",
      accept: () => {
        
          deleteD(id)
      },
      reject: () => {},
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
      <h5 className="m-0">LISTE DES FICHES</h5>
          <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
  </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
         <ActionIcon className="bg-white"
          size="md"
          onClick={() => handleViewFiche(rowData._id)}
        >
          <FaEye size={18} className="text-blue-500"/>
        </ActionIcon>
        <ActionIcon
          size="md"
          className="bg-white"
          onClick={() => handleUpdateFiche(rowData)}
        >
          <BsPencilSquare size={18}className="text-green-500" />
        </ActionIcon>
        <ActionIcon
          size="md"
          className="bg-white"
          onClick={(e) => handleDelete(e,rowData._id)}
        >
          <FaTrash size={18} className="text-red-500" />
        </ActionIcon>
      </div>
    );
  };

  const header = renderHeader();

  const handleChangeState = (v,id) => {
    const data = {_id: id, data: {isOpen : v}};
    toggle(data);
  };

  const statusTemplate = (row) => <Switch checked={row.isOpen} onChange={(e) => handleChangeState(e.currentTarget.checked,row._id)} />;

   return (
    <>
    <Can I='manage' a={role}>
      <LoadingOverlay visible={loadingT || isLoading || loadingC || loadingD || loadingU || loadingHebdo} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }} />
    <div className="mt-4 mx-10 h-screen">
        <div className="p-10">
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            value={Fiches}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            size="small"
            // selection={selectedResidences}
            // onSelectionChange={(e) => setSelectedResidences(e.value)}
            filters={filters}
            filterDisplay="menu"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["date"]}
            emptyMessage="Aucune Fiches trouvées"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} Fiches"
          >
            

            <Column
              field="date"
              header="DATE"
              sortable
              style={{ minWidth: "2rem" }}
            />

            <Column
              field="ref"
              header="REF"
              sortable
              style={{ minWidth: "20rem" }}
            />

        <Column
              field="isOpen"
              header="EST OUVERT"
              body={statusTemplate}
              sortable
              style={{ minWidth: "2rem" }}
            />


            <Column
              headerStyle={{ width: "4rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
      <ConfirmPopup />
      <ModalContainer />
    </Can>
    
    </>
   )
}

export default Fiches