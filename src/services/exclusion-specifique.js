import Api from "./Api";

export const createExclusionSpecifique = (data) => Api.post('/exclusion-specifique',data).then(res => res.data);
export const getExclusionSpecifiqueByEmploye = (emp) => Api.get('/exclusion-specifique/byemploye/'+emp).then(res => res.data);
export const getExclusionSpecifiques = () => Api.get('/exclusion-specifique').then(res => res.data);
export const updateExclusionSpecifique = (id, data) => Api.patch('/exclusion-specifique/'+id,data).then(res => res.data);
export const deleteExclusionSpecifique = (id) => Api.delete('/exclusion-specifique/'+id).then(res => res.data);