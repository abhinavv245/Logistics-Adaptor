import { TagsMapper } from "./tagsMapper";

export class DescriptorMapper {
  static transform(descriptorV1: any): any {
    if (!descriptorV1 || typeof descriptorV1 !== "object") return descriptorV1;

    return {
      ...descriptorV1,
      tags: descriptorV1.tags ? TagsMapper.transform(descriptorV1.tags) : undefined, // Keep all descriptor properties unchanged
    };
  }

  static reverseTransform(descriptorV2: any): any {
    if (!descriptorV2 || typeof descriptorV2 !== "object") return descriptorV2;

    return {
      ...descriptorV2,
      tags: descriptorV2.tags ? TagsMapper.reverseTransform(descriptorV2.tags) : undefined, // Reverse tags transformation
    };
  }
}