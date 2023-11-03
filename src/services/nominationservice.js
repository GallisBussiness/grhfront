import Api from "./Api";

export const createNomination = (data) => Api.post('/nomination',data).then(res => res.data);
export const getNominationByEmploye = (emp) => Api.get('/nomination/byemploye/'+emp).then(res => res.data);
export const updateNomination = (id, data) => Api.patch('/nomination/'+id,data).then(res => res.data);