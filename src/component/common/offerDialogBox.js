import React from 'react';
import { Button } from '@material-ui/core';

//icons
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';

//pages
import BackTop from '../../assets/img/back9.jpg'

import 'primeflex/primeflex.css';

export default function ResponsiveDialog() {

  const OfferTop = {
    backgroundImage: `url(${BackTop})`,
    backgroundSize: 'cover',
    color: 'white',
    fontWeight: '700',
    textShadow: '0px 0px 5px black',
    boxShadow: '0px 0px 10px black',
    padding: '2px',
    textAlign: 'center',
    backgroundColor: 'white',
  }

  const boxMiddle = {
    width:'70%',
    margin: '0px auto'
  }

  return (

    <div>
      <div style={OfferTop}>
        <div className="p-grid" style={boxMiddle}>
          <div className="p-col-10">
            <VolumeUpOutlinedIcon style={{ fontSize: '20px', marginBottom: '-5px' }} />  ERP Solution, Mobile App, E-Commerce all in one Solution with AI Integration.
                </div>
          <div className="p-col-2">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <Button variant="contained" > Know More</Button>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}