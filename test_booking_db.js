const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    const service = await prisma.service.findFirst();
    console.log("User:", user?.id, "Service:", service?.id);
    
    if (!user || !service) {
      console.log("Missing user or service in DB!");
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        booking_number: `SS-TEST-${Math.floor(Math.random() * 100000)}`,
        user_id: user.id,
        service_id: service.id,
        booking_date: new Date(),
        booking_time: '10:00 AM',
        notes: 'test',
        payment_preference: 'PAY_AFTER_SERVICE',
        total_amount: Number(service.price),
        status: "REQUESTED",
        payments: {
          create: {
            amount: Number(service.price),
            payment_method: 'CASH',
            payment_status: 'PAY_AFTER_SERVICE'
          }
        },
        notifications: {
          create: {
            user_id: user.id,
            title: "Booking Request Submitted",
            message: `Your request for booking has been submitted.`
          }
        }
      }
    });
    console.log("SUCCESS creating booking:", booking.id);
  } catch (err) {
    console.error("ERROR creating booking:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
