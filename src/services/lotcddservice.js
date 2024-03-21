import Api from "./Api";

export const createLotCdd = (data) => Api.post('/lotscdd',data).then(res => res.data);
export const getLotsCdd = () => Api.get('/lotscdd').then(res => res.data);
export const updateLotCdd = (id, data) => Api.patch('/lotscdd/'+id,data).then(res => res.data);
export const generateBulletinCdd = (id) => Api.post('/lotscdd/generatebulletin/'+id).then(res => res.data);
export const getBulletinsCdd = (id) => Api.get('/lotscdd/getbulletins/'+ id).then(res => res.data);
export const deleteLotCdd = (id) => Api.delete('/lotscdd/'+id).then(res => res.data);