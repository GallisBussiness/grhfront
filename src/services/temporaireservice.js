import Api from "./Api";
export const getTemporaires = () => Api.get('/temporaire').then(res => res.data);
export const getEmpByMat = (mat) => Api.get('/temporaire/bymatsolde/'+mat).then(res => res.data);
export const getTemporaire = (id) => Api.get('/temporaire/' + id).then(res => res.data);
export const createTemporaire  = (data) => Api.post('/temporaire',data).then(res => res.data);
export const updateTemporaire = (id,data) => Api.patch('/temporaire/'+id,data).then(res => res.data);
export const updateTemporaireProfile = (id,data) => Api.patch('/temporaire/profile/' + id, data).then(res => res.data);