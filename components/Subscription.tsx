"use client";

export default function Subscription() {
const plans = [
  {
    title: "Kanapka Basic",
    price: "Free",
    description: "",
    features: [
      "Access to basic recipe generator",
      "Save up to 10 recipes",
      "Limited ingredient database",
      "Community support",
    ],
    button: "Select plan",
    isPopular: false,
  },
  {
    title: "Kanapka Plus",
    price: "$5/month",
    description:
      "",
    features: [
      "Unlimited recipe generations",
      "Save unlimited recipes",
      "Extended ingredient database",
      "Nutritional information",
      "Meal planning",
      "Priority support",
    ],
    button: "Select plan",
    isPopular: true,
  },
  {
    title: "Kanapka Gold",
    price: "$10/month",
    description:
      "",
    features: [
      "Advanced recipe customization",
      "Exclusive seasonal ingredients",
      "Access to professional chef recipes",
      "Dietary preferences and restrictions",
      "Recipe sharing with friends",
      "Detailed meal prep guides",
      "Nutritional analytics",
      "Recipe collaboration",
    ],
    button: "Select plan",
    isPopular: true,
  },
  {
    title: "Kanapka Premium",
    price: "$15/month",
    description:
      "",
    features: [
      "Personalized diet plans",
      "One-on-one sessions with nutritionists",
      "Early access to new features",
      "Exclusive cooking workshops",
      "Advanced recipe sharing and collaboration tools",
      "Integrations with smart kitchen devices",
      "Priority customer support",
    ],
    button: "Contact sales",
    isPopular: true,
  },
];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-20 mt-20 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        Choose the right plan for your fridge
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`w-full md:w-1/4 p-6 border rounded-lg shadow-md border-black`}
          >
            <h3 className="text-xl font-semibold">{plan.title}</h3>
            <p className="text-3xl font-bold my-4">{plan.price}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {plan.description}
            </p>

            <button
              className={`mt-4 w-full py-2 px-4 rounded-lg hover:rounded-none ${
                plan.isPopular
                  ? "bg-black text-white hover:bg-gradient-to-r from-purple-700 to-orange-500"
                  : "bg-gray-100 hover:bg-gradient-to-r from-purple-700 to-orange-500 hover:text-white"
              }`}
            >
              {plan.button}
            </button>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-green-500 font-bold mr-2">✔</span>
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
