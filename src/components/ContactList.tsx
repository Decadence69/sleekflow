"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContactListItem from "@/components/ContactListItem";
import { ApiResponse, Character } from "@/types/character";

export default function ContactList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [info, setInfo] = useState<ApiResponse["info"] | null>(null);

  // Dynamic filter options
  const [allSpecies, setAllSpecies] = useState<string[]>([]);

  // Get initial values from URL
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [speciesFilter, setSpeciesFilter] = useState(
    searchParams.get("species") || "",
  );
  const [genderFilter, setGenderFilter] = useState(
    searchParams.get("gender") || "",
  );

  // Fetch all species options once on mount
  useEffect(() => {
    async function fetchAllSpecies() {
      try {
        const speciesSet = new Set<string>();
        let page = 1;
        let hasMore = true;

        // Fetch all pages to get all unique species
        while (hasMore && page <= 10) {
          // Limit to 10 pages to avoid too many requests
          const res = await fetch(
            `https://rickandmortyapi.com/api/character?page=${page}`,
          );
          if (!res.ok) break;

          const data: ApiResponse = await res.json();
          data.results.forEach((char) => speciesSet.add(char.species));

          hasMore = data.info.next !== null;
          page++;
        }

        setAllSpecies(Array.from(speciesSet).sort());
      } catch (error) {
        console.error("Failed to fetch species:", error);
        // Fallback to common species if fetch fails
        setAllSpecies([
          "Human",
          "Alien",
          "Humanoid",
          "Robot",
          "Cronenberg",
          "Disease",
          "Animal",
        ]);
      }
    }
    fetchAllSpecies();
  }, []);

  // Fetch characters for current page
  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      try {
        // Build query parameters for API
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        if (searchTerm) params.set("name", searchTerm);
        if (statusFilter) params.set("status", statusFilter);
        if (speciesFilter) params.set("species", speciesFilter);
        if (genderFilter) params.set("gender", genderFilter);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character?${params.toString()}`,
        );

        if (!res.ok) {
          // API returns 404 when no results match filters
          setCharacters([]);
          setFilteredCharacters([]);
          setTotalPages(1);
          return;
        }

        const data: ApiResponse = await res.json();
        setCharacters(data.results);
        setFilteredCharacters(data.results);
        setInfo(data.info);
        setTotalPages(data.info.pages);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        setCharacters([]);
        setFilteredCharacters([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, [currentPage, searchTerm, statusFilter, speciesFilter, genderFilter]);

  // Update URL when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter) params.set("status", statusFilter);
    if (speciesFilter) params.set("species", speciesFilter);
    if (genderFilter) params.set("gender", genderFilter);

    const newUrl = params.toString() ? `?${params.toString()}` : "/";
    router.replace(newUrl, { scroll: false });
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    speciesFilter,
    genderFilter,
    router,
  ]);

  // Predefined filter options
  const statuses = ["Alive", "Dead", "Unknown"];
  const genders = ["Male", "Female", "Genderless", "Unknown"];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSpeciesFilter("");
    setGenderFilter("");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && allSpecies.length === 0) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-400 mb-2">Contact List</h2>
        <p className="text-gray-400">
          {info && `Total Characters: ${info.count} | `}
          Showing: {filteredCharacters.length} | Page {currentPage} of{" "}
          {totalPages}
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="font-semibold text-gray-700">Filters:</h3>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(e) => {
              setSpeciesFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Species</option>
            {allSpecies.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
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

      {/* Pagination Controls */}
      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {/* First page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Pages around current page */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show current page and 2 pages before and after
              return page >= currentPage - 2 && page <= currentPage + 2;
            })
            .map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

          {/* Last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => {
                  setCurrentPage(totalPages);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
