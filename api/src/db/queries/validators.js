

module.exports = {
  otpTime: otpTime => {
    return !isNaN(parseInt(otpTime));
  },
  defaultPermission: perm => {
    return [
      'public',
      'private'
    ].includes(perm)
  }
};