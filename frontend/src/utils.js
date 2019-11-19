export const truncateDecimals = (number, digits) => {
  let multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

export const humanSize = nbytes => {
  let suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  let f = `${nbytes}`;
  while (nbytes >= 1024 && i < suffixes.length - 1) {
    nbytes /= 1024;
    ++i;
    f = truncateDecimals(nbytes, 2);
  }
  return `${nbytes} ${suffixes[i]}`;
};