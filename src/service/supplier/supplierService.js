import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();


export default class SupplierService{

    //get Total Branch
    getSupplier = (data) =>{
        let headers = {
            headers: { Action : 'Supplier', Module: 'get-supplier' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getDropSupplier = (data) =>{
        let headers = {
            headers: { Action : 'Supplier', Module: 'get-drop-supplier' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveSupplier = (data) =>{
        let headers = {
            headers: { Action : 'Supplier', Module: 'save-supplier' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    deleteSupplier = (data) =>{
        let headers = {
            headers: { Action : 'Supplier', Module: 'delete-supplier' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    updateSupplier = (data) =>{
        let headers = {
            headers: { Action : 'Supplier', Module: 'update-supplier' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


}       