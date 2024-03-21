import Api from "./Api";

export const getStatusTemporaires = () => Api.get('/status').then(res => res.data);
export const getStatusTemporaire = (id) => Api.get('/status/' + id).then(res => res.data);
export const createStatusTemporaire  = (data) => Api.post('/status',data).then(res => res.data);
export const updateStatusTemporaire = (id,data) => Api.patch('/status/'+id,data).then(res => res.data);
export const removeStatusTemporaire = (id) => Api.delete('/status/' + id).then(res => res.data);