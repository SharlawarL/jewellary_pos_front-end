import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';
//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class StockService{

    //get Total Branch
    getStock = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'get-Stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getStockByEntry = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'get-Stock-by-entry' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get last Branch
    getLastStock = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'get-last-Stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    getDropItem = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'get-drop-item' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    saveStock = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'save-Stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    deleteStock = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'delete-Stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }

    //get Total Branch
    updateStock = (data) =>{
        let headers = {
            headers: { Action : 'Stock', Module: 'update-Stock' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }


}       