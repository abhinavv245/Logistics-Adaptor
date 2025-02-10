import { BillingMapper } from "./billingMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { LinkedOrderMapper } from "./linkedOrderMapper";
import { PaymentMapper } from "./paymentMapper";
import { QuoteMapper } from "./quoteMapper";
import { TagsMapper } from "./tagsMapper";

export class OrderMapper {
  static transform(orderV1: any): any {
    if (!orderV1 || typeof orderV1 !== "object") return orderV1;

    return {
      ...orderV1, // Keep all existing properties unchanged
      status: orderV1.state ? orderV1.state : undefined, // Map `state` to `status`
      items: ItemMapper.transform(orderV1.items),
      fulfillments: FulfillmentMapper.transformArray(orderV1.fulfillments),
      tags: TagsMapper.transform(orderV1.tags),
      billing: BillingMapper.transform(orderV1.billing),
      quote: QuoteMapper.transform(orderV1.quote),
      payments: orderV1.payment
        ? [PaymentMapper.transform(orderV1.payment)] // Convert object to array before transformation
        : undefined,
      "@ondc/org/linked_order": undefined, // Remove old key
      state: undefined, // Remove old `status` key
      payment: undefined, // Remove old `payment` key
    };
  }

  static reverseTransform(orderV2: any): any {
    if (!orderV2 || typeof orderV2 !== "object") return orderV2;

    const fulfillments = FulfillmentMapper.reverseTransformArray(
      orderV2.fulfillments
    );
    const billing = BillingMapper.reverseTransform(orderV2.billing);
    const quote = QuoteMapper.reverseTransform(orderV2.quote);
    const payments = orderV2.payment
      ? PaymentMapper.reverseTransform(orderV2.payment)
      : undefined;

    const deliveryFulfillment = fulfillments.find((f) => f.type === "Delivery");
    const linkedOrder = LinkedOrderMapper.extract(deliveryFulfillment?.tags);

    return {
      ...orderV2,
      state: orderV2.status ? orderV2.status : undefined, // Map `status` to `state`
      fulfillments,
      billing,
      quote,
      payments,
      tags: orderV2.tags
        ? TagsMapper.reverseTransform(orderV2.tags)
        : undefined,
      "@ondc/org/linked_order": linkedOrder,
      status: undefined
    };
  }
}
