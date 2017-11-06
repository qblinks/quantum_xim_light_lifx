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
 * set state to LIFX device
 *
 * @param {string} accessToken LIFX account access token
 * @param {string} accessDivice LIFX devices id
 * @param {string} accessState LIFX select body params
 * @param {string} accessValue LIFX body params value
 * @param {function} callback callback of this function
 */
function action(opt, callback) {
  console.log('action: opt:');
  console.log(opt);
  let options_toggle = {};
  let options_onoff = {};
  let my_color = '';
  let my_power = '';
  const result_options = opt;

  /* func for any situation */
  function my_request(options, stratum) {
    if (stratum > 1) {
      request(options, (error) => {
        if (error) {
          throw new Error('invalid operation or not implemented yet');
        }
      });
    } else {
      request(options, (error, response, body) => {
        if (error) {
          console.error('my_request: fail');
          console.error(error);
          console.error(response);
          console.error(options);
          throw new Error('invalid operation or not implemented yet');
        } else {
          const jsonObj = JSON.parse(body);

          console.error('my_request: success');
          console.error(jsonObj);
          console.error(options);

          if (typeof jsonObj.error !== 'undefined') {
            const my_xim_list = {};
            my_xim_list.result = {};
            my_xim_list.result.err_no = 999;
            my_xim_list.result.err_msg = jsonObj.error;
            callback(my_xim_list);
          } else {
            const my_xim_list = {};
            my_xim_list.quantum_token = opt.quantum_token;
            my_xim_list.xim_type = opt.xim_type;
            my_xim_list.xim_channel = opt.xim_channel;
            my_xim_list.xim_channel_set = opt.xim_channel_set;
            my_xim_list.list = [];
            my_xim_list.xim_content = opt.xim_content;
            jsonObj.results.forEach((lifx_light) => {
              const light = {};
              light.device_id = lifx_light.id;
              light.device_name = lifx_light.label;
              light.is_group = false;
              light.action_result = lifx_light.status;
              my_xim_list.list.push(light);
            });
            my_xim_list.result = {};
            my_xim_list.result.err_no = 0;
            my_xim_list.result.err_msg = 'ok';
            callback(my_xim_list);
          }
        }
      });
    }
  }

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

  if (typeof opt.action.hue !== 'undefined' &&
        typeof opt.action.saturation !== 'undefined' &&
        typeof opt.action.brightness !== 'undefined') {
    my_color = `hue:${opt.action.hue}`;
  } else if (typeof opt.action.rgb !== 'undefined') {
    my_color = opt.action.rgb;
  } else if (typeof opt.action.short_color_code !== 'undefined') {
    my_color = opt.action.short_color_code;
  }

  if (typeof opt.action.saturation !== 'undefined') {
    my_color += ` saturation:${opt.action.saturation / 100}`;
  }
  if (typeof opt.action.brightness !== 'undefined') {
    my_color += ` brightness:${opt.action.brightness / 100}`;
  }

  if (typeof opt.action.onoff !== 'undefined') {
    if (opt.action.onoff === true) {
      my_power = 'on';
    }
    if (opt.action.onoff === false) {
      my_power = 'off';
    }
  }

  if (my_color !== '') {
    if (opt.action.toggle === true) {
      /* toggle + color */
      options_toggle = {
        method: 'POST',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/toggle`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
      };
      my_request(options_toggle, 2);

      options_onoff = {
        method: 'PUT',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/state`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
        'content-type': 'application/json',
        body: JSON.stringify({
          color: my_color.trim(),
        }),
      };
      my_request(options_onoff, 1);
    } else if (my_power !== '') {
      /* onoff + color */
      options_onoff = {
        method: 'PUT',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/state`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
        'content-type': 'application/json',
        body: JSON.stringify({
          power: my_power,
          color: my_color.trim(),
        }),
      };
      my_request(options_onoff, 1);
    } else {
      /* color only */
      options_onoff = {
        method: 'PUT',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/state`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
        'content-type': 'application/json',
        body: JSON.stringify({
          color: my_color.trim(),
        }),
      };
      my_request(options_onoff, 1);
    }
  }

  if (my_color === '') {
    if (opt.action.toggle === true) {
      /* toggle only */
      options_toggle = {
        method: 'POST',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/toggle`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
      };
      my_request(options_toggle, 1);
    } else {
      /* onoff only */
      options_onoff = {
        method: 'PUT',
        url: `https://api.lifx.com/v1/lights/${opt.device_id}/state`,
        headers: {
          Authorization: `Bearer ${opt.xim_content.accessToken}`,
        },
        'content-type': 'application/json',
        body: JSON.stringify({
          power: my_power,
        }),
      };
      my_request(options_onoff, 1);
    }
  }
}


/**
 * functions exporting
 */
module.exports = action;
