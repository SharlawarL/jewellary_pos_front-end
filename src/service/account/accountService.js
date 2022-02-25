import axios from 'axios';

//json
import { apiUrl } from '../../config/inint';

//service 
import UtilsService from '../utils/utilsService'
//object of services
const service = new UtilsService();

export default class AccountService{

    //get company details
    saveAccountMaster = (data) =>{
        let headers = {
            headers: { Action : 'Account', Module: 'save-account-master' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        return service.responceData(axios.post(apiUrl, data, headers))
    }
}       