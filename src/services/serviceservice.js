import Api from "./Api";

export const createService = (data) => Api.post('/service',data).then(res => res.data);
export const getServices = () => Api.get('/service').then(res => res.data);
export const updateService = (id, data) => Api.patch('/service/'+id,data).then(res => res.data);
export const getServiceByDivision = (id) => Api.get('/service/bydivision/'+id).then(res => res.data);