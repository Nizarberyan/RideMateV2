"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BrandLogo, Button } from "@repo/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Navbar matching the design */}
      <nav className="w-full z-50 md:px-16 px-6 py-6 flex justify-between items-center transition-all">
        <Link href="/">
          <BrandLogo />
        </Link>

        <div className="hidden md:flex gap-8 text-black-brand font-medium text-sm">
          <Link
            href="#home"
            className="hover:text-lime-brand transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-black-brand"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="hover:text-lime-brand transition-colors"
          >
            About Project
          </Link>
          <Link
            href="#stack"
            className="hover:text-lime-brand transition-colors"
          >
            Tech Stack
          </Link>
          <Link
            href="#roadmap"
            className="hover:text-lime-brand transition-colors"
          >
            Roadmap
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-brand/30 text-sm font-medium hover:bg-black/5 transition-colors">
            🇬🇧 EN <span className="text-xs">▼</span>
          </button>
          <Link href="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section matching Figma */}
      <main className="w-full relative">
        <div className="md:px-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center pt-10 pb-20 z-10 relative">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-left z-10 w-full lg:pr-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-[5.5rem] font-bold text-black-brand leading-[1.05] tracking-tight mb-8">
              An Experimental <br />
              <span className="text-highlight">Mobility Platform.</span>
            </h1>

            <p className="text-base text-gray-brand mb-10 max-w-md leading-relaxed font-medium">
              RideMate is a conceptual full-stack web application designed to
              demonstrate a modern, scalable architecture for a carpooling
              service.
            </p>

            <Button size="lg" className="px-8 mb-16">
              View Source Code
            </Button>

            <div className="flex gap-12 text-black-brand">
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">
                  Commits
                </div>
                <div className="text-2xl font-bold">50+</div>
              </div>
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">
                  Frameworks
                </div>
                <div className="text-2xl font-bold">Next/Nest</div>
              </div>
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">
                  Database
                </div>
                <div className="text-2xl font-bold">Postgres</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image Content - The car and driver image from mockup */}
          <motion.div
            className="flex-1 w-full relative h-[500px] lg:h-[600px] mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            {/* Add placeholder structure since we don't have the exact image */}
            <div className="w-full h-full relative rounded-tl-[80px] rounded-br-[80px] overflow-hidden bg-slate-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070"
                alt="Driver in car"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* The decorative light green geometric shapes behind/around the image */}
            <div className="absolute top-[-5%] right-[10%] w-[40%] h-[30%] bg-[#DCF87A] -z-10 rounded-br-[60px]" />
            <div className="absolute bottom-[-5%] left-[-10%] w-[35%] h-[40%] bg-[#DCF87A] -z-10 rounded-tl-[60px]" />
            <div className="absolute bottom-[20%] right-[-5%] w-[15%] h-[20%] bg-[#DCF87A] -z-10" />
          </motion.div>
        </div>
      </main>

      {/* Stats Section matching the "Challenging in-justice" part */}
      <section className="bg-white py-24 w-full">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Showcasing modern web{" "}
            <span className="text-highlight">
              development through a scalable
            </span>
            <br />
            monorepo architecture
            <div className="inline-flex items-center ml-4 -translate-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden shadow-sm">
                <Image
                  src="https://i.pravatar.cc/100?img=1"
                  alt="Face 1"
                  width={32}
                  height={32}
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden z-10 shadow-sm">
                <Image
                  src="https://i.pravatar.cc/100?img=2"
                  alt="Face 2"
                  width={32}
                  height={32}
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden z-20 shadow-sm">
                <Image
                  src="https://i.pravatar.cc/100?img=3"
                  alt="Face 3"
                  width={32}
                  height={32}
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden z-30 shadow-sm">
                <Image
                  src="https://i.pravatar.cc/100?img=4"
                  alt="Face 4"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </h2>

          <p className="text-gray-brand text-sm max-w-2xl mx-auto leading-relaxed mb-16">
            This project explores the integration of a Next.js frontend with a
            robust NestJS backend, utilizing Prisma ORM and strong TypeScript
            typing to build a solid foundation for a conceptual application.
          </p>

          <div className="w-full max-w-3xl mx-auto relative h-[300px]">
            {/* Illustration placeholder for the green city / car graphic */}
            <div className="absolute bottom-0 w-full h-full bg-[url('https://cdn.builder.io/api/v1/image/assets/TEMP/c822df3b-4177-48a3-a8ee-ea17a15a0c10')] bg-contain bg-center bg-no-repeat" />
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="w-full py-24 md:px-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="text-xs font-bold tracking-wider text-black-brand uppercase mb-2">
                Offers
              </div>
              <h2 className="text-4xl font-bold text-black-brand">
                <span className="text-highlight">Our Service</span>
              </h2>
            </div>
            <Link
              href="#services"
              className="text-sm font-medium text-black-brand flex items-center gap-1 hover:text-lime-brand transition-colors"
            >
              See More <span className="text-xs">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100">
              <div className="h-48 relative mb-6 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                {/* Placeholder for the illustration */}
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2c9c2794-6d9b-4ff4-a744-8d96b9967b57"
                  alt="City Rides"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">City Rides</h3>
              <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                Offer your own price and a personal service door to door.
              </p>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-lime-brand/20 text-black-brand text-xs font-bold rounded-full">
                  Passengers
                </span>
                <span className="px-4 py-1.5 bg-gray-100 text-black-brand text-xs font-bold rounded-full">
                  Drivers
                </span>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100">
              <div className="h-48 relative mb-6 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f48c0379-3ef1-4bcf-a4d3-7d544bed3df6"
                  alt="City to City"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">City to City</h3>
              <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                Comfortable rides by both drivers to clear and destinations
                under a fast.
              </p>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-lime-brand/20 text-black-brand text-xs font-bold rounded-full">
                  Passengers
                </span>
                <span className="px-4 py-1.5 bg-gray-100 text-black-brand text-xs font-bold rounded-full">
                  Drivers
                </span>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100">
              <div className="h-48 relative mb-6 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c5f8846-ab04-45e3-9821-fa122cdca454"
                  alt="EV Charging"
                  width={400}
                  height={300}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">EV Charging</h3>
              <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                Keep your electric vehicle ready for the road with our reliable
                and accessible EV charging services.
              </p>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-lime-brand/20 text-black-brand text-xs font-bold rounded-full">
                  Charging
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="bg-white w-full py-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto rounded-[40px] border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden bg-white shadow-sm">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-[40%] h-full pointer-events-none opacity-20">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGlwc2UgY3g9IjUwJSIgY3k9IjUwJSIgcng9IjUwJSIgcnk9IjUwJSIgZmlsbD0iI0MxRjExRCIvPjwvc3ZnPg==')] bg-center bg-no-repeat bg-contain" />
          </div>

          <div className="flex-1 z-10">
            <div className="text-xs font-bold tracking-wider text-black-brand uppercase mb-4 text-center md:text-left">
              SAFETY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center md:text-left mb-6">
              Your safety{" "}
              <span className="text-highlight">is our priority</span>
            </h2>
            <p className="text-gray-brand text-center md:text-left mb-12 max-w-md">
              Stay on the safe side with RideMate.
            </p>

            <div className="bg-background rounded-3xl p-8 max-w-lg">
              <h3 className="text-2xl font-bold mb-4">
                We want all of us to be on the
                <br />
                same page about safety
              </h3>
              <p className="text-gray-brand text-sm mb-8 leading-relaxed">
                Before driving or traveling anywhere with RideMate, please read
                our safety guide carefully. Your security is incredibly
                important to us.
              </p>
              <Button>Learn more</Button>
            </div>
          </div>

          <div className="flex-1 relative flex justify-center items-center z-10 w-full h-[300px] md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000"
              alt="Safety smiling driver"
              width={300}
              height={300}
              className="w-[300px] h-[300px] object-cover rounded-full border-4 border-white shadow-xl relative z-20"
            />
            {/* Decorative element from mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-lime-brand -z-10 [clip-path:polygon(50%_0%,_83%_12%,_100%_43%,_94%_78%,_68%_100%,_32%_100%,_6%_78%,_0%_43%,_17%_12%)]" />
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="bg-white w-full py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="text-xs font-bold tracking-wider text-black-brand uppercase mb-2">
                FEATURES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black-brand tracking-tight">
                <span className="text-highlight">Technical highlights</span> of
                the platform.
              </h2>
              <p className="text-gray-brand text-sm mt-4">
                Discover the core technologies and patterns used to build this
                experimental app.
              </p>
            </div>
            <Button className="hidden md:block">
              View Documentation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=800"
                alt="Program for youth"
                width={800}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">Modern Tech Stack.</h3>
                <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                  Built with Next.js 15+ App Router, NestJS 11+, and TailwindCSS
                  for a seamless developer experience.
                </p>
                <span className="text-xs font-bold uppercase tracking-wider">
                  LEARN MORE
                </span>
              </div>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"
                alt="Free undergraduate education"
                width={800}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">Robust Data Layer.</h3>
                <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                  Utilizing Prisma ORM with PostgreSQL to manage relational data
                  for users, rides, and bookings.
                </p>
                <span className="text-xs font-bold uppercase tracking-wider">
                  LEARN MORE
                </span>
              </div>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                alt="Prize for women founders"
                width={800}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">Secure & Scalable.</h3>
                <p className="text-gray-brand text-sm mb-6 line-clamp-2">
                  Implementing JWT authentication, strict validation pipes, and
                  a modular monorepo structure.
                </p>
                <span className="text-xs font-bold uppercase tracking-wider">
                  LEARN MORE
                </span>
              </div>
            </div>
          </div>
          <Button className="md:hidden mt-8 w-full">
            View Documentation
          </Button>
        </div>
      </section>

      {/* Right now at RideMate */}
      <section className="bg-background w-full py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-xs font-bold tracking-wider text-black-brand uppercase mb-2">
            ROADMAP
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black-brand tracking-tight mb-16">
            Project updates <span className="text-highlight">for RideMate</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Main Feature */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer md:row-span-3 h-full">
              <div className="h-64 md:h-80 relative bg-[#FFFEE9] flex items-center justify-center p-8">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f48c0379-3ef1-4bcf-a4d3-7d544bed3df6"
                  alt="Car Illustration"
                  width={600}
                  height={400}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold tracking-wider text-black-brand uppercase">
                    UPDATE
                  </span>
                  <span className="text-xs text-gray-brand">Phase 2</span>
                </div>
                <h3 className="text-xl font-bold line-clamp-2">
                  Core Development: Designing robust business logic and
                  interfaces
                </h3>
              </div>
            </div>

            {/* Smaller news items */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6 group cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2c9c2794-6d9b-4ff4-a744-8d96b9967b57"
                  alt="News icon"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold tracking-wider text-black-brand uppercase">
                    UPDATE
                  </span>
                  <span className="text-xs text-gray-brand">Phase 1</span>
                </div>
                <h3 className="text-sm font-bold line-clamp-2">
                  Architecture Designed: NestJS + Next.js monorepo layout
                  confirmed
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6 group cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=200"
                  alt="News icon"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold tracking-wider text-black-brand uppercase">
                    UPDATE
                  </span>
                  <span className="text-xs text-gray-brand">Phase 1</span>
                </div>
                <h3 className="text-sm font-bold line-clamp-2">
                  Database Schema Modeling: Prisma setup complete for Users,
                  Rides and Bookings
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6 group cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-lime-brand flex-shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pravatar.cc/150?img=11"
                  alt="News icon"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform mix-blend-multiply"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold tracking-wider text-black-brand uppercase">
                    PLANNED
                  </span>
                  <span className="text-xs text-gray-brand">Phase 3</span>
                </div>
                <h3 className="text-sm font-bold line-clamp-2">
                  Quality Assurance: Setting up Jest and Cypress testing
                  environments
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Underdog section */}
      <section className="bg-white w-full px-6 md:px-16 pt-12 pb-24">
        <div className="max-w-6xl mx-auto rounded-[40px] bg-lime-brand flex flex-col md:flex-row items-center overflow-hidden relative border border-transparent">
          <div className="p-12 md:p-16 flex-1 z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-black-brand mb-6 leading-tight">
              From Concept to Code: Building a Full-Stack App.
            </h2>
            <p className="text-black-brand font-medium text-sm mb-10 max-w-sm">
              The technical journey of developing an experimental mobility
              platform from scratch.
            </p>
            <Button variant="black">
              View GitHub Repo
            </Button>
          </div>
          <div className="flex-1 w-full h-[300px] md:h-auto relative bg-lime-brand flex items-end justify-center md:justify-end -mr-16 -mb-8">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c822df3b-4177-48a3-a8ee-ea17a15a0c10"
              alt="Green Journey Book"
              width={400}
              height={400}
              className="w-[80%] max-w-[400px] object-cover -rotate-12 translate-y-12 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full bg-[#151515] text-white py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-16 flex justify-between items-center flex-col md:flex-row">
          <Link href="/">
            <BrandLogo size="md" className="text-white" />
          </Link>

          <div className="text-sm text-gray-400 font-medium">
            © 2024 RideMate. Concept Demo Project.
          </div>
        </div>
      </footer>
    </div>
  );
}
