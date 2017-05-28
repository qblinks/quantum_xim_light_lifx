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

const merge = require('merge');

/**
 * get access token of LIFX from Qblinks cloud
 *
 * @param {object} options Quantum instance
 * @param {function} callback callback of this function
 */
function authenticate(options, callback) {
  const output = merge({}, options);
  const xim_content = options.xim_content || {};
  const access_token = xim_content.access_token || '';

  if (access_token.length > 0) {
    output.xim_content.accessToken = options.xim_content.access_token;
    output.result = {
      err_no: 0,
      err_msg: 'ok',
    };
  } else {
    output.result = {
      err_no: 113,
      err_msg: 'No Access Token',
    };
  }
  callback(output);
}

/**
 * functions exporting
 */
module.exports = authenticate;
