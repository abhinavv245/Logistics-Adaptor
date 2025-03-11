import { capitalizeFirstLetter } from "../../utils/constants";
import { BillingMapper } from "./billingMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { LinkedOrderMapper } from "./linkedOrderMapper";
import { PaymentMapper } from "./paymentMapper";
import { QuoteMapper } from "./quoteMapper";
import { TagsMapper } from "./tagsMapper";
import _, { toUpper, toLower } from "lodash";

export class OrderMapper {
  static transform(orderV1: any): any {
    if (!orderV1 || typeof orderV1 !== "object") return undefined;

    return {
      ...orderV1,
      status: orderV1.state ? toUpper(orderV1.state) : undefined,
      items: orderV1.items ? ItemMapper.transform(orderV1.items) : undefined,
      fulfillments: orderV1.fulfillments
        ? FulfillmentMapper.transformArray(orderV1.fulfillments)
        : undefined,
      tags: orderV1.tags ? TagsMapper.transform(orderV1.tags) : undefined,
      billing: orderV1.billing
        ? BillingMapper.transform(orderV1.billing)
        : undefined,
      quote: orderV1.quote ? QuoteMapper.transform(orderV1.quote) : undefined,
      payments: orderV1.payment
        ? [PaymentMapper.transform(orderV1.payment)]
        : undefined,
      "@ondc/org/linked_order": undefined,
      state: undefined,
      payment: undefined,
    };
  }

  static reverseTransform(orderV2: any): any {
    if (!orderV2 || typeof orderV2 !== "object") return undefined;
    const items = orderV2.items
      ? ItemMapper.reverseTransform(orderV2.items)
      : undefined;
    const fulfillments = orderV2.fulfillments
      ? FulfillmentMapper.reverseTransformArray(orderV2.fulfillments)
      : undefined;
    const billing = orderV2.billing
      ? BillingMapper.reverseTransform(orderV2.billing)
      : undefined;
    const quote = orderV2.quote
      ? QuoteMapper.reverseTransform(orderV2.quote)
      : undefined;
    const payments = orderV2.payment
      ? PaymentMapper.reverseTransform(orderV2.payment)
      : undefined;

    const deliveryFulfillment = fulfillments
      ? fulfillments.find((f) => f.type === "Delivery")
      : undefined;
    const linkedOrder = deliveryFulfillment
      ? LinkedOrderMapper.extract(deliveryFulfillment.tags)
      : undefined;

    return {
      ...orderV2,
      state: orderV2.status ? capitalizeFirstLetter(orderV2.status) : undefined,
      fulfillments,
      items,
      billing,
      quote,
      payments,
      tags: orderV2.tags
        ? TagsMapper.reverseTransform(orderV2.tags)
        : undefined,
      "@ondc/org/linked_order": linkedOrder,
      status: undefined,
    };
  }
}
