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
function discovery(opt, callback) {
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
    url: 'https://api.lifx.com/v1/lights/all',
    headers: {
      Authorization: `Bearer ${opt.xim_content.accessToken}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error('invalid operation or not implemented yet');
    } else {
      const jsonObj = JSON.parse(body);

      const my_xim_list = opt;
      if (jsonObj.length === 0) {
        my_xim_list.result = {};
        my_xim_list.result.err_no = 999;
        my_xim_list.result.err_msg = 'no lights data';
      } else {
        my_xim_list.list = [];
        const my_group_list = {};
        for (let i = 0; i < jsonObj.length; i += 1) {
          const light = {};
          light.device_name = jsonObj[i].label;
          light.device_id = `id:${jsonObj[i].id}`;
          if (typeof jsonObj[i].group !== 'undefined') {
            my_group_list[`group_id:${jsonObj[i].group.id}`] = jsonObj[i].group.name;
          }
          if (typeof jsonObj[i].location !== 'undefined') {
            my_group_list[`location_id:${jsonObj[i].location.id}`] = jsonObj[i].location.name;
          }
          if (jsonObj[i].product.capabilities.has_color === true) {
            light.light_type = 'color';
          } else {
            light.light_type = 'white';
          }
          if (jsonObj[i].product.capabilities.has_ir === true) {
            light.infrared_support = true;
          } else {
            light.infrared_support = false;
          }
          light.native_toggle_support = true;
          light.light_status = {};
          light.light_status.hue = Math.round(jsonObj[i].color.hue);
          light.light_status.saturation = Math.round(jsonObj[i].color.saturation * 100);
          light.light_status.brightness = Math.round(jsonObj[i].brightness * 100);
          light.light_status.kelvin = jsonObj[i].color.kelvin;
          if (jsonObj[i].power === 'on') {
            light.light_status.onoff = true;
          } else {
            light.light_status.onoff = false;
          }
          light.light_status.connected = jsonObj[i].connected;
          my_xim_list.list.push(light);
        }
        // group and locaiton
        my_xim_list.groups = [];
        Object.keys(my_group_list).forEach((key) => {
          const group = {};
          const name = my_group_list[key];
          group.group_name = name;
          group.group_id = key;
          my_xim_list.groups.push(group);
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
module.exports = discovery;
