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
 * get list from LIFX cloud
 *
 * @param {string} opt properties
 * @param {function} callback callback of this function
 */
function stat(opt, callback) {
  const result_options = opt;
  if (typeof opt.xim_content === 'undefined') {
    result_options.result = {
      err_no: 113,
      err_msg: 'No Access Token',
    };
    callback(result_options);
    return;
  }
  if (typeof opt.xim_content.accessToken === 'undefined') {
    result_options.result = {
      err_no: 113,
      err_msg: 'No Access Token',
    };
    callback(result_options);
    return;
  }
  const options = {
    method: 'GET',
    url: `https://api.lifx.com/v1/lights/${opt.device_id}`,
    headers: {
      Authorization: `Bearer ${opt.xim_content.accessToken}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error('invalid operation or not implemented yet');
    } else {
      const jsonObj = JSON.parse(body);
      const my_xim_list = {};
      my_xim_list.xim_content = opt.xim_content;
      my_xim_list.xim_type = opt.xim_type;
      my_xim_list.xim_channel = opt.xim_channel;
      my_xim_list.xim_channel_set = opt.xim_channel_set;
      my_xim_list.quantum_token = opt.quantum_token;
      if (jsonObj.length === 0 || jsonObj.error) {
        my_xim_list.result = {};
        my_xim_list.result.err_no = 999;
        my_xim_list.result.err_msg = 'no lights data';
      } else {
        my_xim_list.list = [];
        const light = {};
        jsonObj.forEach((lifx_light) => {
          light.device_name = lifx_light.label;
          light.device_id = `id:${lifx_light.id}`;
          if (lifx_light.product.capabilities.has_color === true) {
            light.light_type = 'color';
          } else {
            light.light_type = 'white';
          }
          if (lifx_light.product.capabilities.has_ir === true) {
            light.infrared_support = false;
          } else {
            light.infrared_support = true;
          }
          light.native_toggle_support = true;
          light.light_status = {};
          light.light_status.hue = Math.round(lifx_light.color.hue);
          light.light_status.saturation = Math.round(lifx_light.color.saturation * 100);
          light.light_status.brightness = Math.round(lifx_light.brightness * 100);
          light.light_status.kelvin = lifx_light.color.kelvin;
          if (lifx_light.power === 'on') {
            light.light_status.onoff = true;
          } else {
            light.light_status.onoff = false;
          }
          light.light_status.connected = lifx_light.connected;
          my_xim_list.list.push(light);
        });

        my_xim_list.result = {};
        my_xim_list.result.err_no = 0;
        my_xim_list.result.err_msg = 'ok';
      }
      callback(my_xim_list);
    }
  });
}


/**
 * functions exporting
 */
module.exports = stat;
