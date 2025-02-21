import { auth } from '@/auth/next-auth';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function UserDashboard({ params }: Props) {
  const session = await auth();

  // Redirect if not logged in or if trying to access another user's dashboard
  if (!session || (session.user.id !== params.id && session.user.role !== 'admin')) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>User ID: {params.id}</p>
    </div>
  );
}