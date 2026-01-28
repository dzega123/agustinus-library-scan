import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, Loader2 } from "lucide-react";
import * as supabaseStorage from "@/utils/supabaseStorage";
import type { Member } from "@/utils/supabaseStorage";

interface AnggotaTabProps {
  onCheckIn: (memberId: string) => void;
}

const AnggotaTab = ({ onCheckIn }: AnggotaTabProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load all members on mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const members = await supabaseStorage.getMembers();
        setAllMembers(members);
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);

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
      const filtered = allMembers.filter(
        (member) =>
          member.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
          member.member_id.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchInput, allMembers]);

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
            placeholder={loading ? "Memuat data..." : "No. anggota atau nama pengunjung"}
            className="flex-1"
            autoFocus
            disabled={loading}
          />
          <Button type="submit" size="icon" className="shrink-0" disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-[calc(100%-3rem)] mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((member) => (
              <button
                key={member.member_id}
                type="button"
                onClick={() => handleSelectMember(member.member_id)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
              >
                <div className="font-medium text-foreground">{member.nama}</div>
                <div className="text-sm text-muted-foreground">
                  {member.member_id} • {member.tipe_keanggotaan}
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
