import { TagsMapper } from "./tagsMapper";

export class DescriptorMapper {
    static transform(descriptorV1: any): any {
      if (!descriptorV1 || typeof descriptorV1 !== "object") return descriptorV1;
  
      return {
        ...descriptorV1,
        tags: descriptorV1.tags ? TagsMapper.transform(descriptorV1.tags): undefined //Keep all descriptor properties unchanged
      };
    }
  }