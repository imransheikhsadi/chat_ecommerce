import React from 'react'

export default function Hide({ hide, children, fallback }) {
  if (Boolean(hide)) {
    return fallback ? <>{fallback}</> : null
  }
  return (
    <>
      {children}
    </>
  )
}
