/* eslint-disable no-prototype-builtins */
class ArchbaseObjectHelper {
  getNestedProperty(object, property) {
    if (object && typeof object === 'object') {
      if (typeof property === 'string' && property !== '') {
        const split = property.split('.')
        return split.reduce((obj, prop) => {
          return obj && obj[prop]
        }, object)
      }
      if (typeof property === 'number') {
        return object[property]
      }
      return object
    }
    return object
  }

  hasNestedProperty(object, property, options) {
    options = options || {}
    if (object && typeof object === 'object') {
      if (typeof property === 'string' && property !== '') {
        const split = property.split('.')
        return split.reduce((obj, prop, idx, array) => {
          if (idx === array.length - 1) {
            if (options.own) {
              return !!(obj && obj.hasOwnProperty(prop))
            }
            return !!(obj !== null && typeof obj === 'object' && prop in obj)
          }
          return obj && obj[prop]
        }, object)
      }
      if (typeof property === 'number') {
        return property in object
      }
      return false
    }
    return false
  }

  setNestedProperty(object, property, value) {
    if (object && typeof object === 'object') {
      if (typeof property === 'string' && property !== '') {
        const split = property.split('.')
        return split.reduce((obj, prop, idx) => {
          obj[prop] = obj[prop] || {}
          if (split.length === idx + 1) {
            obj[prop] = value
          }
          return obj[prop]
        }, object)
      }
      if (typeof property === 'number') {
        object[property] = value
        return object[property]
      }
      return object
    }
    return object
  }

  isInNestedProperty(object, property, objectInPath, options) {
    options = options || {}

    if (object && typeof object === 'object') {
      if (typeof property === 'string' && property !== '') {
        const split = property.split('.')
        let isIn = false
        const pathExists = !!split.reduce((obj, prop) => {
          isIn = isIn || obj === objectInPath || (!!obj && obj[prop] === objectInPath)
          return obj && obj[prop]
        }, object)

        if (options.validPath) {
          return isIn && pathExists
        }
        return isIn
      }
      return false
    }
    return false
  }

  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false
    }

    return true
  }
}

const instance = new ArchbaseObjectHelper()
export { instance as ArchbaseObjectHelper }
