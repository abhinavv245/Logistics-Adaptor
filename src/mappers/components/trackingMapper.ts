import { TagsMapper } from "./tagsMapper";

export class TrackingMapper {
  static transform(trackingV1: any): any {
    if (!trackingV1 || typeof trackingV1 !== "object") return trackingV1;

    return {
      ...trackingV1, // Keep all existing properties unchanged
      tags: trackingV1.tags ? TagsMapper.transform(trackingV1.tags) : undefined,
    };
  }

  static reverseTransform(trackingV2: any): any {
    if (!trackingV2 || typeof trackingV2 !== "object") return trackingV2;

    return {
      ...trackingV2, // Keep all existing properties unchanged
      tags: trackingV2.tags ? TagsMapper.reverseTransform(trackingV2.tags) : undefined,
    };
  }
}
//location.time is not present in 2.0 (TBD)
