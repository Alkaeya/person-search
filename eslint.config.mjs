import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default [
  {
    ignores: ['components/ui/*.tsx', 'generated/**'],
  },
  ...nextVitals,
  ...nextTypescript,
]
