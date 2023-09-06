import React from 'react'

const useArchbasePassiveLayoutEffect =
  React[
    typeof document !== 'undefined' && document.createElement !== void 0
      ? 'useLayoutEffect'
      : 'useEffect'
  ]

export default useArchbasePassiveLayoutEffect