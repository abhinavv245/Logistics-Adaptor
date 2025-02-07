import { BillingMapper } from "./billingMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { PaymentMapper } from "./paymentMapper";
import { QuoteMapper } from "./quoteMapper";
import { TagsMapper } from "./tagsMapper";

export class TrackingMapper {
  static transform(trackingV1: any): any {
    if (!trackingV1 || typeof trackingV1 !== "object") return trackingV1;

    return {
      ...trackingV1, // Keep all existing properties unchanged
      tags: trackingV1.tags ? TagsMapper.transform(trackingV1.tags) :undefined
    };
  }
}

//location.time is not present in 2.0 (TBD)
