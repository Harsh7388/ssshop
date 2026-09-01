import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function ServicesPage() {
  const menServices = await prisma.service.findMany({ where: { gender: 'MEN', status: 'ACTIVE' } });
  const womenServices = await prisma.service.findMany({ where: { gender: 'WOMEN', status: 'ACTIVE' } });

  return (
    <div className="container py-20 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Our Premium Services</h1>
        <p className="text-muted text-lg">
          Explore our extensive range of professional grooming and beauty treatments tailored for you.
        </p>
      </div>

      <div className="mb-20">
        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
          <h2 className="text-3xl font-serif text-secondary">Men's Grooming</h2>
          <Link href="/services/men" className="text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menServices.map((service) => (
            <div key={service.id} className="card p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded">
                    {service.duration} mins
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{service.category}</p>
                <p className="text-muted mb-6">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-auto border-t border-border pt-4">
                <div className="text-2xl font-bold text-primary">₹{service.price}</div>
                <Link href={`/book?service=${service.id}`} className="btn-primary text-sm px-4 py-2">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
          <h2 className="text-3xl font-serif text-secondary">Women's Beauty</h2>
          <Link href="/services/women" className="text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {womenServices.map((service) => (
            <div key={service.id} className="card p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded">
                    {service.duration} mins
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{service.category}</p>
                <p className="text-muted mb-6">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-auto border-t border-border pt-4">
                <div className="text-2xl font-bold text-primary">₹{service.price}</div>
                <Link href={`/book?service=${service.id}`} className="btn-primary text-sm px-4 py-2">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
