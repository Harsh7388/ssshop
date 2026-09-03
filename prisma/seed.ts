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
        title: 'Weekend Grooming Package',
        description: 'Premium haircut, beard styling & head massage at an exclusive price. Valid weekends only.',
        discount: 17,
        discountType: 'PERCENTAGE',
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: 'ACTIVE',
        gender: 'MEN',
      },
      {
        title: '20% OFF on All Hair Spa',
        description: 'Get 20% discount on all hair spa and treatment services this month.',
        discount: 20,
        discountType: 'PERCENTAGE',
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'ACTIVE',
        gender: 'WOMEN',
      },
    ]
  });

  // --- Services ---
  await prisma.service.deleteMany();
  const menServices = await Promise.all([
    prisma.service.create({ data: { name: 'Haircut', category: 'Hair', gender: 'MEN', description: 'Classic precision haircut styled to your preference.', price: 300, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Premium Haircut', category: 'Hair', gender: 'MEN', description: 'Luxury haircut with wash, blow-dry and styling.', price: 500, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Styling', category: 'Hair', gender: 'MEN', description: 'Professional hair styling for events & special occasions.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Beard Trim', category: 'Grooming', gender: 'MEN', description: 'Precise beard trim and shaping.', price: 200, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Beard Styling', category: 'Grooming', gender: 'MEN', description: 'Full beard grooming with conditioning and sculpting.', price: 350, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Shaving', category: 'Grooming', gender: 'MEN', description: 'Classic straight razor shave with hot towel treatment.', price: 250, duration: 25, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Coloring', category: 'Hair', gender: 'MEN', description: 'Professional hair coloring with premium color products.', price: 800, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Spa', category: 'Spa', gender: 'MEN', description: 'Deep conditioning hair spa for strong, healthy hair.', price: 700, duration: 60, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Facial', category: 'Skin', gender: 'MEN', description: 'Rejuvenating facial treatment for cleaner, fresher skin.', price: 600, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Head Massage', category: 'Spa', gender: 'MEN', description: 'Relaxing head and scalp massage with essential oils.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Grooming Package', category: 'Package', gender: 'MEN', description: 'Premium haircut + beard styling + head massage + facial.', price: 1499, duration: 120, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Manicure', category: 'Nail', gender: 'MEN', description: 'Professional hand and nail care treatment.', price: 350, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Pedicure', category: 'Nail', gender: 'MEN', description: 'Relaxing foot care and nail treatment.', price: 450, duration: 45, status: 'ACTIVE' } }),
  ]);

  const womenServices = await Promise.all([
    // Real Waxing Prices from Menu (Honey & Rica options)
    prisma.service.create({ data: { name: 'Full Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Smooth full arm waxing using natural Honey wax.', price: 200, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Premium painless full arm waxing using imported Rica wax.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Complete leg waxing with Honey wax.', price: 450, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Luxury full leg waxing with Rica liposoluble wax.', price: 650, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half arm waxing with gentle Honey wax.', price: 150, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half arm waxing using Rica wax for sensitive skin.', price: 300, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half leg waxing with natural Honey wax.', price: 250, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Half Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half leg waxing with premium Rica wax.', price: 400, duration: 30, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Under Arm\'s Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using Honey wax.', price: 50, duration: 15, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Under Arm\'s Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using Rica wax.', price: 100, duration: 15, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Face Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Gentle facial waxing with Honey wax.', price: 100, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Face Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Delicate facial hair removal with Rica wax.', price: 150, duration: 20, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Upper Lips Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Upper lip hair removal with Honey wax.', price: 20, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Upper Lips Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Upper lip hair removal with Rica wax.', price: 50, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Chin Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Chin hair waxing using Honey wax.', price: 20, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Chin Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Chin hair waxing using Rica wax.', price: 50, duration: 10, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Body Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full body waxing with Honey wax.', price: 1000, duration: 90, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Full Body Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full body waxing with premium Rica wax.', price: 1500, duration: 90, status: 'ACTIVE' } }),

    // Other Women Services
    prisma.service.create({ data: { name: "Women's Haircut", category: 'Hair', gender: 'WOMEN', description: 'Expert haircut and styling for any hair type.', price: 500, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Styling', category: 'Hair', gender: 'WOMEN', description: 'Professional styling with blow-dry, curls or straightening.', price: 600, duration: 60, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Hair Spa', category: 'Spa', gender: 'WOMEN', description: 'Luxurious hair spa for silky, nourished hair.', price: 1200, duration: 75, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Advanced Facial', category: 'Skin', gender: 'WOMEN', description: 'Deep cleanse facial with serums and masks for radiant skin.', price: 1500, duration: 60, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Manicure', category: 'Nail', gender: 'WOMEN', description: 'Luxury manicure with nail art option.', price: 500, duration: 45, status: 'ACTIVE' } }),
    prisma.service.create({ data: { name: 'Pedicure', category: 'Nail', gender: 'WOMEN', description: 'Spa pedicure with scrub, massage and nail polish.', price: 700, duration: 60, status: 'ACTIVE' } }),
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
      service_id: menServices[1].id, // Premium Haircut
      manager_id: manager.id,
      assigned_staff: 'Rahul Sharma',
      booking_date: new Date(Date.now() + 86400000),
      booking_time: '04:00 PM',
      status: 'CONFIRMED',
      payment_preference: 'PAY_AFTER_SERVICE',
      total_amount: menServices[1].price,
      notes: 'Customer requested styling advice.',
    }
  });

  await prisma.payment.create({
    data: {
      booking_id: harshBooking.id,
      amount: menServices[1].price,
      payment_method: 'CASH',
      payment_status: 'PAY_AFTER_SERVICE',
    }
  });

  await prisma.notification.create({
    data: {
      user_id: harshUser.id,
      booking_id: harshBooking.id,
      title: 'Appointment Confirmed 🎉',
      message: `Your SS Hair Studio appointment for Premium Haircut has been confirmed for 04:00 PM with Rahul Sharma.`,
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
