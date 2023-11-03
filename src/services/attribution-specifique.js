import Api from "./Api";

export const createAttributionSpecifique = (data) => Api.post('/attribution-individuelle',data).then(res => res.data);
export const getAttributionSpecifiqueByEmploye = (emp) => Api.get('/attribution-individuelle/byemploye/'+emp).then(res => res.data);
export const getAttributionSpecifiques = () => Api.get('/attribution-individuelle').then(res => res.data);
export const updateAttributionSpecifique = (id, data) => Api.patch('/attribution-individuelle/'+id,data).then(res => res.data);