import React from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiBadgeCheck, HiUserGroup, HiOutlineSparkles } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const About = () => {
  return (
    <div className='px-4 md:px-10 pb-20 bg-white'>
      {/* --- Header Section --- */}
      <div className='text-center py-16'>
        <h2 className='font-black uppercase tracking-tighter text-gray-900 text-4xl md:text-6xl'>
          About <span className='text-blue-600'>Virat Collections</span>
        </h2>
        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-4 italic'>
          Premium Fashion • Curated by Gopi
        </p>
      </div>

      {/* --- Founder Story Grid --- */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24'>
        <div className='flex justify-center'>
          <div className='relative group'>
            {/* Minimal Frame */}
            <div className='absolute -inset-4 border-2 border-dashed border-blue-100 rounded-[3rem] group-hover:border-blue-200 transition-all'></div>
            <img 
              className='w-full max-w-[350px] rounded-[2.5rem] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700' 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071" 
              alt="Founder Gopi" 
            />
            <div className='absolute -bottom-6 -right-6 bg-blue-600 text-white p-5 rounded-3xl shadow-xl z-20'>
               <HiBadgeCheck className='text-3xl' />
            </div>
          </div>
        </div>
        
        <div className='space-y-8'>
          <div>
            <h3 className='text-3xl font-black uppercase tracking-tighter text-gray-900'>
              Driven by <span className='text-blue-600 italic'>Passion & Quality.</span>
            </h3>
            <div className='h-1 w-20 bg-blue-600 mt-2'></div>
          </div>
          
          <p className='text-gray-600 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-6 text-lg'>
            "At Virat Collections, our mission is to redefine fashion for the modern hustler. We bring premium styles directly to your doorstep with uncompromised quality."
            <span className='block text-blue-600 font-black uppercase text-[10px] tracking-widest mt-4 not-italic'>— Gopi, Founder</span>
          </p>
          
          <div className='grid grid-cols-2 gap-8'>
             <div className='bg-gray-50 p-6 rounded-3xl'>
                <HiUserGroup className='text-blue-600 text-2xl mb-2' />
                <p className='font-black text-xl'>10K+</p>
                <p className='text-[10px] uppercase font-bold text-gray-400 tracking-widest'>Happy Clients</p>
             </div>
             <div className='bg-gray-50 p-6 rounded-3xl'>
                <HiOutlineSparkles className='text-blue-600 text-2xl mb-2' />
                <p className='font-black text-xl'>Weekly</p>
                <p className='text-[10px] uppercase font-bold text-gray-400 tracking-widest'>New Trends</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- Social Promo Section (Light Theme) --- */}
      <div className='bg-blue-50/50 border-2 border-blue-100 p-10 md:p-16 rounded-[3rem] mb-24 text-center relative overflow-hidden'>
        <div className='relative z-10'>
          <h4 className='text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4'>
            Exclusive <span className='text-blue-600'>Social Discount!</span>
          </h4>
          <p className='text-gray-500 font-bold text-xs mb-10 uppercase tracking-[0.2em] max-w-xl mx-auto'>
            Follow our journey and stay updated with the latest trends to unlock special offers.
          </p>
          
          <div className='flex justify-center gap-10 md:gap-20'>
            {[
              { Icon: FaInstagram, color: 'text-pink-500', label: 'Instagram' },
              { Icon: FaFacebook, color: 'text-blue-600', label: 'Facebook' },
              { Icon: FaYoutube, color: 'text-red-600', label: 'YouTube' }
            ].map((social, i) => (
              <a key={i} href="#" className='group flex flex-col items-center gap-3'>
                <div className='w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-gray-100'>
                  <social.Icon className={`${social.color} text-3xl`} />
                </div>
                <span className='text-[10px] font-black uppercase tracking-widest text-gray-900'>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
        {/* Subtle Background Art */}
        <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl'></div>
      </div>

      {/* --- Contact & Location Grid --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Contact Details */}
        <div className='p-10 rounded-[2.5rem] border-2 border-gray-50 bg-white hover:border-blue-100 transition-all'>
          <h3 className='text-sm font-black uppercase tracking-[0.3em] mb-10 text-gray-400'>Get in Touch</h3>
          <div className='space-y-8'>
            <div className='flex items-center gap-5'>
              <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner'><HiPhone /></div>
              <p className='font-black text-gray-900'>+91 9441663905</p>
            </div>
            <div className='flex items-center gap-5'>
              <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner'><HiMail /></div>
              <p className='font-black text-gray-900'>contact@viratcollections.com</p>
            </div>
          </div>
        </div>

        {/* Store Locations */}
        <div className='p-10 rounded-[2.5rem] border-2 border-gray-50 bg-white hover:border-blue-100 transition-all'>
          <h3 className='text-sm font-black uppercase tracking-[0.3em] mb-10 text-gray-400'>Store Locations</h3>
          <div className='space-y-8'>
            <div className='flex items-start gap-5'>
              <div className='w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center shadow-inner'><HiLocationMarker /></div>
              <div>
                <h5 className='font-black uppercase text-xs tracking-widest'>KGF Branch</h5>
                <p className='text-gray-500 text-xs font-medium mt-1'>Geetha Road, 1st Cross, KGF.</p>
              </div>
            </div>
            <div className='flex items-start gap-5'>
              <div className='w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center shadow-inner'><HiLocationMarker /></div>
              <div>
                <h5 className='font-black uppercase text-xs tracking-widest'>Kolar Branch</h5>
                <p className='text-gray-500 text-xs font-medium mt-1'>Benz Circle, Gandhi Road, Kolar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;