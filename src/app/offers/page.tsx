import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function OffersPage() {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      status: 'ACTIVE',
      end_date: { gte: now }
    },
    orderBy: { start_date: 'desc' }
  });

  return (
    <div className="container py-20 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Exclusive Offers</h1>
        <p className="text-muted text-lg">
          Discover our latest promotions and premium packages. Treat yourself to luxury for less.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-secondary rounded-lg p-8 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary rounded-full filter blur-[80px] opacity-20"></div>
            <div className="relative z-10 mb-8">
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Special Offer</span>
              <h2 className="text-3xl text-white mb-4 font-serif">{offer.title}</h2>
              <p className="text-gray-300">{offer.description}</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-6">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <div className="text-sm text-gray-400">Valid until {new Date(offer.end_date).toLocaleDateString()}</div>
                <div className="text-primary font-bold">{offer.gender === 'BOTH' ? 'For Men & Women' : `For ${offer.gender}`}</div>
              </div>
              <Link href="/book" className="btn-primary w-full sm:w-auto text-center">
                Claim Offer
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
