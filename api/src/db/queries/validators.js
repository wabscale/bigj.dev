

module.exports = {
  defaultPermission: perm => {
    return [
      'public',
      'private'
    ].includes(perm)
  },
  siteTitle: () => true,
  isOTPExpired: otp => otp.downloadTime + otp.timeout * 60 > new Date().getTime()
};