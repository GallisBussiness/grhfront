import Api from "./Api";
export const getSections = () => Api.get('/section').then(res => res.data);
