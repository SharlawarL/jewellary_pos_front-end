import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class ItemService{

    //get Total Branch
    getItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getDropItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-drop-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get last Branch
    getLastItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-last-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getDefaultValue = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-default-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    saveDefaultValue = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'save-default-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getItemPurity = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-item-purity' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    deleteItemPurity = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'delete-item-purity' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'save-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveItemPurity = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'save-item-purity' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    updateItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'update-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    deleteItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'delete-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    updateItem = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'update-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    getTaxValue = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'get-tax-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    saveTaxValue = (data) =>{
        let headers = {
            headers: { Action : 'Item', Module: 'save-tax-value' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


}       