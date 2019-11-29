/**
 * This file is reserved for functions that handle data validation.
 * That means any functions that validate user provided data. The most
 * common use will likely be for validating that a change to a Config
 * row will be valid.
 */

module.exports = {
  defaultPermission: perm => {
    return ['1','0'].includes(perm)
  },
  siteTitle: () => true,
  isOTPExpired: otp => (
    /**
     * This will check to see if the OTP has timed out. If there was no
     * timeout set for the OTP, then it should be unlimited, and this
     * function should not be called on it.
     */
    !!otp.timeout ? otp.downloadTime + otp.timeout * 60 > new Date().getTime() : true
  ),
};