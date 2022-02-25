// import React , { Component } from 'react'
import axios from 'axios';
// import utils from '../utils/utils'
// import { ToastContainer, toast } from 'react-toastify';

export const ApiUrl = "http://demo.lalitsharlawar.com/api/";

const header = { Action : 'Company', Module: 'company-details' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')};

export function  getCompany(){
    axios.post(ApiUrl, 
    {compnay:'name'},
    {
        headers: header,
    }
    )
    .then((response) => {
        return response;
    
    }, (error) => {
        return error;
    });
}