import Api from "./Api";

export const getFiches = () => Api.get('/fichepresence').then(res => res.data);
export const getFichesByWeek = (data) => Api.post('/fichepresence/byweek',data).then(res => res.data);
export const getFiche = (id) => Api.get('/fichepresence/'+id).then(res => res.data);
export const createFiche = (data) => Api.post('/fichepresence',data).then(res => res.data);
export const getByMonthFiche = (data) => Api.post('/fichepresence/getbymonth',data).then(res => res.data);
export const updateFiche = (id,data) => Api.patch('/fichepresence/'+id,data).then(res => res.data);
export const deleteFiche = (id) => Api.delete('/fichepresence/'+id).then(res => res.data);
export const toggleStateFiche = (id,data) => Api.patch('/fichepresence/toggle/'+id,data).then(res => res.data);
