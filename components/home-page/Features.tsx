import { features } from '@/data/features';
import { MoveRight } from 'lucide-react';

const Features = () => {
  return (
    <div className='max-w-6xl mx-auto px-6 py-12'>
      <h1 className='text-4xl font-bold text-center mb-8'>
        Everything you need to do your best work.
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='flex flex-col items-start text-left p-6 bg-blue-50 rounded-lg'
          >
            <div className='mb-4'>
              <feature.icon className='w-12 h-12' />
            </div>
            <h2 className='text-lg font-semibold mb-2 flex items-center gap-2'>
              {feature.title} <MoveRight className='w-5 h-5' />
            </h2>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
