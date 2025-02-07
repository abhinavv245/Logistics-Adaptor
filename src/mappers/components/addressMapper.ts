export class AddressMapper {
  static transform(addressV1: any): any {
    if (!addressV1 || typeof addressV1 !== "object") return addressV1;

    // Concatenate address fields into a single formatted string
    const formattedAddress = [
      addressV1.name,
      addressV1.building,
      addressV1.locality,
    ]
      .filter(Boolean) // Remove undefined values
      .join(", "); // Join with a comma

    return {
      address: formattedAddress || undefined, // Convert detailed address into a single string
      city: addressV1.city ? { name: addressV1.city } : undefined,
      state: addressV1.state ? { name: addressV1.state } : undefined,
      country: addressV1.country ? { name: addressV1.country } : undefined,
      area_code: addressV1.area_code ? addressV1.area_code : undefined,
    };
  }

  static reverseTransform(addressV2: any): any {
    if (!addressV2 || typeof addressV2 !== "object") return addressV2;

    // Split formatted address back into components if possible
    const addressParts = addressV2.address ? addressV2.address.split(", ") : [];

    return {
      name: addressParts[0] || undefined,
      building: addressParts[1] || undefined,
      locality: addressParts[2] || undefined,
      city: addressV2.city?.name || undefined,
      state: addressV2.state?.name || undefined,
      country: addressV2.country?.name || undefined,
      area_code: addressV2.area_code || undefined,
    };
  }
}