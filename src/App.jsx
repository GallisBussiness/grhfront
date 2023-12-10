import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { locale, addLocale } from 'primereact/api';
import { MantineProvider, createTheme } from '@mantine/core';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import P404 from './components/P404';
import {QueryClient,QueryClientProvider } from 'react-query'
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';
import { AuthProvider, useIsAuthenticated } from 'react-auth-kit';
import { Notifications } from '@mantine/notifications';


addLocale('fr', {
  firstDayOfWeek: 1,
  dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
  dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'decembre'],
  monthNamesShort: ['jan', 'fev', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'dec'],
  today: 'Aujourd\'hui',
  clear: 'Vider',
  accept:	'accepter',
  reject:	'Non',
  choose:	'Choisir',
  upload:	'télécharger',
  cancel:	'Annuler',
  passwordPrompt:	'Entrer un mot de passe',
  weak:	'Faible',
  medium:'Moyen',
  strong:	'Fort',
  emptyMessage: 'Aucun résultats trouvés !'
})


locale('fr');

const queryClient = new QueryClient();

const theme = createTheme({
  defaultGradient:{
    deg:45,
    from: 'blue',
    to: 'green'
  },
  colors: {
    'green': [
      "#f2faed",
      "#e6f1de",
      "#cbe1bb",
      "#afd095",
      "#96c275",
      "#87b962",
      "#7eb556",
      "#6ba045",
      "#5e8e3c",
      "#4e7b2e"
    ],
    'blue': [
      "#ebf7ff",
      "#d6ecfa",
      "#a7d9f7",
      "#77c4f5",
      "#55b2f4",
      "#43a7f4",
      "#3aa2f5",
      "#2e8dda",
      "#227ec3",
      "#016cac"
    ],
    'yellow':[
      "#fdfce5",
      "#f8f6d3",
      "#f0ecaa",
      "#e7e17c",
      "#e0d957",
      "#dbd33e",
      "#d9d02f",
      "#c0b820",
      "#aaa316",
      "#938c03"
    ]
  },
});

function App() {
 return (
  <QueryClientProvider client={queryClient}>
     <AuthProvider
        authType={"localstorage"}
        authName={import.meta.env.VITE_TOKENSTORAGENAME}
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === "https:"}
      >
          <MantineProvider theme={theme}>
          <Notifications />
       <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
       <Route element={<PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>} path={'dashboard/*'}/>
                    <Route path="login" element={<Login />} />
                <Route path="*" element={<P404 />} />
   </Routes>
    </BrowserRouter>
    </MantineProvider>
      </AuthProvider>
  
 </QueryClientProvider>
 );
}

export default App

const PrivateRoute = ({ children }) => {
  const hasAuth = useIsAuthenticated()();
  return <>{hasAuth ? children : <Navigate to="/login" />}</>;
};
