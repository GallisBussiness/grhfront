import Api from "./Api";

export const createDivision = (data) => Api.post('/division',data).then(res => res.data);
export const getDivisions = () => Api.get('/division').then(res => res.data);
export const updateDivision = (id, data) => Api.patch('/division/'+id,data).then(res => res.data);