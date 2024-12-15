import React from 'react';

export default function PromoBanner() {
  return (
    <div className='bg-gradient-to-r from-purple-700 to-orange-500 text-white py-12 px-6'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center'>
        <div className='lg:w-1/2'>
          <h2 className='text-4xl font-bold mb-4'>
            Discover the magic of personalized recipes with Kanapka AI!
          </h2>
          <p className='text-lg mb-6'>
            Whether you&apos;re a busy professional, a home cook, or a culinary
            enthusiast, our goal is to help you create delicious meals
            effortlessly. Let Kanapka AI turn your fridge&apos;s contents into
            delightful dishes.
          </p>
          <a
            href='#'
            className='text-white font-semibold flex items-center gap-2 hover:underline'
          >
            Explore Recipes <span className='ml-1'>→</span>
          </a>
        </div>

        <div className='lg:w-1/2 flex justify-center mt-8 lg:mt-0'>
          <div className='relative w-72 h-72'>
            <img src='promo_blog.png' />
          </div>
        </div>
      </div>
    </div>
  );
}
