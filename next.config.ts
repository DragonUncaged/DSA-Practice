import path from 'node:path'
import type { NextConfig } from 'next'

const srcDir = path.join(process.cwd(), 'src')

const nextConfig: NextConfig = {
  sassOptions: {
    // lets any *.module.scss do `@use 'styles/vars' as *;`
    // `loadPaths` is the modern Sass API; `includePaths` covers the legacy one.
    loadPaths: [srcDir],
    includePaths: [srcDir],
  },
}

export default nextConfig
