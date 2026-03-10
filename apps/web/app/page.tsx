"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      
      {/* Navbar matching the design */}
      <nav className="w-full z-50 md:px-16 px-6 py-6 flex justify-between items-center transition-all">
        <div className="text-2xl font-bold flex items-center gap-2 text-black-brand">
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-xl font-extrabold flex items-center justify-center">iD</div>
          <span className="tracking-tight">inDrive</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-black-brand font-medium text-sm">
          <Link href="#home" className="hover:text-lime-brand transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-black-brand">Home</Link>
          <Link href="#company" className="hover:text-lime-brand transition-colors">Company</Link>
          <Link href="#blog" className="hover:text-lime-brand transition-colors">Blog</Link>
          <Link href="#news" className="hover:text-lime-brand transition-colors">News</Link>
          <Link href="#more" className="hover:text-lime-brand transition-colors flex items-center gap-1">More <span className="text-xs">▼</span></Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-brand/30 text-sm font-medium hover:bg-black/5 transition-colors">
             🇬🇧 EN <span className="text-xs">▼</span>
          </button>
          <Link href="/download" className="px-5 py-2.5 rounded-full bg-lime-brand text-black-brand font-bold text-sm shadow-sm hover:brightness-95 active:scale-95 transition-all">
            Download the app
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
              Together, We Make a <br/>
              <span className="text-highlight">Greener World.</span>
            </h1>
            
            <p className="text-base text-gray-brand mb-10 max-w-md leading-relaxed font-medium">
              Whether you're commuting to work, meeting friends, or exploring new places, our service offers a smart, safe, and eco-friendly way to get around.
            </p>

            <button className="px-8 py-3 bg-lime-brand text-black-brand rounded-xl font-bold text-sm shadow-sm hover:brightness-95 transition-all active:scale-95 mb-16">
              Download the app
            </button>
            
            <div className="flex gap-12 text-black-brand">
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">Cities</div>
                <div className="text-2xl font-bold">1000+</div>
              </div>
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">Countries</div>
                <div className="text-2xl font-bold">45+</div>
              </div>
              <div>
                <div className="text-xs text-gray-brand font-medium tracking-wider mb-1 uppercase">App Download</div>
                <div className="text-2xl font-bold">237M+</div>
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
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070" 
                alt="Driver in car" 
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
            Challenging injustice to <span className="text-highlight">make the world a fairer</span><br/>
            place for one billion people
            
            <div className="inline-flex items-center ml-4 -translate-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden shadow-sm">
                 <img src="https://i.pravatar.cc/100?img=1" alt="Face 1" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden z-10 shadow-sm">
                 <img src="https://i.pravatar.cc/100?img=2" alt="Face 2" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 -mr-3 border-2 border-white overflow-hidden z-20 shadow-sm">
                 <img src="https://i.pravatar.cc/100?img=3" alt="Face 3" />
              </div>
               <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden z-30 shadow-sm">
                 <img src="https://i.pravatar.cc/100?img=4" alt="Face 4" />
              </div>
            </div>
          </h2>
          
          <p className="text-gray-brand text-sm max-w-2xl mx-auto leading-relaxed mb-16">
            We challenge injustice and strive to create positive change in every community. 
            Through our unwavering commitment, we aim to build a more inclusive and 
            equitable world for all.
          </p>
          
          <div className="w-full max-w-3xl mx-auto relative h-[300px]">
             {/* Illustration placeholder for the green city / car graphic */}
             <div className="absolute bottom-0 w-full h-full bg-[url('https://cdn.builder.io/api/v1/image/assets/TEMP/c822df3b-4177-48a3-a8ee-ea17a15a0c10')] bg-contain bg-center bg-no-repeat" />
          </div>
        </div>
      </section>
      
    </div>
  );
}
