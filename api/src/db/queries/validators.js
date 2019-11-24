

module.exports = {
  otpTime: otpTime => {
    return !isNaN(parseInt(otpTime));
  },
  defaultPermission: perm => {
    return [
      'public',
      'private'
    ].includes(perm)
  },
  isOTPExpired: otp => otp.downloadTime + otp.timeout * 60 > new Date().getTime()
};