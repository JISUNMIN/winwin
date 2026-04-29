import type * as Location from 'expo-location';

function joinAddressParts(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');
}

export function formatFullLocationText(
  address: Location.LocationGeocodedAddress | null | undefined,
  fallback = '주소를 확인하지 못했어요',
) {
  const primary = joinAddressParts([
    address?.city,
    address?.district,
    address?.subregion,
    address?.street,
    address?.streetNumber,
  ]);

  if (primary) {
    return primary;
  }

  const secondary = joinAddressParts([
    address?.region,
    address?.city,
    address?.district,
    address?.subregion,
    address?.name,
  ]);

  return secondary || fallback;
}

export function formatPublicLocationText(
  address: Location.LocationGeocodedAddress | null | undefined,
  fallback: string,
) {
  const publicText = joinAddressParts([
    address?.region,
    address?.city,
    address?.district,
    address?.subregion,
  ]);

  return publicText || fallback.trim();
}
