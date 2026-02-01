import Image from "next/image";
import Link from "next/link";
import { Character, Episode } from "@/types/character";
import { Metadata } from "next";

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch character");
  return res.json();
}

async function getEpisodes(urls: string[]): Promise<Episode[]> {
  const episodes = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
      });
      return res.json();
    })
  );
  return episodes;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const character = await getCharacter(params.id);

  return {
    title: `${character.name} | SleekFlow`,
    description: `View information about ${character.name}`,
    openGraph: {
      title: character.name,
      description: `${character.status} ${character.species}`,
      images: [character.image],
    },
  };
}

export async function generateStaticParams() {
  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data = await res.json();

  return data.results.map((character: Character) => ({
    id: character.id.toString(),
  }));
}

export default async function CharacterProfile({
  params,
}: {
  params: { id: string };
}) {
  const character = await getCharacter(params.id);
  const episodes = await getEpisodes(character.episode);

  return (
    <>
      {/* Sticky Header - Full Width across entire viewport */}
      <div className="sticky top-0 z-10 bg-white shadow-md w-full">
        <div className="px-8 py-4">
          <div className="flex items-center gap-6">
            <Image
              src={character.image}
              alt={character.name}
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              {character.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to List
        </Link>

        {/* Personal Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Personal Info
          </h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-gray-600">Status:</span>
              <span className="ml-2 text-gray-900">{character.status}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Gender:</span>
              <span className="ml-2 text-gray-900">{character.gender}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Species:</span>
              <span className="ml-2 text-gray-900">{character.species}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Origin:</span>
              <span className="ml-2 text-gray-900">
                {character.origin.name}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Location:</span>
              <span className="ml-2 text-gray-900">
                {character.location.name}
              </span>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 px-6 py-4 border-b border-gray-200">
            Episodes
          </h2>

          {/* Episodes Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-semibold text-gray-600">Name</div>
              <div className="text-sm font-semibold text-gray-600">
                Air Date
              </div>
              <div className="text-sm font-semibold text-gray-600">Episode</div>
            </div>
          </div>

          {/* Episodes List */}
          <ul className="divide-y divide-gray-200">
            {episodes.map((episode) => (
              <li key={episode.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-900">{episode.name}</div>
                  <div className="text-gray-900">{episode.air_date}</div>
                  <div className="text-gray-900">{episode.episode}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}