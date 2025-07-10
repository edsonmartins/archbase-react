// Mock implementation of query-string for Jest tests
module.exports = {
  default: {
    parse: jest.fn((str) => {
      const params = {};
      if (str) {
        str.split('&').forEach(param => {
          const [key, value] = param.split('=');
          params[key] = decodeURIComponent(value || '');
        });
      }
      return params;
    }),
    stringify: jest.fn((obj) => {
      return Object.keys(obj)
        .map(key => `${key}=${encodeURIComponent(obj[key])}`)
        .join('&');
    })
  },
  parse: jest.fn((str) => {
    const params = {};
    if (str) {
      str.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value || '');
      });
    }
    return params;
  }),
  stringify: jest.fn((obj) => {
    return Object.keys(obj)
      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&');
  })
};