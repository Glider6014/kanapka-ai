'use client';

import FAQ from '@/components/home-page/FAQ';
import Newsletter from '@/components/home-page/Newsletter';
import Footer from '@/components/Footer';
import MainNavbar from '@/components/home-page/MainNavbar';
import Greeting from '@/components/home-page/Greeting';
import About_app from '@/components/home-page/About_app';
import Features from '@/components/home-page/Features';
import PromoBanner from '@/components/home-page/PromoBanner';
// import People from '@/components/People';
// import { people0, people1 } from '@/components/PeopleArr';

export default function Home() {
  return (
    <>
      <div className='w-full md:px-4 py-4'>
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

        {/* <People people={people0} isReverse={false} />
        <People people={people1} isReverse={true} /> */}

        <FAQ />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}
