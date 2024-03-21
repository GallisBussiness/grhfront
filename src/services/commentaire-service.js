import Api from "./Api";

export const createCommentaire = (data) => Api.post('/commentaire',data).then(res => res.data);
export const getCommentairesByLot = (id) => Api.get('/commentaire/bylot/'+id).then(res => res.data);
export const deleteCommentaire = (id) => Api.delete('/commentaire/' + id).then(res => res.data);