'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContactListItem from '@/components/ContactListItem';
import { ApiResponse, Character } from '@/types/character';

export default function ContactList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get initial values from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [speciesFilter, setSpeciesFilter] = useState(searchParams.get('species') || '');
  const [genderFilter, setGenderFilter] = useState(searchParams.get('gender') || '');

  // Fetch all characters
  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch('https://rickandmortyapi.com/api/character');
        const data: ApiResponse = await res.json();
        setCharacters(data.results);
        setFilteredCharacters(data.results);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  // Update URL and filter characters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter) params.set('status', statusFilter);
    if (speciesFilter) params.set('species', speciesFilter);
    if (genderFilter) params.set('gender', genderFilter);

    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.replace(newUrl, { scroll: false });

    // Filter characters
    let filtered = characters;

    if (searchTerm) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((char) => char.status === statusFilter);
    }

    if (speciesFilter) {
      filtered = filtered.filter((char) => char.species === speciesFilter);
    }

    if (genderFilter) {
      filtered = filtered.filter((char) => char.gender === genderFilter);
    }

    setFilteredCharacters(filtered);
  }, [searchTerm, statusFilter, speciesFilter, genderFilter, characters, router]);

  // Get unique values for filters
  const statuses = Array.from(new Set(characters.map((c) => c.status)));
  const species = Array.from(new Set(characters.map((c) => c.species)));
  const genders = Array.from(new Set(characters.map((c) => c.gender)));

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSpeciesFilter('');
    setGenderFilter('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-400 mb-2">Contact List</h2>
        <p className="text-gray-400">
          Total Characters: {characters.length} | Showing: {filteredCharacters.length}
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="font-semibold text-gray-700">Filters:</h3>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Species</option>
            {species.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter || speciesFilter || genderFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Contact List Table */}
      <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-3 bg-gray-200 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-sm font-semibold text-gray-600">Name</div>
            <div className="text-sm font-semibold text-gray-600">Status</div>
            <div className="text-sm font-semibold text-gray-600">Species</div>
            <div className="text-sm font-semibold text-gray-600">Gender</div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((character) => (
              <ContactListItem key={character.id} character={character} />
            ))
          ) : (
            <li className="px-6 py-8 text-center text-gray-500">
              No characters found matching your filters
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}