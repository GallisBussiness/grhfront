import Api from "./Api";

export const createFonction = (data) => Api.post('/fonction',data).then(res => res.data);
export const getFonctions = () => Api.get('/fonction').then(res => res.data);
export const updateFonction = (id, data) => Api.patch('/fonction/'+id,data).then(res => res.data);