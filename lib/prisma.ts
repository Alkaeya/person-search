import { PrismaClient } from '@/generated/prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

function buildPrismaDatasourceUrl() {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    return undefined
  }

  try {
    const url = new URL(rawUrl)
    const isPoolerHost = url.hostname.includes('-pooler.')

    if (isPoolerHost && !url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true')
    }

    return url.toString()
  } catch {
    return rawUrl
  }
}

const datasourceUrl = buildPrismaDatasourceUrl()

export const prisma =
  global.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
