import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const FALLBACK_SERVICES = [
  { id: 's1', name: 'Haircut', category: 'Hair', gender: 'MEN', description: 'Classic precision haircut styled to your preference.', price: 300, duration: 30, status: 'ACTIVE' },
  { id: 's2', name: 'Premium Haircut', category: 'Hair', gender: 'MEN', description: 'Luxury haircut with wash, blow-dry and styling.', price: 500, duration: 45, status: 'ACTIVE' },
  { id: 's3', name: 'Hair Styling', category: 'Hair', gender: 'MEN', description: 'Professional hair styling for events & special occasions.', price: 400, duration: 30, status: 'ACTIVE' },
  { id: 's4', name: 'Beard Trim & Styling', category: 'Grooming', gender: 'MEN', description: 'Full beard grooming with conditioning and sculpting.', price: 350, duration: 30, status: 'ACTIVE' },
  { id: 's5', name: 'Hair Spa', category: 'Spa', gender: 'MEN', description: 'Deep conditioning hair spa for strong, healthy hair.', price: 700, duration: 60, status: 'ACTIVE' },
  { id: 's6', name: 'Facial & Cleanup', category: 'Skin', gender: 'MEN', description: 'Rejuvenating facial treatment for cleaner, fresher skin.', price: 600, duration: 45, status: 'ACTIVE' },
  { id: 's7', name: "Women's Haircut", category: 'Hair', gender: 'WOMEN', description: 'Expert haircut and styling for any hair type.', price: 500, duration: 45, status: 'ACTIVE' },
  { id: 's8', name: 'Women Hair Spa', category: 'Spa', gender: 'WOMEN', description: 'Luxurious hair spa for silky, nourished hair.', price: 1200, duration: 75, status: 'ACTIVE' },
  { id: 's9', name: 'Advanced Facial', category: 'Skin', gender: 'WOMEN', description: 'Deep cleanse facial with serums and masks for radiant skin.', price: 1500, duration: 60, status: 'ACTIVE' },
  { id: 's10', name: 'Full Beauty Package', category: 'Package', gender: 'WOMEN', description: 'Haircut + facial + waxing + manicure + pedicure.', price: 3999, duration: 240, status: 'ACTIVE' }
];

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { category: 'asc' }
    });

    if (!services || services.length === 0) {
      return NextResponse.json({ services: FALLBACK_SERVICES }, { status: 200 });
    }
    
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ services: FALLBACK_SERVICES }, { status: 200 });
  }
}

