const getTimestamp = () => {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

const formatTimestamp = (originalDate) => {
  const date = new Date(originalDate)
  return date.toLocaleDateString()
}
  
  export const DATE_UTILS = {
    getTimestamp, formatTimestamp
  };