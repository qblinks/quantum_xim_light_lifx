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
  * Deactivate this channel
  *
  * @param {object} options object created from xim_instance() with the additional
  *                 options to perform xim_authenticate, refer to corresponding
  *                 documents for the details
  * @param {function} callback to be used by the XIM driver
  */
function unlink(opt, callback) {
  const set = opt.xim_channel_set;
  const options = {
    method: 'DELETE',
    url: `${process.env.auth_url}/token/lifx/${set}`,
    headers: {
      Authorization: `Bearer ${opt.quantum_token}`,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error('invalid operation or not implemented yet');
    } else {
      const jsonObj = JSON.parse(body);
      const my_xim_list = opt;
      if (jsonObj.result === true) {
        my_xim_list.result = {};
        my_xim_list.result.err_no = 0;
        my_xim_list.result.err_msg = 'ok';
        callback(my_xim_list);
      } else {
        my_xim_list.result = {};
        my_xim_list.result.err_no = 0;
        my_xim_list.result.err_msg = 'No available token.';
        callback(my_xim_list);
      }
    }
  });
}


/**
 * functions exporting
 */
module.exports = unlink;
