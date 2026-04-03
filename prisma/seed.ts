import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.person.createMany({
    data: [
      { name: 'John Doe', phoneNumber: '09171234567', email: 'john@example.com' },
      { name: 'Jane Smith', phoneNumber: '09281234567', email: 'jane@example.com' },
      { name: 'Alice Johnson', phoneNumber: '09351234567', email: 'alice@example.com' },
      { name: 'Bob Williams', phoneNumber: '09461234567', email: 'bob@example.com' },
      { name: 'Charlie Brown', phoneNumber: '09571234567', email: 'charlie@example.com' },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
