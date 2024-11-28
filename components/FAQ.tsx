import { useState } from "react";

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Kanapka AI?",
      answer:
        "Kanapka AI is an innovative recipe generation and meal planning application powered by AI to help you create customized recipes and plan your meals efficiently.",
    },
    {
      question: "How does the recipe generator work?",
      answer:
        "The recipe generator uses advanced algorithms and a comprehensive ingredient database to create personalized recipes based on your dietary preferences and restrictions.",
    },
    {
      question: "Can I save my favorite recipes?",
      answer:
        "Yes, with Kanapka AI, you can save an unlimited number of recipes and access them anytime from your profile.",
    },
    {
      question: "What types of meal plans are available?",
      answer:
        "We offer various meal plans including vegetarian, vegan, gluten-free, keto, and more, tailored to meet different dietary needs and preferences.",
    },
    {
      question: "Is Kanapka AI free to use?",
      answer:
        "Kanapka AI offers both free and premium plans. The free plan includes basic features, while premium plans provide access to advanced functionalities and personalized support.",
    },
  ];

  return (
    <div className="w-full bg-[#f8ffe5] px-4 py-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex items-start gap-12">
          <div className="w-1/3">
            <h2 className="text-2xl font-bold text-left">Kanapka AI - FAQs</h2>
          </div>

          <div className="w-2/3">
            {faqData.map((item, index) => (
              <div key={index} className="border-b last:border-none py-4">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full text-left text-lg font-medium"
                >
                  {item.question}
                  <span
                    className={`transform transition-transform ${
                      openItem === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    openItem === index
                      ? "max-h-[500px] opacity-100 animate-fade-down animate-once"
                      : "max-h-0 opacity-0 animate-fade-up animate-once animate-duration-[1500ms]"
                  }`}
                >
                  {openItem === index && (
                    <p className="mt-2 text-gray-700">{item.answer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;