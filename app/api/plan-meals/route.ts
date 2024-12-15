import { NextRequest, NextResponse } from 'next/server';
import { planMeals } from '@/lib/mealsPlannerAgent/agent';
import { getServerSessionProcessed, processApiHandler } from '@/lib/apiUtils';
import { UserSubscription } from '@/lib/subscriptions';

const handlePOST = async (req: NextRequest) => {
  const { preferences, targetDate } = await req.json();
  const session = await getServerSessionProcessed();

  if (session.user.subscriptionType === UserSubscription.FREE) {
    return NextResponse.json(
      {
        error:
          'You are using the free plan. Please upgrade to a paid plan to access this feature.',
      },
      { status: 422 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!preferences?.trim()) {
    return NextResponse.json(
      { error: 'Preferences are required' },
      { status: 400 }
    );
  }

  if (!targetDate?.trim()) {
    return NextResponse.json(
      { error: 'Target date is required' },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const mealPlan = await planMeals(preferences, userId, targetDate);
  return NextResponse.json({ result: mealPlan });
};

export const POST = processApiHandler(handlePOST);
