import Api from "./Api";

export const createLot = (data) => Api.post('/lot',data).then(res => res.data);
export const getLots = () => Api.get('/lot').then(res => res.data);
export const updateLot = (id, data) => Api.patch('/lot/'+id,data).then(res => res.data);