import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { checkUserOnboarding } from '@/lib/auth-helpers';

export default async function AddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/add');
  }

  const isOnboarded = await checkUserOnboarding(session.user.id);
  if (!isOnboarded) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}

