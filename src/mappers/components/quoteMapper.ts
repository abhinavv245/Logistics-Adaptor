import { toUpper } from "lodash";

export class QuoteMapper {
  static transform(quoteV1: any): any {
    if (!quoteV1 || typeof quoteV1 !== "object") return quoteV1;

    return {
      ...quoteV1, //  Retain all unmapped fields
      price: quoteV1.price ?? {}, // Keep price as-is
      breakup: Array.isArray(quoteV1.breakup)
        ? quoteV1.breakup.map((item: { [x: string]: any; price: any }) => ({
            title: toUpper(item["@ondc/org/title_type"]), // Rename `@ondc/org/title_type` → `title`
            item: {
              id: item["@ondc/org/item_id"] ?? {}, // Move `@ondc/org/item_id` → `item.id`
              price: item.price ?? undefined, // Keep `price` inside item
              quantity: item["@ondc/org/item_quantity"]
                ? { selected: item["@ondc/org/item_quantity"] }
                : undefined,
            },
            price: item.price ?? {}, //  Keep `price` structure unchanged
          }))
        : [],
      ttl: quoteV1.ttl ?? undefined,
    };
  }
}
