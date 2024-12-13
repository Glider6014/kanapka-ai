"use client";

import { useRouter } from "next/navigation";

export default function SubscriptionTable() {
  const router = useRouter();

  const plans = [
    {
      title: "Basic",
      price: "Free",
      button: "Select Plan",
    },
    {
      title: "Plus",
      price: "$5/month",
      button: "Select Plan",
    },
    {
      title: "Gold",
      price: "$10/month",
      button: "Select Plan",
    },
    {
      title: "Premium",
      price: "$15/month",
      button: "Select Plan",
    },
  ];

  const features = [
    { name: "Unlimited Recipe Generations", plans: [true, true, true, true] },
    { name: "Save Recipes", plans: [true, true, true, true] },
    { name: "Extended Ingredient Database", plans: [false, true, true, true] },
    { name: "Nutritional Information", plans: [false, true, true, true] },
    {
      name: "Advanced Recipe Customization",
      plans: [false, false, true, true],
    },
    { name: "Personalized Diet Plans", plans: [false, false, false, true] },
    { name: "Priority Customer Support", plans: [false, true, true, true] },
    { name: "Exclusive Workshops", plans: [false, false, false, true] },
  ];

  const handleSubscription = (plan: string) => {
    if (plan !== "Plus") return;

    fetch("/api/upgrade")
      .then((res) => res.json())
      .then((data) => {
        router.push(data.checkoutUrl);
      });
  };

  return (
    <div className="max-w mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-left mb-8">Compare Our Plans</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/3"></th>
              {plans.map((plan, index) => (
                <th
                  key={index}
                  className={`text-center p-4 border-b border-gray-300`}
                >
                  <h3 className="text-lg font-medium">{plan.title}</h3>
                  <p className="text-2xl font-bold mt-2">{plan.price}</p>
                  <button
                    className="mt-4 py-2 px-4 border border-black rounded-md hover:bg-black hover:text-white hover:rounded-none hover:border"
                    onClick={() => handleSubscription(plan.title)}
                  >
                    {plan.button}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-t hover:bg-slate-50">
                <td className="p-4 border-r border-gray-300 text-left">
                  {feature.name}
                </td>
                {feature.plans.map((isAvailable, idx) => (
                  <td key={idx} className="p-4 text-center">
                    {isAvailable ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-red-500">✖</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
