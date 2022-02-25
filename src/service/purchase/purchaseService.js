import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class ParchaseService{

    //get Total Branch
    getPurchase = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'get-Purchase' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getPurchaseReturn = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'get-Purchase-return' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get last Branch
    getLastPurchase = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'get-last-Purchase' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get last Branch
    getLastPurchaseReturn = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'get-last-Purchase-return' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    savePurchase = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'save-Purchase' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    savePurchaseReturn = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'save-Purchase-return' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }
    

    //get Total Branch
    deletePurchase = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'delete-Purchase' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    updatePurchase = (data) =>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'update-Purchase' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getViewBill = (data )=>{
        let headers = {
            headers: { Action : 'Purchase', Module: 'get-view-bill' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }


}       