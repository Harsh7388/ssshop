import Image from "next/image";
import { CheckCircle2, Award, Users, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-serif mb-4">About SS SALON</h1>
          <p className="text-gray-300 text-lg">Beauty designed around you</p>
        </div>
      </section>

      <div className="container py-20">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-3 block">Our Story</span>
            <h2 className="text-3xl font-serif text-secondary mb-6">Where Luxury Meets Expertise</h2>
            <p className="text-muted mb-4">
              SS SALON was founded with a single vision — to create a space where every person feels valued, 
              beautiful, and confident. We believe that great grooming isn't a luxury; it's a necessity.
            </p>
            <p className="text-muted mb-6">
              From precision haircuts to luxurious spa treatments, our expert team of stylists and therapists 
              bring years of experience and a passion for their craft to every appointment.
            </p>
            <ul className="flex flex-col gap-3">
              {['Professional, certified stylists', 'Premium international products', 'Hygienic & sanitized environment', 'Personalised service for every client'].map(item => (
                <li key={item} className="flex items-center gap-3 text-muted">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image src="/hero.png" alt="SS SALON Interior" fill className="object-cover" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 py-12 bg-secondary rounded-lg text-white text-center">
          <div>
            <div className="text-5xl font-bold text-primary mb-2">5000+</div>
            <div className="text-gray-300">Happy Customers</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary mb-2">10+</div>
            <div className="text-gray-300">Years of Excellence</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary mb-2">30+</div>
            <div className="text-gray-300">Expert Professionals</div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-secondary mb-4">Our Core Values</h2>
          <p className="text-muted">The principles that guide everything we do at SS SALON</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Award size={32}/>, title: 'Excellence', text: 'We never compromise on quality. Every service is delivered with the highest standards of craft.' },
            { icon: <Heart size={32}/>, title: 'Care', text: 'Our clients are at the heart of everything we do. Your comfort and satisfaction are our priority.' },
            { icon: <Users size={32}/>, title: 'Inclusivity', text: 'SS SALON is a welcoming space for everyone — all genders, ages, and backgrounds.' }
          ].map(v => (
            <div key={v.title} className="card text-center p-8">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                {v.icon}
              </div>
              <h3 className="text-xl mb-3">{v.title}</h3>
              <p className="text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
