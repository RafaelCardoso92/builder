import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const tradeCategories = [
  {
    name: 'Building & Construction',
    slug: 'building-construction',
    icon: 'building',
    children: [
      { name: 'General Builder', slug: 'general-builder' },
      { name: 'Extension Specialist', slug: 'extension-specialist' },
      { name: 'Loft Conversion', slug: 'loft-conversion' },
      { name: 'Garage Conversion', slug: 'garage-conversion' },
      { name: 'New Build', slug: 'new-build' },
      { name: 'Groundworks', slug: 'groundworks' },
      { name: 'Bricklayer', slug: 'bricklayer' },
      { name: 'Stonemason', slug: 'stonemason' },
    ],
  },
  {
    name: 'Roofing',
    slug: 'roofing',
    icon: 'home',
    children: [
      { name: 'Roofer', slug: 'roofer' },
      { name: 'Flat Roofing', slug: 'flat-roofing' },
      { name: 'Chimney Specialist', slug: 'chimney-specialist' },
      { name: 'Guttering', slug: 'guttering' },
    ],
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    icon: 'zap',
    children: [
      { name: 'Electrician', slug: 'electrician' },
      { name: 'Rewiring', slug: 'rewiring' },
      { name: 'EV Charger Installation', slug: 'ev-charger-installation' },
      { name: 'Smart Home', slug: 'smart-home' },
    ],
  },
  {
    name: 'Plumbing & Heating',
    slug: 'plumbing-heating',
    icon: 'droplet',
    children: [
      { name: 'Plumber', slug: 'plumber' },
      { name: 'Gas Engineer', slug: 'gas-engineer' },
      { name: 'Boiler Installation', slug: 'boiler-installation' },
      { name: 'Bathroom Fitter', slug: 'bathroom-fitter' },
      { name: 'Underfloor Heating', slug: 'underfloor-heating' },
    ],
  },
  {
    name: 'Carpentry & Joinery',
    slug: 'carpentry-joinery',
    icon: 'hammer',
    children: [
      { name: 'Carpenter', slug: 'carpenter' },
      { name: 'Kitchen Fitter', slug: 'kitchen-fitter' },
      { name: 'Staircase Specialist', slug: 'staircase-specialist' },
      { name: 'Bespoke Furniture', slug: 'bespoke-furniture' },
    ],
  },
  {
    name: 'Plastering & Rendering',
    slug: 'plastering-rendering',
    icon: 'layers',
    children: [
      { name: 'Plasterer', slug: 'plasterer' },
      { name: 'Renderer', slug: 'renderer' },
      { name: 'Dry Lining', slug: 'dry-lining' },
    ],
  },
  {
    name: 'Decorating',
    slug: 'decorating',
    icon: 'paintbrush',
    children: [
      { name: 'Painter & Decorator', slug: 'painter-decorator' },
      { name: 'Wallpaper Specialist', slug: 'wallpaper-specialist' },
    ],
  },
  {
    name: 'Flooring',
    slug: 'flooring',
    icon: 'grid',
    children: [
      { name: 'Flooring Specialist', slug: 'flooring-specialist' },
      { name: 'Carpet Fitter', slug: 'carpet-fitter' },
      { name: 'Tiler', slug: 'tiler' },
    ],
  },
  {
    name: 'Windows & Doors',
    slug: 'windows-doors',
    icon: 'square',
    children: [
      { name: 'Window Fitter', slug: 'window-fitter' },
      { name: 'Door Specialist', slug: 'door-specialist' },
      { name: 'Locksmith', slug: 'locksmith' },
    ],
  },
  {
    name: 'Gardens & Landscaping',
    slug: 'gardens-landscaping',
    icon: 'trees',
    children: [
      { name: 'Landscaper', slug: 'landscaper' },
      { name: 'Gardener', slug: 'gardener' },
      { name: 'Tree Surgeon', slug: 'tree-surgeon' },
      { name: 'Fencing', slug: 'fencing' },
      { name: 'Paving & Driveways', slug: 'paving-driveways' },
    ],
  },
  {
    name: 'Cleaning',
    slug: 'cleaning',
    icon: 'sparkles',
    children: [
      { name: 'Domestic Cleaner', slug: 'domestic-cleaner' },
      { name: 'End of Tenancy Cleaning', slug: 'end-of-tenancy-cleaning' },
      { name: 'Window Cleaner', slug: 'window-cleaner' },
      { name: 'Carpet Cleaner', slug: 'carpet-cleaner' },
    ],
  },
  {
    name: 'Other Services',
    slug: 'other-services',
    icon: 'wrench',
    children: [
      { name: 'Handyman', slug: 'handyman' },
      { name: 'Removals', slug: 'removals' },
      { name: 'Pest Control', slug: 'pest-control' },
      { name: 'Aerial & Satellite', slug: 'aerial-satellite' },
      { name: 'Security Systems', slug: 'security-systems' },
      { name: 'Damp Proofing', slug: 'damp-proofing' },
      { name: 'Drainage', slug: 'drainage' },
    ],
  },
]

async function main() {
  console.log('Seeding database...')

  // Seed trade categories
  console.log('Creating trade categories...')
  for (let i = 0; i < tradeCategories.length; i++) {
    const category = tradeCategories[i]

    const parent = await prisma.trade.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        sortOrder: i,
      },
    })

    console.log(`  Created category: ${parent.name}`)

    for (let j = 0; j < category.children.length; j++) {
      const child = category.children[j]
      await prisma.trade.upsert({
        where: { slug: child.slug },
        update: {},
        create: {
          name: child.name,
          slug: child.slug,
          parentId: parent.id,
          sortOrder: j,
        },
      })
    }
  }

  // Create test users for Cypress tests
  console.log('Creating test users...')

  // 1. Test Customer
  const customerPassword = await bcrypt.hash('password123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  })
  console.log(`  Created customer: ${customer.email}`)

  // 2. Test Tradesperson (Plumber)
  const plumberPassword = await bcrypt.hash('password123', 10)
  const plumber = await prisma.user.upsert({
    where: { email: 'plumber@test.com' },
    update: {},
    create: {
      email: 'plumber@test.com',
      password: plumberPassword,
      name: 'John Smith',
      role: 'TRADESPERSON',
    },
  })
  console.log(`  Created tradesperson: ${plumber.email}`)

  // Get the plumber trade for the profile
  const plumberTrade = await prisma.trade.findUnique({
    where: { slug: 'plumber' },
  })

  // Create tradesperson profile
  if (plumberTrade) {
    const existingProfile = await prisma.tradesProfile.findUnique({
      where: { userId: plumber.id },
    })

    if (!existingProfile) {
      const profile = await prisma.tradesProfile.create({
        data: {
          userId: plumber.id,
          businessName: 'John Smith Plumbing',
          slug: 'john-smith-plumbing',
          tagline: 'Professional plumbing services',
          description: 'Experienced plumber offering reliable services for all your plumbing needs.',
          phone: '07700 900123',
          email: 'plumber@test.com',
          city: 'London',
          postcode: 'SW1A 1AA',
          coverageRadius: 25,
          isActive: true,
          isVerified: true,
          verifiedAt: new Date(),
          subscriptionTier: 'FREE',
          averageRating: 4.5,
          reviewCount: 10,
          responseRate: 95,
          responseTime: 'Within 1 hour',
        },
      })

      // Link profile to plumber trade
      await prisma.tradesProfileTrade.create({
        data: {
          profileId: profile.id,
          tradeId: plumberTrade.id,
          yearsExperience: 10,
        },
      })

      console.log(`  Created profile: ${profile.businessName}`)
    }
  }

  // 3. Test Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@builder.co.uk' },
    update: {},
    create: {
      email: 'admin@builder.co.uk',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log(`  Created admin: ${admin.email}`)

  // Create admin user from env vars if provided (for production)
  const envAdminEmail = process.env.ADMIN_EMAIL
  const envAdminPassword = process.env.ADMIN_PASSWORD

  if (envAdminEmail && envAdminPassword && envAdminEmail !== 'admin@builder.co.uk') {
    const hashedEnvPassword = await bcrypt.hash(envAdminPassword, 10)
    await prisma.user.upsert({
      where: { email: envAdminEmail },
      update: {},
      create: {
        email: envAdminEmail,
        password: hashedEnvPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    })
    console.log(`  Created env admin: ${envAdminEmail}`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
