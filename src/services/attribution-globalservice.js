import Api from "./Api";

export const createAttributionglobale = (data) => Api.post('/attribution-globale',data).then(res => res.data);
export const getAttributionGlobalesByEmploye = (emp) => Api.get('/attribution-globale/byemploye/'+emp).then(res => res.data);
export const getAttributionglobales = () => Api.get('/attribution-globale').then(res => res.data);
export const updateAttributionglobale = (id, data) => Api.patch('/attribution-globale/'+id,data).then(res => res.data);
export const removeAttributionGlobale = (id) => Api.delete('/attribution-globale/'+id).then(res => res.data);