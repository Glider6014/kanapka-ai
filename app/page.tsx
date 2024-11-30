'use client';

import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { MainNavbar } from '@/components/MainNavbar';
import Greeting from '@/components/Greeting';
import About_app from '@/components/About_app';
import Features from '@/components/Features';
import PromoBanner from '@/components/PromoBanner';

export default function Home() {
  return (
    <>
      <div className='container mx-auto py-4'>
        <MainNavbar />
      </div>
      <div className='w-full'>
        <Greeting />
        <About_app />
      </div>
      <div className='container mx-auto p-4'>
        <div className='flex flex-col items-center md:flex-row gap-4'>
          <div className='w-full flex-grow mt-4 md:mt-0'>
            <Features />
          </div>
        </div>
      </div>
      <div className='w-full'>
        <PromoBanner />
        {/* 
        <People people={people0} isReverse={false} />
        <People people={people1} isReverse={true} />
         */}
        <FAQ />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}
