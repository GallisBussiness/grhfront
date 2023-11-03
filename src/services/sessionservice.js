import Api from "./Api";

export const createSession = (data) => Api.post('/session',data).then(res => res.data);
export const getSessions = () => Api.get('/session').then(res => res.data);
export const updateSession = (id, data) => Api.patch('/session/'+id,data).then(res => res.data);