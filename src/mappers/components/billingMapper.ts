import { AddressMapper } from "./addressMapper";

export class BillingMapper {
  static transform(billingV1: any): any {
    if (!billingV1 || typeof billingV1 !== "object") return billingV1;

    // Use AddressMapper to transform the address
    const transformedAddress = AddressMapper.transform(billingV1.address);

    return {
      name: billingV1.name,
      address: transformedAddress.address, // Use formatted address from AddressMapper
      state: transformedAddress.state, // Use transformed state
      city: transformedAddress.city, // Use transformed city
      country: transformedAddress.country, // Use transformed country
      tax_id: billingV1.tax_number,
      email: billingV1.email,
      phone: billingV1.phone,
      time: { timestamp: billingV1.created_at },
      updated_at: undefined, // Remove updated_at if present
    };
  }

  static reverseTransform(billingV2: any): any {
    if (!billingV2 || typeof billingV2 !== "object") return billingV2;

    // Reverse transform address using AddressMapper
    const reversedAddress = AddressMapper.reverseTransform({
      address: billingV2.address,
      state: billingV2.state,
      city: billingV2.city,
      country: billingV2.country,
    });

    return {
      name: billingV2.name,
      address: reversedAddress, // Restore original address format
      state: undefined, // Remove state field as it's inside address
      city: undefined, // Remove city field as it's inside address
      country: undefined, // Remove country field as it's inside address
      tax_number: billingV2.tax_id,
      email: billingV2.email,
      phone: billingV2.phone,
      created_at: billingV2.time?.timestamp, // Restore created_at from timestamp
      updated_at: billingV2.time?.timestamp,
      time: undefined, // Remove time field
    };
  }
}
