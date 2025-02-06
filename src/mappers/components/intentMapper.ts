import { BillingMapper } from "./billingMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { PaymentMapper } from "./paymentMapper";
import { QuoteMapper } from "./quoteMapper";
import { TagsMapper } from "./tagsMapper";

export class IntentMapper {
  static transform(intentV1: any): any {
    if (!intentV1 || typeof intentV1 !== "object") return intentV1;

    return {
      ...intentV1, // Keep all existing properties unchanged
      fulfillment: FulfillmentMapper.transform(intentV1.fulfillments),
      tags: TagsMapper.transform(intentV1.tags),
      payment: intentV1.payment
        ? PaymentMapper.transform(intentV1.payment) // Convert object to array before transformation
        : undefined,
      "@ondc/org/linked_order": undefined,
      "@ondc/org/payload_details":undefined,
    };
  }
}
