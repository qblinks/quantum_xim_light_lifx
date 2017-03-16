/*
 * Copyright (c) 2017
 * Qblinks Incorporated ("Qblinks").
 * All rights reserved.
 *
 * The information contained herein is confidential and proprietary to
 * Qblinks. Use of this information by anyone other than authorized employees
 * of Qblinks is granted only under a written non-disclosure agreement,
 * expressly prescribing the scope and manner of such use.
 */

'use strict';

const request = require('request');

/**
 * get access token of LIFX from Qblinks cloud
 *
 * @param {string} accessToken Qblinks account access token
 * @param {function} callback callback of this function
 */
function authenticate(opt, callback) {
  const options = {
    method: 'GET',
    url: `${process.env.auth_url}/token/lifx/${opt.xim_channel_set}`,
    headers: {
      Authorization: `Bearer ${opt.quantum_token}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error('invalid operation or not implemented yet');
    } else {
      const jsonObj = JSON.parse(body);
      const xim_light_properties = {};
      xim_light_properties.quantum_token = opt.quantum_token;
      xim_light_properties.xim_type = opt.xim_type;
      xim_light_properties.xim_channel = opt.xim_channel;
      xim_light_properties.xim_channel_set = opt.xim_channel_set;
      xim_light_properties.result = {};
      if (jsonObj.result === true) {
        xim_light_properties.result.err_no = 0;
        xim_light_properties.result.err_msg = 'ok';
      } else {
        xim_light_properties.result.err_no = 999;
        xim_light_properties.result.err_msg = 'No available token.';
      }

      if (typeof xim_light_properties.xim_content === 'undefined') {
        xim_light_properties.xim_content = {};
      }

      xim_light_properties.xim_content.accessToken = jsonObj.access_token;
      callback(xim_light_properties);
    }
  });
}

/**
 * functions exporting
 */
module.exports = authenticate;
