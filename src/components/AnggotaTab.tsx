import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check } from "lucide-react";

interface AnggotaTabProps {
  onCheckIn: (memberId: string) => void;
}

const AnggotaTab = ({ onCheckIn }: AnggotaTabProps) => {
  const [memberId, setMemberId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId.trim()) {
      onCheckIn(memberId.trim());
      setMemberId("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <p className="text-center text-lg mb-6 text-foreground">
        Silahkan pindai kartu anggota Anda
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="No. anggota / pengunjung"
          className="flex-1"
          autoFocus
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Check className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default AnggotaTab;
