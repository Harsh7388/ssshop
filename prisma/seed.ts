import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding SS SALON database...');

  // Clean tables in reverse dependency order
  await prisma.feedback.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.offer.createMany({
    data: [
      {
        title: 'Hair Spa & Advance Cut Combo',
        description: 'Rejuvenating deep conditioning Hair Spa + precision Advance Hair Cut at a special combo price.',
        discount: 15,
        discountType: 'PERCENTAGE',
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'ACTIVE',
        gender: 'ALL',
      },
      {
        title: '20% OFF on Hair Treatments',
        description: 'Get 20% discount on Keratin, Kera Smooth, Botox & Cysteine treatments this month.',
        discount: 20,
        discountType: 'PERCENTAGE',
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'ACTIVE',
        gender: 'ALL',
      },
    ]
  });

  // --- Services (From Official Hair Care & Waxing Menus) ---
  await prisma.service.deleteMany();

  // 1. Hair Care - Basic & Styling
  const hairCareServices = await Promise.all([
    prisma.service.create({ data: { name: 'Hair Cut (Trimming)', category: 'Hair Care', gender: 'ALL', description: 'Split-end trimming, shaping, and length maintenance.', price: 150, duration: 25, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Cut (Advance)', category: 'Hair Care', gender: 'ALL', description: 'Advanced precision haircut styled according to your facial structure.', price: 300, duration: 40, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Wash', category: 'Hair Care', gender: 'ALL', description: 'Invigorating hair and scalp wash with professional salon shampoo.', price: 150, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Head Massage', category: 'Hair Care', gender: 'ALL', description: 'Deeply relaxing head and scalp massage with nourishing therapeutic oils.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Spa', category: 'Hair Care', gender: 'ALL', description: 'Intensive deep conditioning hair spa for damaged, dull, or dry hair.', price: 700, duration: 60, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Root Touchup', category: 'Hair Care', gender: 'ALL', description: 'Professional root touchup colour application for uniform hair tone.', price: 800, duration: 60, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Highlights (Per Strip)', category: 'Hair Care', gender: 'ALL', description: 'Single foil highlight streak or strip with custom toning.', price: 150, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Highlights (Full)', category: 'Hair Care', gender: 'ALL', description: 'Full head dimensional highlights for luminous texture and contrast.', price: 3000, duration: 120, status: 'ACTIVE' } }),
  ]);

  // 2. Hair Care - Treatments & Colouring (S / M / B variants)
  const hairTreatmentServices = await Promise.all([
    // Global Colour
    prisma.service.create({ data: { name: 'Global Colour (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for short hair.', price: 2000, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Global Colour (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for medium hair.', price: 3000, duration: 105, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Global Colour (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for long / thick hair.', price: 3500, duration: 120, status: 'ACTIVE' } }),

    // Kera Smooth
    prisma.service.create({ data: { name: 'Kera Smooth (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for sleek, glossy short hair.', price: 4000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Kera Smooth (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for frizz-free medium hair.', price: 5000, duration: 150, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Kera Smooth (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for ultra-smooth long hair.', price: 6500, duration: 180, status: 'ACTIVE' } }),

    // Botox Treatment
    prisma.service.create({ data: { name: 'Botox Treatment (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for short hair.', price: 2500, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Botox Treatment (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Botox Treatment (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for long hair.', price: 4000, duration: 150, status: 'ACTIVE' } }),

    // Cysteine Treatment
    prisma.service.create({ data: { name: 'Cysteine Treatment (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for short hair.', price: 2500, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Cysteine Treatment (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Cysteine Treatment (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for long hair.', price: 4000, duration: 150, status: 'ACTIVE' } }),

    // Keratin
    prisma.service.create({ data: { name: 'Keratin (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for short hair.', price: 2499, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Keratin (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Keratin (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for long hair.', price: 3500, duration: 150, status: 'ACTIVE' } }),

    // Hair Smoothing
    prisma.service.create({ data: { name: 'Hair Smoothing (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable short hair.', price: 3000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Smoothing (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable medium hair.', price: 3500, duration: 150, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Smoothing (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable long hair.', price: 4500, duration: 180, status: 'ACTIVE' } }),

    // Nanoplastia (Nano Plaster)
    prisma.service.create({ data: { name: 'Nanoplastia (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for short hair.', price: 3000, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Nanoplastia (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for medium hair.', price: 3500, duration: 150, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Nanoplastia (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for long hair.', price: 4000, duration: 180, status: 'ACTIVE' } }),
  ]);

  // 3. Waxing (Honey & Rica Options)
  const waxingServices = await Promise.all([
    prisma.service.create({ data: { name: 'Full Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Smooth full arms waxing using natural Honey wax.', price: 200, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Gentle, pain-free full arms waxing using premium Rica liposoluble wax.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full legs waxing with Honey wax.', price: 450, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Premium full legs waxing using Rica wax for smooth sensitive skin.', price: 650, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half arms waxing with soothing Honey wax.', price: 150, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half arms waxing with luxury Rica wax.', price: 300, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half legs waxing with Honey wax.', price: 250, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half legs waxing with Rica wax.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Under Arm\'s Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using gentle Honey wax.', price: 50, duration: 15, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Under Arm\'s Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using soothing Rica wax.', price: 100, duration: 15, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Face Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Gentle facial waxing with Honey wax.', price: 100, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Face Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Delicate facial hair removal with Rica wax.', price: 150, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Upper Lips Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Quick and clean upper lip hair removal with Honey wax.', price: 20, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Upper Lips Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Delicate upper lip hair removal with Rica wax.', price: 50, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Chin Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Chin hair removal with Honey wax.', price: 20, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Chin Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Precise chin hair removal with Rica wax.', price: 50, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Body Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full body waxing treatment using premium imported Rica wax.', price: 1500, duration: 90, status: 'ACTIVE' } }),
  ]);

  // --- Managers ---
  await prisma.serviceManager.deleteMany();
  const manager1Hash = await bcrypt.hash('7388', 10);
  const manager = await prisma.serviceManager.create({
    data: { name: 'Rahul Sharma', email: 'service@gmail.com', phone: '8087799315', password_hash: manager1Hash, role: 'MANAGER', status: 'ACTIVE' }
  });
  await prisma.serviceManager.create({
    data: { name: 'Priya Singh', email: 'priya@sshairstudio.com', phone: '8087799315', password_hash: await bcrypt.hash('manager2', 10), role: 'MANAGER', status: 'ACTIVE' }
  });
  const adminHash = await bcrypt.hash('7388', 10);
  await prisma.serviceManager.create({
    data: { name: 'Sona Admin', email: 'sona@gmail.com', phone: '8087799315', password_hash: adminHash, role: 'ADMIN', status: 'ACTIVE' }
  });

  // --- Customers ---
  await prisma.user.deleteMany();
  const harshPw = await bcrypt.hash('password123', 10);
  const harshUser = await prisma.user.create({
    data: { name: 'Harsh Customer', email: 'harsh@gmail.com', phone: '8087799315', password_hash: harshPw, gender: 'Male', status: 'ACTIVE' }
  });

  const demoPw = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: { name: 'Demo Customer', email: 'demo@sshairstudio.com', phone: '8087799315', password_hash: demoPw, gender: 'Male', status: 'ACTIVE' }
  });

  // --- Bookings & Feedback ---
  await prisma.feedback.deleteMany();
  await prisma.booking.deleteMany();
    const harshBooking = await prisma.booking.create({
    data: {
      booking_number: 'SS-100001',
      user_id: harshUser.id,
      service_id: hairCareServices[1].id, // Hair Cut (Advance)
      manager_id: manager.id,
      assigned_staff: 'Rahul Sharma',
      booking_date: new Date(Date.now() + 86400000),
      booking_time: '04:00 PM',
      status: 'CONFIRMED',
      payment_preference: 'PAY_AFTER_SERVICE',
      total_amount: hairCareServices[1].price,
      notes: 'Customer requested consultation for hair styling.',
    }
  });

  await prisma.payment.create({
    data: {
      booking_id: harshBooking.id,
      amount: hairCareServices[1].price,
      payment_method: 'CASH',
      payment_status: 'PAY_AFTER_SERVICE',
    }
  });

  await prisma.notification.create({
    data: {
      user_id: harshUser.id,
      booking_id: harshBooking.id,
      title: 'Appointment Confirmed 🎉',
      message: `Your SS Hair Studio appointment for Hair Cut (Advance) has been confirmed for 04:00 PM with Rahul Sharma.`,
      read_status: false,
    }
  });

  console.log('✅ Seeding complete!');
  console.log('\n📝 Active Credentials:');
  console.log('   Harsh Customer: harsh@gmail.com / password123');
  console.log('   Manager: service@gmail.com / 7388');
  console.log('   Admin: sona@gmail.com / 7388');
  console.log('\n📝 Demo Credentials:');
  console.log('   Customer: demo@sssalon.com / demo123');
  console.log('   Manager: service@gmail.com / 7388');
  console.log('   Admin: sona@gmail.com / 7388');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
