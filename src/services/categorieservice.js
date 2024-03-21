import Api from "./Api";

export const createCategorie = (data) => Api.post('/categorie',data).then(res => res.data);
export const getCategories = () => Api.get('/categorie').then(res => res.data);
export const updateCategorie = (id, data) => Api.patch('/categorie/'+id,data).then(res => res.data);
export const removeCategorie = (id) => Api.delete('/categorie/'+id).then(res => res.data);