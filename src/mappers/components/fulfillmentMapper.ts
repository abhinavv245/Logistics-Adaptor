import { AddressMapper } from "./addressMapper";
import { TagsMapper } from "./tagsMapper";
import _, { toUpper } from "lodash";

export class FulfillmentMapper {
  static transform(fulfillmentV1: any): any {
    if (!fulfillmentV1 || typeof fulfillmentV1 !== "object") return fulfillmentV1;


    if (Array.isArray(fulfillmentV1)) {
      return this.transformArray(fulfillmentV1);
    }

    const { type, start, end, tags, ...rest } = fulfillmentV1;
    const stops = [];

    if (start) {
      stops.push({
        type: "START",
        ...start,
        location: start.location
          ? {
              gps: start.location.gps,
              ...AddressMapper.transform(start.location.address), // Transform address
            }
          : undefined,
      });
    }

    if (end) {
      stops.push({
        type: "END",
        ...end,
        location: end.location
          ? {
              gps: end.location.gps,
              ...AddressMapper.transform(end.location.address), // Transform address
            }
          : undefined,
      });
    }

    // Ensure tags exist and transform them into the expected structure
    const transformedTags = TagsMapper.transform(tags || []);

    // Create new tag structures for "EWAY" and "AWB" with mapped values inside a list
    const ewayTag = {
      descriptor: { code: "EWAY" },
      list: Object.entries(EWAY_MAPPINGS).map(([key, value]) => ({
        descriptor: { code: toUpper(value) },
        value: fulfillmentV1[key],
      })),
    };

    const awbTag = {
      descriptor: { code: "AWB" },
      list: Object.entries(AWB_MAPPINGS).map(([key, value]) => ({
        descriptor: { code: toUpper(value) },
        value: fulfillmentV1[key],
      })),
    };

    // Merge new tags into existing tags
    transformedTags.push(ewayTag);
    transformedTags.push(awbTag);

    return {
      type,
      stops: fulfillmentV1.start || fulfillmentV1.end ? stops : undefined,
      ...(tags ? { tags: transformedTags } : {}),
      ...rest,
      "@ondc/org/ewaybillno": undefined,
      "@ondc/org/ebnexpirydate": undefined,
      "@ondc/org/awb_no": undefined,
    };
  }

  static transformArray(fulfillmentsV1: any[]): any[] {
    return fulfillmentsV1.map(this.transform.bind(this));
  }
} 

export const EWAY_MAPPINGS: Record<string, string> = {
  "@ondc/org/ewaybillno": "bill_no",
  "@ondc/org/ebnexpirydate": "expiry_date",
};

export const AWB_MAPPINGS: Record<string, string> = {
  "@ondc/org/awb_no": "number",
};
