import crypto from 'node:crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const demoUsers = [
  { email: 'alex.morgan@example.com', username: 'alexmorgan', displayName: 'Alex Morgan', bio: 'Full-stack developer building useful products with React, Node.js and PostgreSQL.' },
  { email: 'sarah.wilson@example.com', username: 'sarahwilson', displayName: 'Sarah Wilson', bio: 'Product designer focused on clean interfaces, accessibility and developer experience.' },
  { email: 'daniel.kim@example.com', username: 'danielkim', displayName: 'Daniel Kim', bio: 'Cybersecurity learner exploring SOC operations, detection engineering and secure systems.' },
  { email: 'maya.patel@example.com', username: 'mayapatel', displayName: 'Maya Patel', bio: 'AI and data enthusiast sharing experiments, practical notes and engineering lessons.' },
  { email: 'ryan.thomas@example.com', username: 'ryanthomas', displayName: 'Ryan Thomas', bio: 'Software engineer interested in backend systems, APIs and distributed applications.' },
  { email: 'emma.davis@example.com', username: 'emmadavis', displayName: 'Emma Davis', bio: 'UI/UX designer who likes turning complex workflows into simple experiences.' },
]

async function main() {
  const passwordHash = hashPassword('Demo@12345')
  const users = {}

  for (const data of demoUsers) {
    users[data.username] = await prisma.user.upsert({
      where: { username: data.username },
      update: { displayName: data.displayName, bio: data.bio },
      create: { ...data, passwordHash },
    })
  }

  const posts = [
    ['alexmorgan', 'Just shipped a small API improvement today. Clean interfaces make everything easier to maintain.'],
    ['sarahwilson', 'Working on a mobile-first dashboard concept. The best UI is usually the one that removes unnecessary decisions.'],
    ['danielkim', 'Learning more about detection engineering this week. Small, testable rules beat a huge pile of noisy alerts.'],
    ['mayapatel', 'Experimenting with practical AI workflows. Still convinced that good data and clear requirements matter more than hype.'],
    ['ryanthomas', 'PostgreSQL indexing reminder: measure the query before and after the change. Assumptions are not benchmarks.'],
    ['emmadavis', 'Design systems are much easier to scale when components have clear states and predictable behavior.'],
  ]

  for (const [username, content] of posts) {
    const user = users[username]
    const exists = await prisma.post.findFirst({ where: { authorId: user.id, content } })
    if (!exists) await prisma.post.create({ data: { authorId: user.id, content } })
  }

  const followPairs = [
    ['alexmorgan', 'danielkim'], ['alexmorgan', 'sarahwilson'],
    ['sarahwilson', 'emmadavis'], ['sarahwilson', 'mayapatel'],
    ['danielkim', 'ryanthomas'], ['danielkim', 'alexmorgan'],
    ['mayapatel', 'alexmorgan'], ['ryanthomas', 'danielkim'],
    ['emmadavis', 'sarahwilson'], ['emmadavis', 'mayaapatel'],
  ]

  for (const [follower, following] of followPairs) {
    if (!users[follower] || !users[following]) continue
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: users[follower].id, followingId: users[following].id } },
      update: {},
      create: { followerId: users[follower].id, followingId: users[following].id },
    })
  }

  const sender = users.alexmorgan
  const receiver = users.mayapatel
  const existingRequest = await prisma.connectionRequest.findUnique({ where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } } })
  if (!existingRequest) await prisma.connectionRequest.create({ data: { senderId: sender.id, receiverId: receiver.id, status: 'PENDING' } })

  console.log('Demo users ready. Demo password: Demo@12345')
}

main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(async () => { await prisma.$disconnect() })
