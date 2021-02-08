import React from 'react'
/**
 * Create copies of the given component
 * @example cloneComponent(10)(<ComponentToDuplicate/>) will generate 10 copies
 */
export const cloneComponent = (max: number) =>
    (element: React.ReactElement) => [...Array(max).keys()].map(index => React.cloneElement(element, { key: index }))
