'use client';

import { subscriptionsPlansData } from '@/data/subscriptionPlansAndFeatures';
import { useRouter } from 'next/navigation';

export default function Subscription() {
  const router = useRouter();

  const handleSubscription = (plan: string) => {
    if (plan !== 'Kanapka Plus') return;

    fetch('/api/upgrade', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        router.push(data.checkoutUrl);
      });
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-10 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>
        Choose the right plan for your fridge
      </h1>

      <div className='flex flex-col md:flex-row gap-4'>
        {subscriptionsPlansData.map((plan, index) => (
          <div
            key={index}
            className={`w-full md:w-1/4 p-6 border rounded-lg shadow-md border-black`}
          >
            <h3 className='text-xl font-semibold'>{plan.title}</h3>
            <p className='text-3xl font-bold my-4'>{plan.price}</p>
            <p className='text-sm text-gray-600 whitespace-pre-line'>
              {plan.description}
            </p>

            <button
              className={`mt-4 w-full py-2 px-4 rounded-lg hover:rounded-none ${
                plan.isPopular
                  ? 'bg-black text-white hover:bg-gradient-to-r from-purple-700 to-orange-500'
                  : 'bg-gray-100 hover:bg-gradient-to-r from-purple-700 to-orange-500 hover:text-white'
              }`}
              onClick={() => handleSubscription(plan.title)}
            >
              {plan.button}
            </button>

            <ul className='mt-4 space-y-2'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex items-center'>
                  <span className='text-green-500 font-bold mr-2'>✔</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
