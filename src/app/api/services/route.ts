import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const FALLBACK_SERVICES = [
  // Hair Care
  { id: 'hc1', name: 'Hair Cut (Trimming)', category: 'Hair Care', gender: 'ALL', description: 'Split-end trimming, shaping, and length maintenance.', price: 150, duration: 25, status: 'ACTIVE' },
  { id: 'hc2', name: 'Hair Cut (Advance)', category: 'Hair Care', gender: 'ALL', description: 'Advanced precision haircut styled according to your facial structure.', price: 300, duration: 40, status: 'ACTIVE' },
  { id: 'hc3', name: 'Hair Wash', category: 'Hair Care', gender: 'ALL', description: 'Invigorating hair and scalp wash with professional salon shampoo.', price: 150, duration: 20, status: 'ACTIVE' },
  { id: 'hc4', name: 'Head Massage', category: 'Hair Care', gender: 'ALL', description: 'Deeply relaxing head and scalp massage with nourishing therapeutic oils.', price: 400, duration: 30, status: 'ACTIVE' },
  { id: 'hc5', name: 'Hair Spa', category: 'Hair Care', gender: 'ALL', description: 'Intensive deep conditioning hair spa for damaged, dull, or dry hair.', price: 700, duration: 60, status: 'ACTIVE' },
  { id: 'hc6', name: 'Hair Root Touchup', category: 'Hair Care', gender: 'ALL', description: 'Professional root touchup colour application for uniform hair tone.', price: 800, duration: 60, status: 'ACTIVE' },
  { id: 'hc7', name: 'Highlights (Per Strip)', category: 'Hair Care', gender: 'ALL', description: 'Single foil highlight streak or strip with custom toning.', price: 150, duration: 30, status: 'ACTIVE' },
  { id: 'hc8', name: 'Highlights (Full)', category: 'Hair Care', gender: 'ALL', description: 'Full head dimensional highlights for luminous texture and contrast.', price: 3000, duration: 120, status: 'ACTIVE' },

  // Hair Treatments (S / M / B)
  { id: 'ht1', name: 'Global Colour (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for short hair.', price: 2000, duration: 90, status: 'ACTIVE' },
  { id: 'ht2', name: 'Global Colour (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for medium hair.', price: 3000, duration: 105, status: 'ACTIVE' },
  { id: 'ht3', name: 'Global Colour (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Complete global hair colouring for long / thick hair.', price: 3500, duration: 120, status: 'ACTIVE' },
  { id: 'ht4', name: 'Kera Smooth (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for sleek, glossy short hair.', price: 4000, duration: 120, status: 'ACTIVE' },
  { id: 'ht5', name: 'Kera Smooth (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for frizz-free medium hair.', price: 5000, duration: 150, status: 'ACTIVE' },
  { id: 'ht6', name: 'Kera Smooth (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Keratin smoothing treatment for ultra-smooth long hair.', price: 6500, duration: 180, status: 'ACTIVE' },
  { id: 'ht7', name: 'Botox Treatment (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for short hair.', price: 2500, duration: 90, status: 'ACTIVE' },
  { id: 'ht8', name: 'Botox Treatment (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' },
  { id: 'ht9', name: 'Botox Treatment (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Deep anti-aging & restoration hair botox for long hair.', price: 4000, duration: 150, status: 'ACTIVE' },
  { id: 'ht10', name: 'Cysteine Treatment (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for short hair.', price: 2500, duration: 90, status: 'ACTIVE' },
  { id: 'ht11', name: 'Cysteine Treatment (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' },
  { id: 'ht12', name: 'Cysteine Treatment (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Gentle protein curl control cysteine treatment for long hair.', price: 4000, duration: 150, status: 'ACTIVE' },
  { id: 'ht13', name: 'Keratin (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for short hair.', price: 2499, duration: 90, status: 'ACTIVE' },
  { id: 'ht14', name: 'Keratin (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for medium hair.', price: 3000, duration: 120, status: 'ACTIVE' },
  { id: 'ht15', name: 'Keratin (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Intensive keratin protein smoothening for long hair.', price: 3500, duration: 150, status: 'ACTIVE' },
  { id: 'ht16', name: 'Hair Smoothing (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable short hair.', price: 3000, duration: 120, status: 'ACTIVE' },
  { id: 'ht17', name: 'Hair Smoothing (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable medium hair.', price: 3500, duration: 150, status: 'ACTIVE' },
  { id: 'ht18', name: 'Hair Smoothing (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Silky hair smoothening for straight manageable long hair.', price: 4500, duration: 180, status: 'ACTIVE' },
  { id: 'ht19', name: 'Nanoplastia (Short Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for short hair.', price: 3000, duration: 120, status: 'ACTIVE' },
  { id: 'ht20', name: 'Nanoplastia (Medium Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for medium hair.', price: 3500, duration: 150, status: 'ACTIVE' },
  { id: 'ht21', name: 'Nanoplastia (Long Hair)', category: 'Hair Treatments', gender: 'ALL', description: 'Advanced organic nanoplastia realignment for long hair.', price: 4000, duration: 180, status: 'ACTIVE' },

  // Waxing (Honey & Rica)
  { id: 'wx1', name: 'Full Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Smooth full arms waxing using natural Honey wax.', price: 200, duration: 30, status: 'ACTIVE' },
  { id: 'wx2', name: 'Full Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Gentle, pain-free full arms waxing using premium Rica liposoluble wax.', price: 400, duration: 30, status: 'ACTIVE' },
  { id: 'wx3', name: 'Full Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full legs waxing with Honey wax.', price: 450, duration: 45, status: 'ACTIVE' },
  { id: 'wx4', name: 'Full Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Premium full legs waxing using Rica wax for smooth sensitive skin.', price: 650, duration: 45, status: 'ACTIVE' },
  { id: 'wx5', name: 'Half Hand Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half arms waxing with soothing Honey wax.', price: 150, duration: 20, status: 'ACTIVE' },
  { id: 'wx6', name: 'Half Hand Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half arms waxing with luxury Rica wax.', price: 300, duration: 20, status: 'ACTIVE' },
  { id: 'wx7', name: 'Half Leg Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Half legs waxing with Honey wax.', price: 250, duration: 30, status: 'ACTIVE' },
  { id: 'wx8', name: 'Half Leg Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Half legs waxing with Rica wax.', price: 400, duration: 30, status: 'ACTIVE' },
  { id: 'wx9', name: 'Under Arm\'s Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using gentle Honey wax.', price: 50, duration: 15, status: 'ACTIVE' },
  { id: 'wx10', name: 'Under Arm\'s Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Underarm waxing using soothing Rica wax.', price: 100, duration: 15, status: 'ACTIVE' },
  { id: 'wx11', name: 'Face Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Gentle facial waxing with Honey wax.', price: 100, duration: 20, status: 'ACTIVE' },
  { id: 'wx12', name: 'Face Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Delicate facial hair removal with Rica wax.', price: 150, duration: 20, status: 'ACTIVE' },
  { id: 'wx13', name: 'Upper Lips Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Quick and clean upper lip hair removal with Honey wax.', price: 20, duration: 10, status: 'ACTIVE' },
  { id: 'wx14', name: 'Upper Lips Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Delicate upper lip hair removal with Rica wax.', price: 50, duration: 10, status: 'ACTIVE' },
  { id: 'wx15', name: 'Chin Wax (Honey)', category: 'Waxing', gender: 'WOMEN', description: 'Chin hair removal with Honey wax.', price: 20, duration: 10, status: 'ACTIVE' },
  { id: 'wx16', name: 'Chin Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Precise chin hair removal with Rica wax.', price: 50, duration: 10, status: 'ACTIVE' },
  { id: 'wx17', name: 'Full Body Wax (Rica)', category: 'Waxing', gender: 'WOMEN', description: 'Complete full body waxing treatment using premium imported Rica wax.', price: 1500, duration: 90, status: 'ACTIVE' }
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

