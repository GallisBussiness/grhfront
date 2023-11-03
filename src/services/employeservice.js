import Api from "./Api";
export const getEmployes = () => Api.get('/employe').then(res => res.data);
export const getEmpByMat = (mat) => Api.get('/employe/bymatsolde/'+mat).then(res => res.data);
export const getEmploye = (id) => Api.get('/employe/' + id).then(res => res.data);
export const createEmploye  = (data) => Api.post('/employe',data).then(res => res.data);
export const updateEmploye = (id,data) => Api.patch('/employe/'+id,data).then(res => res.data);
export const updateEmployeProfile = (id,data) => Api.patch('/employe/profile/' + id, data).then(res => res.data);