export const subscriptionPlans = [
  {
    title: 'Basic',
    price: 'Free',
    button: 'Select Plan',
  },
  {
    title: 'Plus',
    price: '$5/month',
    button: 'Select Plan',
  },
  {
    title: 'Gold',
    price: '$10/month',
    button: 'Select Plan',
  },
  {
    title: 'Premium',
    price: '$15/month',
    button: 'Select Plan',
  },
];

export const subscriptionsFeaturesTable = [
  { name: 'Unlimited Recipe Generations', plans: [true, true, true, true] },
  { name: 'Save Recipes', plans: [true, true, true, true] },
  { name: 'Extended Ingredient Database', plans: [false, true, true, true] },
  { name: 'Nutritional Information', plans: [false, true, true, true] },
  {
    name: 'Advanced Recipe Customization',
    plans: [false, false, true, true],
  },
  { name: 'Personalized Diet Plans', plans: [false, false, false, true] },
  { name: 'Priority Customer Support', plans: [false, true, true, true] },
  { name: 'Exclusive Workshops', plans: [false, false, false, true] },
];

export const subscriptionsPlansData = [
  {
    title: 'Kanapka Basic',
    price: 'Free',
    description: '',
    features: [
      'Access to basic recipe generator',
      'Save up to 10 recipes',
      'Limited ingredient database',
      'Community support',
    ],
    button: 'Select plan',
    isPopular: false,
  },
  {
    title: 'Kanapka Plus',
    price: '$5/month',
    description: '',
    features: [
      'Unlimited recipe generations',
      'Save unlimited recipes',
      'Extended ingredient database',
      'Nutritional information',
      'Meal planning',
      'Priority support',
    ],
    button: 'Select plan',
    isPopular: true,
  },
  {
    title: 'Kanapka Gold',
    price: '$10/month',
    description: '',
    features: [
      'Advanced recipe customization',
      'Exclusive seasonal ingredients',
      'Access to professional chef recipes',
      'Dietary preferences and restrictions',
      'Recipe sharing with friends',
      'Detailed meal prep guides',
      'Nutritional analytics',
      'Recipe collaboration',
    ],
    button: 'Select plan',
    isPopular: true,
  },
  {
    title: 'Kanapka Premium',
    price: '$15/month',
    description: '',
    features: [
      'Personalized diet plans',
      'One-on-one sessions with nutritionists',
      'Early access to new features',
      'Exclusive cooking workshops',
      'Advanced recipe sharing and collaboration tools',
      'Integrations with smart kitchen devices',
      'Priority customer support',
    ],
    button: 'Contact sales',
    isPopular: true,
  },
];
