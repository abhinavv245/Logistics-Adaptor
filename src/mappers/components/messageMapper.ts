import { CatalogMapper } from "./catalogMapper";
import { IntentMapper } from "./intentMapper";
import { OrderMapper } from "./orderMapper";
import { TrackingMapper } from "./trackingMapper";

export class MessageMapper {
  static transform(messageV1: any): any {
    if (!messageV1 || typeof messageV1 !== "object") return messageV1;

    return {
     ...messageV1,
      order: messageV1.order
        ? OrderMapper.transform(messageV1.order)
        : undefined,
      intent: messageV1.intent
        ? IntentMapper.transform(messageV1.intent)
        : undefined,
      catalog: messageV1.catalog
        ? CatalogMapper.transform(messageV1.catalog)
        : undefined,
      tracking: messageV1.tracking
        ? TrackingMapper.transform(messageV1.tracking)
        : undefined,
    };
  }
}
