import React, { ReactNode, Fragment, useEffect, useState } from 'react'

const NoSSR = ({ children, fallback = null }: {
  children: ReactNode,
  fallback?: ReactNode,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return <Fragment>{isMounted ? children : fallback}</Fragment>
}

export default NoSSR;
