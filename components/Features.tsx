import {
  Refrigerator,
  UtensilsCrossed,
  Calendar,
  BrainCog,
  ShoppingCart,
  Heart,
  Lightbulb,
  FileText,
  MoveRight,
} from "lucide-react";
export default function Features() {
  const features = [
    {
      title: "Ingredient Tracker",
      description:
        "Easily manage and keep track of the ingredients in your fridge.",
      icon: Refrigerator,
    },
    {
      title: "Recipe Suggestions",
      description:
        "Get personalized recipe suggestions based on your available ingredients.",
      icon: UtensilsCrossed,
    },
    {
      title: "Meal Planner",
      description: "Organize your meals and create a plan for the week.",
      icon: Calendar,
    },
    {
      title: "Kanapka AI",
      description:
        "Your AI assistant that finds the perfect recipes and helps you cook.",
      icon: BrainCog,
    },
    {
      title: "Shopping List",
      description:
        "Generate shopping lists for your planned recipes and meals.",
      icon: ShoppingCart,
    },
    {
      title: "Nutrition Goals",
      description:
        "Track your nutritional intake and set healthy eating goals.",
      icon: Heart,
    },
    {
      title: "Cooking Tips",
      description:
        "Access a collection of tips and tricks to improve your cooking skills.",
      icon: Lightbulb,
    },
    {
      title: "Recipe Templates",
      description: "Start with one of our pre-designed recipe templates.",
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Everything you need to do your best work.
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start text-left p-6 bg-gray-50 shadow-lg rounded-lg border border-black"
          >
            <div className="mb-4">
              <feature.icon className="w-12 h-12" />
            </div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              {feature.title} <MoveRight className="w-5 h-5" />
            </h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
