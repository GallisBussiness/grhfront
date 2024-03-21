import Api from "./Api";

export const createRubrique = (data) => Api.post('/rubrique',data).then(res => res.data);
export const getRubriques = () => Api.get('/rubrique').then(res => res.data);
export const updateRubrique = (id, data) => Api.patch('/rubrique/'+id,data).then(res => res.data);
export const removeRubrique = (id) => Api.delete('/rubrique/'+id).then(res => res.data);