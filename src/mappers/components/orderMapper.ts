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
      state: orderV1.status ? orderV1.status : undefined, // Map `status` to `state`
      items: ItemMapper.transform(orderV1.items),
      fulfillments: FulfillmentMapper.transform(orderV1.fulfillments),
      tags: orderV1.tags ? TagsMapper.transform(orderV1.tags): undefined,
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

  static reverseTransform(orderV2: any): any {
    if (!orderV2 || typeof orderV2 !== "object") return orderV2;

    return {
      ...orderV2, // Keep all existing properties unchanged
      status: orderV2.state ? orderV2.state : undefined, // Map `state` back to `status`
      items: ItemMapper.reverseTransform(orderV2.items),
      fulfillments: FulfillmentMapper.reverseTransform(orderV2.fulfillments),
      tags: orderV2.tags ? TagsMapper.reverseTransform(orderV2.tags) : undefined,
      billing: BillingMapper.reverseTransform(orderV2.billing),
      quote: QuoteMapper.reverseTransform(orderV2.quote),
      payment: orderV2.payments && orderV2.payments.length > 0
        ? PaymentMapper.reverseTransform(orderV2.payments[0]) // Convert array back to object
        : undefined,
      "@ondc/org/linked_order": undefined, //TBD
      state: undefined, // Remove `state` key
      payments: undefined, // Remove `payments` key
    };
  }
} 

//linked order cannot be transformed back to 1.2.5 as it was removed in 2.0.0

