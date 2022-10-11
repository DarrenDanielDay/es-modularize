// @ts-expect-error Dynamic Implementation
export const polyfillProcess = (): NodeJS.Process => ({
  env: {
    NODE_ENV: 'development',
  }
})