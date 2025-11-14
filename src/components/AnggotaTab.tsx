import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check } from "lucide-react";
import { storageUtils } from "@/utils/localStorage";

interface AnggotaTabProps {
  onCheckIn: (memberId: string) => void;
}

const AnggotaTab = ({ onCheckIn }: AnggotaTabProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchInput.trim().length > 0) {
      const members = storageUtils.getMembers();
      const filtered = members.filter(
        (member) =>
          member.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
          member.idAnggota.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onCheckIn(searchInput.trim());
      setSearchInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectMember = (memberId: string) => {
    onCheckIn(memberId);
    setSearchInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <p className="text-center text-lg mb-6 text-foreground">
        Silahkan pindai kartu anggota atau cari berdasarkan nama
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="No. anggota atau nama pengunjung"
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="icon" className="shrink-0">
            <Check className="w-5 h-5" />
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-[calc(100%-3rem)] mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((member) => (
              <button
                key={member.idAnggota}
                type="button"
                onClick={() => handleSelectMember(member.idAnggota)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
              >
                <div className="font-medium text-foreground">{member.nama}</div>
                <div className="text-sm text-muted-foreground">
                  {member.idAnggota} • {member.tipeKeanggotaan}
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default AnggotaTab;
