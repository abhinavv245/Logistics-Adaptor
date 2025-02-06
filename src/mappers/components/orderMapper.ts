import { BillingMapper } from "./billingMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { PaymentMapper } from "./paymentMapper";
import { QuoteMapper } from "./quoteMapper";
import { TagsMapper } from "./tagsMapper";

export class OrderMapper {
  static transform(orderV1: any): any {
    if (!orderV1 || typeof orderV1 !== "object") return orderV1;

    return {
      ...orderV1, // Keep all existing properties unchanged
      state: orderV1.status ? orderV1.status : undefined, // Map `status` to `orderV1.state`
      items: ItemMapper.transform(orderV1.items),
      fulfillments: FulfillmentMapper.transform(orderV1.fulfillments),
      tags: TagsMapper.transform(orderV1.tags),
      billing: BillingMapper.transform(orderV1.billing),
      quote: QuoteMapper.transform(orderV1.quote),
      payments: orderV1.payment
        ? [PaymentMapper.transform(orderV1.payment)] // Convert object to array before transformation
        : undefined,
      "@ondc/org/linked_order": undefined,
      status: undefined, // Remove old `status` key
      payment: undefined, // Remove old `payment` key
    };
  }
}
