import Api from "./Api";

export const createLot = (data) => Api.post('/lot',data).then(res => res.data);
export const getLots = () => Api.get('/lot').then(res => res.data);
export const getLot = (id) => Api.get('/lot/'+id).then(res => res.data);
export const updateLot = (id, data) => Api.patch('/lot/'+id,data).then(res => res.data);
export const generateBulletin = (id) => Api.post('/lot/generatebulletin/'+id).then(res => res.data);
export const getBulletins = (id) => Api.get('/lot/getbulletins/'+ id).then(res => res.data);
export const deleteLot = (id) => Api.delete('/lot/'+id).then(res => res.data);