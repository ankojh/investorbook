export default function debounce(func, timeInMS) {

  let timeOut = null;

  return (...args) => {
    clearTimeout(timeOut);
    return new Promise((resolve, reject) => {
      timeOut = setTimeout(() => {
        resolve(func(...args))
      }, timeInMS);
    });
  }
}