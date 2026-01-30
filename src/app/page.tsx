import { Suspense } from 'react';
import ContactList from '@/components/ContactList';

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ContactList />
    </Suspense>
  );
}
// import ContactListItem from '@/components/ContactListItem';
// import { ApiResponse } from '@/types/character';

// async function getCharacters() {
//   const res = await fetch('https://rickandmortyapi.com/api/character', {
//     next: { revalidate: 3600 }
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch characters');
//   }

//   return res.json() as Promise<ApiResponse>;
// }

// export default async function Home() {
//   const data = await getCharacters();

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-screen">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-400 mb-2">Contact List</h2>
//         <p className="text-gray-200">
//           Total Characters: {data.info.count} | Showing: {data.results.length}
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="px-6 py-3 bg-gray-200 border-b border-gray-200">
//           <div className="grid grid-cols-4 gap-4">
//             <div className="text-sm font-semibold text-gray-600">Name</div>
//             <div className="text-sm font-semibold text-gray-600">Status</div>
//             <div className="text-sm font-semibold text-gray-600">Species</div>
//             <div className="text-sm font-semibold text-gray-600">Gender</div>
//           </div>
//         </div>
//         <ul className="divide-y divide-gray-200">
//           {data.results.map((character) => (
//             <ContactListItem key={character.id} character={character} />
//           ))}
//         </ul>
//       </div>
//     </div>
//   );

// }