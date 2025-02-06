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
        updated_at: undefined
      };
    }
  }