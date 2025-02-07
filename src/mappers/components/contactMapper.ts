import { TagsMapper } from "./tagsMapper";

export class ContactMapper {
  static transform(contactV1: any): any {
    if (!contactV1 || typeof contactV1 !== "object") return contactV1;

    return {
      ...contactV1, // Keep all existing properties unchanged
      tags: TagsMapper.transform(contactV1.tags),
    };
  }

  static reverseTransform(contactV2: any): any {
    if (!contactV2 || typeof contactV2 !== "object") return contactV2;

    return {
      ...contactV2, // Keep all existing properties unchanged
      tags: TagsMapper.reverseTransform(contactV2.tags),
    };
  }
}

//tags are not present inside contact in 2.0