import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class SchemaService{

    //get company details
    getSchema = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-schema' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getOrder = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-order' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getSchemaReports = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-schema-reports' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getGSTRReports = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-gstr-reports' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getSchemaReportsDrop = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-schema-reports-drop' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getSchemaEntry = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-schema-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getLastSchema = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-last-schema' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get company details
    getSchemaMaster = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-schema-master' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getOrderDetails = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'get-order-deatils' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Schema
    saveSchemaMaster = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-schema-master' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Schema
    saveOrderEntry = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-order-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    savePurchaseEntry = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-purchase-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    saveOrderDelivery = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-order-delivery' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }


    //get Total Schema
    saveSchemaPay = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-schema-pay' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Schema
    saveSchema = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-schema' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }
    //get Total Schema
    saveSchemaRegistration = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-schema-reg' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Schema
    saveSchemaNameMaster = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'save-schema-name-master' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    //get Total Schema
    deleteSchema = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'delete-schema' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

    

    //get Total Schema
    updateSchema = (data) =>{
        let headers = {
            headers: { Action : 'Schema', Module: 'update-schema' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return axios.post(apiUrl, data, headers)
    }

}       