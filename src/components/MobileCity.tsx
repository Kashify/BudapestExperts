import { MapPin } from "@phosphor-icons/react";
import { districts, mobilePinPositions, mobileServiceOffsets } from "../data";

export interface MobileCityProps {
  activeService: string;
  activeDistrict: string;
}

export function MobileCity({ activeService, activeDistrict }: MobileCityProps) {
  const districtIndex = Math.max(0, districts.indexOf(activeDistrict));
  const districtPosition = mobilePinPositions[districtIndex] ?? mobilePinPositions[0];
  const serviceOffset = mobileServiceOffsets[activeService] ?? { top: 0, left: 0 };
  const pinPosition = {
    top: `${parseFloat(districtPosition.top) + serviceOffset.top}%`,
    left: `${parseFloat(districtPosition.left) + serviceOffset.left}%`,
  };

  return (
    <div className="mobile-city" aria-hidden="true">
      <div className="mobile-city-platform">
        <span className="mobile-river" />
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} className={`mobile-building building-${index + 1}`} />
        ))}
        <span className="mobile-bridge bridge-one" />
        <span className="mobile-bridge bridge-two" />
        <span className="mobile-map-pin" style={pinPosition}>
          <MapPin size={18} weight="fill" />
        </span>
      </div>
      <span className="mobile-scene-label">{activeService}</span>
    </div>
  );
}

export default MobileCity;
