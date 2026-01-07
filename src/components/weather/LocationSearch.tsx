import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";

interface LocationSearchProps {
  onSearch: (city: string) => void;
  onUseCurrentLocation: () => void;
  loading: boolean;
}

const LocationSearch = ({ onSearch, onUseCurrentLocation, loading }: LocationSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>
      <Button type="submit" disabled={loading || !query.trim()} className="gradient-sky">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onUseCurrentLocation}
        disabled={loading}
        className="gap-2"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">My Location</span>
      </Button>
    </form>
  );
};

export default LocationSearch;