import Link from 'next/link';

export default function Greeting() {
  return (
    <div className='relative bg-gradient-to-r from-start-prim to-end-prim text-white py-12 md:pt-12 md:pb-48 px-8'>
      <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center'>
        <div>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Creating recipes for everyone!
          </h1>
          <p className='text-lg md:text-3xl mb-8'>For big or small.</p>
          <form className='flex flex-col md:flex-row gap-4'>
            <Link
              href='/user/signup'
              className='bg-black font-bold text-center text-white px-6 py-2 rounded-md transition'
            >
              Sign up - it's free!
            </Link>
          </form>
        </div>

        <div className='relative flex justify-center items-center'>
          <div className='flex justify-center items-center'>
            <img className='w-100 h-100' src='greeting.png' alt='sandwich' />
          </div>
        </div>
      </div>
      <div className='hidden md:block wave-bottom absolute inset-x-0 bottom-0'></div>
    </div>
  );
}
