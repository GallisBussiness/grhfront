import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import {  useState } from 'react'
import { useQuery } from 'react-query';
import {LoadingOverlay, TextInput } from '@mantine/core'
import { FaSearch } from 'react-icons/fa'
import { getRubriques } from '../services/rubriqueservice'
import { getAttributionFonctionnellesByEmploye } from '../services/attribution-fonctionnelle';
import { flattenDeep } from 'lodash';

function AttributionsFonctionnellesEmploye({id}) {

  const [rubriques,setRubriques] = useState([]);
  const [filters, setFilters] = useState({
      'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
      'rubrique.libelle': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };
      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  }

  const qk = ['get_AttributionFonctionnelleEmploye',id]

  const {data: AttributionFonctionnellesEmploye, isLoading } = useQuery(qk, () => getAttributionFonctionnellesByEmploye(id));

  const key = ['get_Rubriques'];

  const {isLoading: isLoadingR} = useQuery(key,() => getRubriques(),{
    onSuccess(data){
      const nd = data.map(d => ({label:`${d.code} ${d.libelle}`,value:d._id}));
      setRubriques(nd);
    }
  })



  const renderHeader = () => {
      return (
          <div className="flex justify-content-between align-items-center">
              <h5 className="m-0">LISTE DES ATTRIBUTIONS FONCTIONNELLES</h5>
                  <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
          </div>
      )
  }

  const header = renderHeader();

  return (
    <>
    <div className="content-wrapper">
<LoadingOverlay visible={isLoading || isLoadingR} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'blue', type: 'bars' }} />
  <div className="container-xxl flex-grow-1 container-p-y">
  <div className="datatable-doc">
       <div className="card p-4">
           <DataTable value={flattenDeep(AttributionFonctionnellesEmploye)} paginator className="p-datatable-customers" header={header} rows={10}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
               dataKey="_id" rowHover
               filters={filters} filterDisplay="menu" size="small" loading={isLoading} responsiveLayout="scroll"
               globalFilterFields={['fonction.nom','rubrique.libelle']}
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                 <Column field="rubrique.code" header="CODE" sortable style={{ minWidth: '10rem' }} />
              <Column field="rubrique.libelle" header="RUBRIQUE" sortable style={{ minWidth: '10rem' }} /> 
               <Column field="valeur_par_defaut" header="VALEUR" sortable style={{ minWidth: '10rem' }} />      
           </DataTable>
       </div>
   </div>
  </div>
</div>
    
    </>
  )
}

export default AttributionsFonctionnellesEmploye