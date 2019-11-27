

module.exports = {
  defaultPermission: perm => {
    return ['1','0'].includes(perm)
  },
  siteTitle: () => true,
  isOTPExpired: otp => otp.downloadTime + otp.timeout * 60 > new Date().getTime()
};