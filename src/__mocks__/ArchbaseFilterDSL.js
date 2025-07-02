// Mock implementation of ArchbaseFilterDSL for Jest tests
module.exports = {
  ArchbaseFilterDSL: class MockArchbaseFilterDSL {
    constructor() {
      this.filter = {};
    }
    
    buildFrom(filter, sort) {
      this.filter = filter;
      this.sort = sort;
      return this;
    }
    
    toJSON() {
      return JSON.stringify(this.filter);
    }
  }
};