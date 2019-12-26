import Cookies from "universal-cookie";
import {Redirect} from "react-router-dom";
import React from "react";


/**
 * This function takes a number, and the amount of
 * digits it should have after truncation. This should
 * be used to cut off trailing numbers.
 *
 * truncateDecimals(0.1234, 2) => 0.12
 *
 * @param number
 * @param digits
 * @returns {number}
 */
export const truncateDecimals = (number, digits) => {
  let multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};


/**
 * This function takes a number of bytes as an integer,
 * and returns a more human readable form.
 *
 * @param nbytes
 * @returns {string}
 */
export const humanSize = nbytes => {
  let suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  while (nbytes >= 1024 && i < suffixes.length - 1) {
    nbytes /= 1024;
    ++i;
  }
  return `${truncateDecimals(nbytes, 2)} ${suffixes[i]}`;
};


/**
 * Should yeet the current user. This should only be called
 * if there was some kind of an authentication error with
 * the api. This function will return a redirect to /signin.
 * If that component is rendered, it will automatically
 * take the user to the signin page.
 */
export const clearAuth = () => {
  const cookies = new Cookies();
  cookies.remove('token');
  localStorage.clear();

  return <Redirect to="/signin" />
}