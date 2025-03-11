import { capitalizeEachWord, capitalizeFirstLetter } from "../../utils/constants";
import { TagsMapper } from "./tagsMapper";
import _, { toUpper, toLower } from "lodash";

export class ItemMapper {
  static transform(itemsV1: any[]): any[] {
    if (!Array.isArray(itemsV1)) return [];

    return itemsV1.map((item) => ({
      ...item, // Retain any other properties that are not explicitly transformed
      fulfillment_ids: item.fulfillment_id ? [item.fulfillment_id] : undefined, // Convert to array
      category_ids: item.category_id ? [toUpper(item.category_id)] : undefined, // Convert to array
      tags: item.tags ? TagsMapper.transform(item.tags) : undefined,
      fulfillment_id: undefined, // Remove old key
      category_id: undefined, // Remove old key
    }));
  }

  static reverseTransform(itemsV2: any[]): any[] {
    if (!Array.isArray(itemsV2)) return [];

    return itemsV2.map((item) => ({
      ...item, // Retain any other properties that are not explicitly transformed
      fulfillment_id: Array.isArray(item.fulfillment_ids)
        ? item.fulfillment_ids[0]
        : undefined, // Convert array to single value
      category_id: Array.isArray(item.category_ids)
        ? capitalizeEachWord(item.category_ids[0])
        : undefined, // Convert array to single value
      tags: item.tags ? TagsMapper.reverseTransform(item.tags) : undefined,
      fulfillment_ids: undefined, // Remove new key
      category_ids: undefined, // Remove new key
    }));
  }
}


