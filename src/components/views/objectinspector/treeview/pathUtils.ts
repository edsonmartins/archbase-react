export const DEFAULT_ROOT_PATH = '$'

const WILDCARD = '*'

export function hasChildNodes(data, dataIterator) {
  return !dataIterator(data).next().done
}

export const wildcardPathsFromLevel = (level: any) => {
  // i is depth
  return Array.from({ length: level }, (_, i) =>
    [DEFAULT_ROOT_PATH].concat(Array.from({ length: i }, () => '*')).join('.')
  )
}

export const getExpandedPaths = (
  data,
  dataIterator,
  expandPaths,
  expandLevel: any,
  prevExpandedPaths
) => {
  let res: string[] = wildcardPathsFromLevel(expandLevel)
  let wildcardPaths: string[] = []
  wildcardPaths
    .concat(res)
    .concat(expandPaths)
    .filter((path) => typeof path === 'string') // could be undefined

  const expandedPaths: any[] = []
  wildcardPaths.forEach((wildcardPath: any) => {
    const keyPaths = wildcardPath.split('.')
    const populatePaths = (curData, curPath: any, depth) => {
      if (depth === keyPaths.length) {
        expandedPaths.push(curPath)
        return
      }
      const key = keyPaths[depth]
      if (depth === 0) {
        if (
          hasChildNodes(curData, dataIterator) &&
          (key === DEFAULT_ROOT_PATH || key === WILDCARD)
        ) {
          populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1)
        }
      } else {
        if (key === WILDCARD) {
          for (const { name, data } of dataIterator(curData)) {
            if (hasChildNodes(data, dataIterator)) {
              populatePaths(data, `${curPath}.${name}`, depth + 1)
            }
          }
        } else {
          const value = curData[key]
          if (hasChildNodes(value, dataIterator)) {
            populatePaths(value, `${curPath}.${key}`, depth + 1)
          }
        }
      }
    }

    populatePaths(data, '', 0)
  })

  return expandedPaths.reduce(
    (obj, path) => {
      obj[path] = true
      return obj
    },
    { ...prevExpandedPaths }
  )
}
