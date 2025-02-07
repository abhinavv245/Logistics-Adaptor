import { FulfillmentMapper } from "./fulfillmentMapper";
import { PaymentMapper } from "./paymentMapper";
import { TagsMapper } from "./tagsMapper";

export class IntentMapper {
  static transform(intentV1: any): any {
    if (!intentV1 || typeof intentV1 !== "object") return intentV1;

    return {
      ...intentV1, // Keep all existing properties unchanged
      fulfillment: FulfillmentMapper.transform(intentV1.fulfillment),
      tags: TagsMapper.transform(intentV1.tags),
      payment: intentV1.payment
        ? PaymentMapper.transform(intentV1.payment) // Convert object to array before transformation
        : undefined,
      "@ondc/org/linked_order": undefined, // Remove old key
      "@ondc/org/payload_details": undefined, // Remove old key
    };
  }

  static reverseTransform(intentV2: any): any {
    if (!intentV2 || typeof intentV2 !== "object") return intentV2;

    return {
      ...intentV2, // Keep all existing properties unchanged
      fulfillment: FulfillmentMapper.reverseTransform(intentV2.fulfillment),
      tags: TagsMapper.reverseTransform(intentV2.tags),
      payment: intentV2.payment
        ? PaymentMapper.reverseTransform(intentV2.payment) // Convert array back to object if needed
        : undefined,
      "@ondc/org/linked_order": undefined, // TBD
      "@ondc/org/payload_details": undefined, //TBD
    };
  }
}

//linked order and payload details are not currently added back in 1.2.5 as they are unavaialble in 2.0.0