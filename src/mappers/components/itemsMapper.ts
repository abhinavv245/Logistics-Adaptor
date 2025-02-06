import { TagsMapper } from "./tagsMapper";

export class ItemMapper {
  static transform(itemsV1: any[]): any[] {
    if (!Array.isArray(itemsV1)) return [];

    return itemsV1.map((item) => ({
      ...item, // Retain any other properties that are not explicitly transformed
      fulfillment_ids: item.fulfillment_id ? [item.fulfillment_id] : [], // Convert to array
      category_ids: item.category_id ? [item.category_id] : [], // Convert to array
      tags: item.tags ? TagsMapper.transform(item.tags) : undefined,
      fulfillment_id: undefined,
      category_id: undefined,
    }));
  }
}
