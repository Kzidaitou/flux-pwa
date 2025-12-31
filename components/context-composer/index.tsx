
import React from 'react'

interface ProviderComposerProps {
  providers: React.ReactElement[]
  children: React.ReactNode
}

/**
 * 扁平化 Provider 组合组件
 */
export const ProviderComposer: React.FC<ProviderComposerProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, provider) => {
        // Fix: Pass children as the third argument to React.cloneElement to avoid strict prop type checking on the second argument object literal
        return React.cloneElement(provider, {}, acc)
      }, children)}
    </>
  )
}