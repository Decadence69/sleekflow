import { Character } from "@/types/character";
import Link from "next/link";

interface ContactListItemProps {
  character: Character;
}

export default function ContactListItem({ character }: ContactListItemProps) {
  return (
    <li className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <Link href={`/characters/${character.id}`}>
        <div className="px-6 py-4 grid grid-cols-4 gap-4">
          <div>
            {/* <span className="text-sm font-semibold text-gray-600">Name:</span> */}
            <p className="text-gray-900">{character.name}</p>
          </div>
          <div>
            {/* <span className="text-sm font-semibold text-gray-600">Status:</span> */}
            <p className="text-gray-900">{character.status}</p>
          </div>
          <div>
            {/* <span className="text-sm font-semibold text-gray-600">Species:</span> */}
            <p className="text-gray-900">{character.species}</p>
          </div>
          <div>
            {/* <span className="text-sm font-semibold text-gray-600">Gender:</span> */}
            <p className="text-gray-900">{character.gender}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
