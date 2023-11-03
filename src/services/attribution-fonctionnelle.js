import Api from "./Api";

export const createAttributionFonctionnelle = (data) => Api.post('/attribution-fonctionnelle',data).then(res => res.data);
export const getAttributionFonctionnelles = () => Api.get('/attribution-fonctionnelle').then(res => res.data);
export const updateAttributionFonctionnelle = (id, data) => Api.patch('/attribution-fonctionnelle/'+id,data).then(res => res.data);