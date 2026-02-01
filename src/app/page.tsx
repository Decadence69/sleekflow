import { Suspense } from 'react';
import ContactList from '@/components/ContactList';

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ContactList />
    </Suspense>
  );
}