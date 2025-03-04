import { FulfillmentMapper } from "./fulfillmentMapper";
import { IntentPayloadDetailsMapper } from "./intentPayloadDetailsMapper";
import { PaymentMapper } from "./paymentMapper";
import { TagsMapper } from "./tagsMapper";

export class IntentMapper {
  static transform(intentV1: any): any {
    if (!intentV1 || typeof intentV1 !== "object") return intentV1;

    return {
      ...intentV1, // Keep all existing properties unchanged
      fulfillment: intentV1.fulfillment
        ? FulfillmentMapper.transform(intentV1.fulfillment)
        : undefined,
      tags: intentV1.tags ? TagsMapper.transform(intentV1.tags) : undefined,
      payment: intentV1.payment
        ? PaymentMapper.transform(intentV1.payment)
        : undefined,
      "@ondc/org/payload_details": undefined, // Remove old key
    };
  }

  static reverseTransform(intentV2: any): any {
    if (!intentV2 || typeof intentV2 !== "object") return intentV2;

    const fulfillment = intentV2.fulfillment
      ? FulfillmentMapper.reverseTransform(intentV2.fulfillment)
      : undefined;
    const tags = intentV2.tags ? TagsMapper.reverseTransform(intentV2.tags) : undefined;
    const payment = intentV2.payment
      ? PaymentMapper.reverseTransform(intentV2.payment)
      : undefined;

    const payloadDetails = fulfillment?.tags
      ? IntentPayloadDetailsMapper.extract(fulfillment.tags)
      : undefined;

    return {
      ...intentV2,
      fulfillment,
      tags,
      payment,
      "@ondc/org/payload_details": payloadDetails,
    };
  }
}
