import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { services, districts } from "../data";

export interface HeroSearchProps {
  service: string;
  onServiceChange: (service: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
  onSearch: () => void;
}

export function HeroSearch({
  service,
  onServiceChange,
  district,
  onDistrictChange,
  onSearch,
}: HeroSearchProps) {
  return (
    <div className="search-console" role="search" aria-label="Find a Budapest expert">
      <label>
        <span>What do you need?</span>
        <span className="select-wrap">
          <select
            value={service}
            onChange={(event) => onServiceChange(event.target.value)}
          >
            {services.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
          <CaretDown size={17} weight="bold" aria-hidden="true" />
        </span>
      </label>
      <label>
        <span>Where?</span>
        <span className="select-wrap">
          <select
            value={district}
            onChange={(event) => onDistrictChange(event.target.value)}
          >
            {districts.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <CaretDown size={17} weight="bold" aria-hidden="true" />
        </span>
      </label>
      <button
        className="search-button"
        type="button"
        onClick={onSearch}
        aria-label="Find an expert"
      >
        <MagnifyingGlass size={22} weight="bold" />
      </button>
    </div>
  );
}

export default HeroSearch;
