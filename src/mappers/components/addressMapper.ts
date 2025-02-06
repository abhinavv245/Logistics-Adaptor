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
      state: addressV1.state? { name: addressV1.state } : undefined,
      country: addressV1.country? { name: addressV1.country }: undefined ,
      area_code:addressV1.area_code ?  addressV1.area_code : undefined,
    };
  }
}
