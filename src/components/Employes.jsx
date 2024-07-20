import { DataTable } from 'mantine-datatable';
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { BsFillPenFill } from 'react-icons/bs'
import { TbSum } from "react-icons/tb";
import createEmployeModal from '../modals/CreateEmployeModal'
import updateEmployeModal from '../modals/UpdateEmployeModal'
import { createEmploye, getEmployes, toggleStateEmploye, updateEmploye } from '../services/employeservice'
import { FaFolder, FaPrint, FaSearch, FaXing } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IconButton, toaster } from 'evergreen-ui'
import { ActionIcon, Box, Button, Group, LoadingOverlay, Stack, Switch, TextInput } from '@mantine/core'
import { useAppStore } from './app.store'
import { Can } from '../acl/Can'
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/fr';
import { format, isWithinInterval, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Segmented } from 'antd';
import { groupBy, sortBy } from 'lodash';
import { logo } from "../third/logo";
import { drapeau } from "../third/drapeau";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "../assets/vfs_fonts";
pdfMake.vfs = font;

const PAGE_SIZE = 15;

function Employes() {
  const { role } = useAppStore();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [recrutementSearchRange, setRecrutementSearchRange] = useState();
  const [query, setQuery] = useState('');
  const [pq, setPq] = useState('');
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'is_actif',
    direction: 'asc',
  });
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [posteQuery] = useDebouncedValue(pq, 200);
  const qc = useQueryClient()
  const navigate = useNavigate();
  
    const qk = ['get_Employes']

    const {data: Employes, isLoading } = useQuery(qk, () => getEmployes(),{
        onSuccess:(_) => {
            setRecords(sortBy(_,'is_actif').slice(0, PAGE_SIZE));
        }
    });

    const [selectedGenre, setSelectedGenre] = useState('all');

    const filtered = (Employes = []) => {
      const emp = sortBy(Employes, 'is_actif')
      return sortStatus.direction === 'desc' ? emp.reverse() : emp?.filter(({ prenom,nom,poste, matricule_de_solde,genre,date_de_recrutement }) => {
        if (
          debouncedQuery !== '' &&
          !`${prenom}${nom}${matricule_de_solde}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        )
          return false;
          
          if (
            posteQuery !== '' &&
            !`${poste}.`.toLowerCase().includes(posteQuery.trim().toLowerCase())
          )
            return false;

            if (
              recrutementSearchRange &&
              recrutementSearchRange[0] &&
              recrutementSearchRange[1] &&
              !isWithinInterval(parse(date_de_recrutement,'yyyy-MM-dd',new Date()),{
                start:recrutementSearchRange[0],
                end:recrutementSearchRange[1]
              })
            )
              return false;
          
            if (selectedGenre !== 'all' && !`${genre}.`.toLowerCase().includes(selectedGenre.trim().toLowerCase())) return false;

        return true;
      })
    }

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(filtered(Employes).slice(from, to) ?? []);
      }, [page,Employes,debouncedQuery,posteQuery,selectedGenre,recrutementSearchRange,sortStatus]);

    const {mutate: create} = useMutation((data) => createEmploye(data), {
        onSuccess: (_) => {
         toaster.success("Création réussie !!!");
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            console.log(_);
            toaster.danger("Création échouée !!!");
        }
    })

    const {mutate: update} = useMutation((data) => updateEmploye(data._id, data.data), {
        onSuccess: (_) => {
            toaster.success("Mise à jour réussie !!!");
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            console.log(_);
            toaster.danger("Mise à jour échouée !!!");
           }
    });
    const { mutate: toggleState, isLoading: loadingT } = useMutation(
        (data) =>  toggleStateEmploye(data._id, data.data),
        {
          onSuccess: (_) => {
            qc.invalidateQueries(qk);
            toaster.success('ETAT EMPLOYE CHANGE !!!')
          },
          onError: (_) => {
            toaster.danger('Changement etat échouée !!!')
          },
        }
      );

    const handleUpdateEmploye = (d) => {
        updateEmployeModal({employe: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateEmploye = () => {
        createEmployeModal().then(create);
    }

    const handleViewEmploye = (id) => {
      navigate('/dashboard/employescdi/'+id);
    }

 
    const handleChangeState = (v,id) => {
        const data = {_id: id, data: {is_actif : v}};
        toggleState(data);
      };

      const getEmpPrint = (emps) => {
        return  groupBy(emps?.filter(e => e.is_actif).sort((a,b) => a.nom.localeCompare(b.nom)).map(e => ({...e,recrutement: format(e.date_de_recrutement,'yyyy')})),(e) => e.recrutement);
      }

      const handlePrintEmployes = () => {
        const docDefinition = {
          footer: {text:`CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR`,fontSize: 8,bold: true,alignment: 'center'},
          styles: {
            entete: {
                bold: true,
                alignment:'center',
                fontSize:10
            },
            center: {
                alignment:'center',
            },
            left: {
              alignment:'left',
          },
          right: {
            alignment:'right',
        },
            nombre: {
              alignment:'right',
              fontSize:10,
              bold: true
          },
          tword: {
            fontSize:10,
            italics:true
        },
        tword1: {
          fontSize:12,
          margin:[0,10,0,10]
      },
             info: {
              fontSize:8,
          },
            header3: {
                color:"white",
                fillColor: '#73BFBA',
                bold: true,
                alignment:'center',
                fontSize:6,
            },
            header4: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'right',
              fontSize:6
          },
            total:{
                color:"white",
                bold: true,
                fontSize:6,
                fillColor:'#73BFBA',
                alignment:'center'
            },
            anotherStyle: {
              italics: true,
              alignment: 'right'
            }
          },
          content:[
            {
            columnGap: 100,
            columns: [
              {
              with: 'auto',
              alignment:'left',
              stack: [
                {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 10,bold: true,alignment:"center"},
                {text:"Un Peuple, Un but, Une Foi\n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
                {image:drapeau,width: 40,alignment:"center"},
                {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR DE LA RECHERCHE ET DE L'INNOVATION \n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
                {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR\n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
                {text:"DIVISION DES RESSOURCES HUMAINES",fontSize: 10,bold: true,alignment:"center"}
              ]},
              
              {
                with:'auto',
                alignment:'right',
                stack:[
                  {image:logo,width: 80,alignment:"right"},
                ]
                
              },
            
            ],
            
          },
          {
            margin: [0,10],
            fillColor:"#422AFB",
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`LISTE DES RECRUTEMENTS POUR 2022`,fontSize: 16,bold: true,color:'white',margin:[0,4]}],
              ]
            }
          },
          {
            margin: [4,4,4,4],
            alignment: 'justify',
            pageBreak:'after',
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex === 0) ? '#A3AED0' : null;
              }
            },
            table: {
              widths: ['5%','20%','15%','20%','20%','20%'],
                body: [
                    [{text:'#',style:'entete'},{text:'MAT SOLDE',style:'entete'},{text:'NOM',style:'entete'},{text:'PRENOM',style:'entete'},{text:'SEXE',style:'entete'},{text:'RECRUTEMENT',style:'entete'}],
                     ...getEmpPrint(Employes)['2022']?.map((k,i)=> (
                      [{text:`${i+1}`,style:'info'},
                      {text:`${k.matricule_de_solde}`,style:'info'},
                      {text:`${k.nom}`,style:'info'},
                      {text:`${k.prenom}`,style:'info'},
                      {text:`${k.genre}`,style:'info'},
                      {text:`${format(k.date_de_recrutement,'dd/MM/yyyy')}`,style:'info'},
                    ]
                    )),
                ],
            }
        },
        {
          margin: [0,10],
          fillColor:"#422AFB",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: ['100%'],
            body: [
              [ {text:`LISTE DES RECRUTEMENTS POUR 2023`,fontSize: 16,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
        {
          margin: [4,4,4,4],
          alignment: 'justify',
          pageBreak:'after',
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#A3AED0' : null;
            }
          },
          table: {
            widths: ['5%','20%','15%','20%','20%','20%'],
              body: [
                  [{text:'#',style:'entete'},{text:'MAT SOLDE',style:'entete'},{text:'NOM',style:'entete'},{text:'PRENOM',style:'entete'},{text:'SEXE',style:'entete'},{text:'RECRUTEMENT',style:'entete'}],
                   ...getEmpPrint(Employes)['2023']?.map((k,i)=> (
                    [{text:`${i+1}`,style:'info'},
                    {text:`${k.matricule_de_solde}`,style:'info'},
                    {text:`${k.nom}`,style:'info'},
                    {text:`${k.prenom}`,style:'info'},
                    {text:`${k.genre}`,style:'info'},
                    {text:`${format(k.date_de_recrutement,'dd/MM/yyyy')}`,style:'info'},
                  ]
                  )),
              ],
          }
      },
      {
        margin: [0,10],
        fillColor:"#422AFB",
        alignment:'center',
        layout:'noBorders',
        table: {
          widths: ['100%'],
          body: [
            [ {text:`LISTE DES RECRUTEMENTS POUR 2024`,fontSize: 16,bold: true,color:'white',margin:[0,4]}],
          ]
        }
      },
      {
        margin: [4,4,4,4],
        alignment: 'justify',
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex === 0) ? '#A3AED0' : null;
          }
        },
        table: {
          widths: ['5%','20%','15%','20%','20%','20%'],
            body: [
                [{text:'#',style:'entete'},{text:'MAT SOLDE',style:'entete'},{text:'NOM',style:'entete'},{text:'PRENOM',style:'entete'},{text:'SEXE',style:'entete'},{text:'RECRUTEMENT',style:'entete'}],
                 ...getEmpPrint(Employes)['2024']?.map((k,i)=> (
                  [{text:`${i+1}`,style:'info'},
                  {text:`${k.matricule_de_solde}`,style:'info'},
                  {text:`${k.nom}`,style:'info'},
                  {text:`${k.prenom}`,style:'info'},
                  {text:`${k.genre}`,style:'info'},
                  {text:`${format(k.date_de_recrutement,'dd/MM/yyyy')}`,style:'info'},
                ]
                )),
            ],
        }
    },
        ]
        }
        
          pdfMake.createPdf(docDefinition).open();
      }


  return (
    <>
    <Can I='manage' a={role}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
      <div className="content-wrapper">
       <div className="container-xxl flex-grow-1 container-p-y">
       <div className="datatable-doc">
       <div className="flex justify-center items-center w-full">
        <div className='m-2 w-full'>
       
          <div className="space-x-1">
            <Can I='crud' a={role}>
            <Button  variant="gradient"  leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={() => handleCreateEmploye()} >Nouveau</Button>
            </Can>
          <Button  leftSection={<FaPrint className="h-6 w-6 text-white"/>} onClick={() => handlePrintEmployes()} >Imprimer la liste</Button>
          </div>
          
       
        </div>
        <div className="w-full">
               <TextInput value={query} onChange={(e) => setQuery(e.currentTarget.value)} leftSection={<FaSearch/>} placeholder="Rechercher ..." />
         </div>
       </div>
        
       
            <DataTable
      columns={[{ accessor: 'matricule_de_solde' }, 
      {
        accessor: 'Prenom et Nom',
        render: ({ prenom, nom }) => `${prenom} ${nom}`,
        footer: (
          <Group gap="xs">
            <Box mb={-4}>
              <TbSum size="1.25em" />
            </Box>
            <div>{filtered(Employes)?.length} employees / {Employes?.length}</div>
          </Group>
        ),
      },
      {
        accessor: 'poste',
        render: ({ poste }) => `${poste}`,
        width: 200,
        filter: (
          <TextInput
            label="Poste"
            placeholder="Search poste..."
            leftSection={<FaSearch size={16} />}
            rightSection={
              <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setPq('')}>
                <FaXing size={14} />
              </ActionIcon>
            }
            value={pq}
            onChange={(e) => setPq(e.currentTarget.value)}
          />
        ),
        filtering: pq !== '',
      },
      {
        accessor: 'date_de_recrutement',
        textAlign: 'right',
        render: ({ date_de_recrutement }) => format(date_de_recrutement, "dd/MM/yyyy",{locale:fr}),
        filter: ({ close }) => (
          <Stack>
            <DatePicker
              maxDate={new Date()}
              type="range"
              value={recrutementSearchRange}
              onChange={setRecrutementSearchRange}
              locale='fr'
            />
            <Button
              disabled={!recrutementSearchRange}
              variant="light"
              onClick={() => {
                setBirthdaySearchRange(undefined);
                close();
              }}
            >
              Clear
            </Button>
          </Stack>
        ),
        filtering: Boolean(recrutementSearchRange),
      },
      {
        accessor: 'genre',
        filter: (
          <Segmented
          value={selectedGenre}
          options={['all', 'Homme', 'Femme']}
          onChange={setSelectedGenre}
        />
        ),
        filtering: selectedGenre !== '',
      },
      {
        accessor: 'age',
        width: 100,
        textAlign: 'right',
        visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.xs})`,
        cellsStyle: ({ date_de_naissance }) =>
            dayjs().diff(date_de_naissance, 'years') >= 60
              ? {
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'orange',
                }
              : undefined,
        render: ({ date_de_naissance }) => dayjs().diff(date_de_naissance, 'years') + ' ans',
        // 👇 this column has a footer
        footer: `Moy: ${Math.round(
          Employes?.map((record) => dayjs().diff(record.date_de_naissance, 'years')).reduce((a, b) => a + b, 0) / Employes?.length
        )} ans`,
      },
      {
        accessor: 'Actif',
        sortable: true,
        render: ({ _id,is_actif }) => <Switch checked={is_actif} size='xs' onChange={(e) => handleChangeState(e.currentTarget.checked,_id)} />,
      },
      {
        accessor: 'actions',
        title: <Box mr={6}>actions</Box>,
        textAlign: 'right',
        render: (rowData) => (
            <div className="flex items-center justify-center space-x-1">
                 <Can I='view' a={role}>
         <IconButton type="button"  onClick={() => handleViewEmploye(rowData._id)} icon={<FaFolder className="text-blue-500"/>}/>
         </Can>
             <Can I='crud' a={role}>
      <IconButton type="button"  onClick={() => handleUpdateEmploye(rowData)} icon={<BsFillPenFill className="text-green-500"/>} />
         </Can>
         </div>
        ),
      },
    ]}
      records={records}
      idAccessor="_id"
      rowColor={({ poste }) => {
        if (`${poste.toLowerCase().trim()}`.startsWith('chef',0)) return { dark: '#236602', light: '#236602' };
      }}
      fetching={isLoading}
      totalRecords={filtered(Employes)?.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      onPageChange={(p) => setPage(p)}
      borderRadius="lg"
      shadow="lg"
      horizontalSpacing="xs"
      verticalAlign="top"
    />
        </div>
       </div>
   </div>

  
    <ModalContainer />
    </Can>
    
    </>
  )
}

export default Employes