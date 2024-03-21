import Api from "./Api";

export const createDoc = (data) => Api.post('/doc',data).then(res => res.data);
export const getDocs = () => Api.get('/doc').then(res => res.data);
export const getDoc = (id) => Api.get('/doc/' + id).then(res => res.data);
export const getDocByEmp = (id) => Api.get('/doc/byemp/' + id).then(res => res.data);
export const updateDoc = (id, data) => Api.patch('/doc/'+id,data).then(res => res.data);
export const deleteDoc = (id) => Api.delete('/doc/'+ id).then(res => res.data);