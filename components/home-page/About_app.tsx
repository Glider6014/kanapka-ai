import { useState } from 'react';

const AboutApp = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [animate, setAnimate] = useState(false);

  const images = [
    {
      title: 'Recipe Board',
      description:
        'Kanapka AI recipe boards keep your meals organized and your culinary adventures moving forward. At a glance, see everything from “ingredients on hand” to “aww yeah, delicious success!”',
      image: 'about_app.jpg',
    },
    {
      title: 'List',
      description:
        'The different stages of a recipe. Start as simple as Ingredients, Preparation, or Completed—or build a workflow custom fit to your culinary needs. There’s no wrong way to Kanapka AI.',
      image: 'about_app1.webp',
    },
    {
      title: 'Cards',
      description:
        'Cards represent recipes and ideas and hold all the information to create delicious dishes. As you make progress, move cards across lists to show their status.',
      image: 'about_app2.webp',
    },
  ];

  const handleDivClick = (index: number) => {
    if (index !== currentImage) {
      setCurrentImage(index);
      setAnimate(true);

      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
  };

  return (
    <section className='bg-blue-100 bg-gradient-to-t from-blue-100 to-white py-16 md:pt-2 md:pb-26 px-8'>
      <div className='max-w-6xl mx-auto flex flex-col gap-8'>
        <div className='w-full flex flex-col items-start gap-4'>
          <h1 className='text-3xl font-bold mb-6'>Your Culinary Companion</h1>
          <p className='text-lgS mb-6'>
            Simple, flexible, and powerful. All it takes are your fridge's
            contents for Kanapka AI to whip up recipes that bring your culinary
            dreams to life. Our app provides a clear view of what you can cook,
            who you are, and what you can achieve in your kitchen. Learn more in
            our guide for getting started.
          </p>
        </div>

        <div className='flex flex-col-reverse md:flex-row gap-8 w-full'>
          <div className='w-full md:w-3/5 flex flex-col gap-2'>
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex flex-col items-start p-4 rounded-lg w-full cursor-pointer ${
                  currentImage === index
                    ? 'bg-gradient-to-r from-start-prim to-end-prim text-white'
                    : 'bg-opacity-0 text-black border-black'
                } border-2 h-42`}
                onClick={() => handleDivClick(index)}
              >
                <h3 className='font-semibold'>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            ))}
          </div>

          <div className='w-full md:w-2/5 overflow-hidden relative flex justify-center items-center'>
            <div
              className={`relative flex ${
                animate ? 'animate-slide-right' : ''
              }`}
            >
              <img
                src={images[currentImage].image}
                alt={images[currentImage].title}
                className='w-96 h-auto rounded-lg'
              />
              {animate && (
                <img
                  src={images[currentImage].image}
                  alt={images[currentImage].title}
                  className='w-full h-auto rounded-lg absolute left-full top-0'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutApp;
