import Api from "./Api";
export const getCdds = () => Api.get('/cdd').then(res => res.data);
export const getCdd = (id) => Api.get('/cdd/' + id).then(res => res.data);
export const createCdd  = (data) => Api.post('/cdd',data).then(res => res.data);
export const updateCdd = (id,data) => Api.patch('/cdd/'+id,data).then(res => res.data);
export const updateCddProfile = (id,data) => Api.patch('/cdd/profile/' + id, data).then(res => res.data);