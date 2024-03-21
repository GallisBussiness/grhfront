import Api from "./Api";

export const createLotTemp = (data) => Api.post('/lotstemp',data).then(res => res.data);
export const getLotsTemp = () => Api.get('/lotstemp').then(res => res.data);
export const updateLotTemp = (id, data) => Api.patch('/lotstemp/'+id,data).then(res => res.data);
export const generateBulletinTemp = (id) => Api.post('/lotstemp/generatebulletin/'+id).then(res => res.data);
export const getBulletinsTemp = (id) => Api.get('/lotstemp/getbulletins/'+ id).then(res => res.data);
export const deleteLotTemp = (id) => Api.delete('/lotstemp/'+id).then(res => res.data);