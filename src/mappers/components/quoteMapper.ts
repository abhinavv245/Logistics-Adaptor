import { toUpper, toLower } from "lodash";

export class QuoteMapper {
  static transform(quoteV1: any): any {
    if (!quoteV1 || typeof quoteV1 !== "object") return quoteV1;

    return {
      ...quoteV1, // Retain all unmapped fields
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
            price: item.price ?? {}, // Keep `price` structure unchanged
          }))
        : [],
      ttl: quoteV1.ttl ?? undefined,
    };
  }

  static reverseTransform(quoteV2: any): any {
    if (!quoteV2 || typeof quoteV2 !== "object") return quoteV2;

    return {
      ...quoteV2, // Retain all unmapped fields
      price: quoteV2.price ?? {}, // Keep price as-is
      breakup: Array.isArray(quoteV2.breakup)
        ? quoteV2.breakup.map((item: { title: any; item: any; price: any }) => ({
            "@ondc/org/title_type": toLower(item.title), // Rename `title` → `@ondc/org/title_type`
            "@ondc/org/item_id": item.item?.id ?? {}, // Move `item.id` → `@ondc/org/item_id`
            "@ondc/org/item_quantity": item.item?.quantity?.selected ?? undefined, // Extract `selected` quantity
            price: item.price ?? {}, // Keep `price` structure unchanged
          }))
        : [],
      ttl: quoteV2.ttl ?? undefined,
    };
  }
}