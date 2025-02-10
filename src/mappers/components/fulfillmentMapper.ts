import { AddressMapper } from "./addressMapper";
import { ContactMapper } from "./contactMapper";
import { TagsMapper } from "./tagsMapper";
import _, { toUpper, toLower } from "lodash";

export const EWAY_MAPPINGS: Record<string, string> = {
  "@ondc/org/ewaybillno": "bill_no",
  "@ondc/org/ebnexpirydate": "expiry_date",
};

export const AWB_MAPPINGS: Record<string, string> = {
  "@ondc/org/awb_no": "number",
};

export class FulfillmentMapper {
  static transform(fulfillmentV1: any): any {
    if (!fulfillmentV1 || typeof fulfillmentV1 !== "object")
      return fulfillmentV1;

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
              ...AddressMapper.transform(start.location.address),
            }
          : undefined,
        contact: start.contact
          ? ContactMapper.transform(start.contact)
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
              ...AddressMapper.transform(end.location.address),
            }
          : undefined,
        contact: end.contact ? ContactMapper.transform(end.contact) : undefined,
      });
    }

    let transformedTags = TagsMapper.transform(tags || []);

    // Create EWAY tag only if there are values
    const ewayList = Object.entries(EWAY_MAPPINGS)
      .map(([key, value]) => {
        const attributeValue = fulfillmentV1[key];
        return attributeValue
          ? { descriptor: { code: toUpper(value) }, value: attributeValue }
          : null;
      })
      .filter(Boolean); // Remove null values

    if (ewayList.length > 0) {
      transformedTags.push({
        descriptor: { code: "EWAY" },
        list: ewayList,
      });
    }

    // Create AWB tag only if there are values
    const awbList = Object.entries(AWB_MAPPINGS)
      .map(([key, value]) => {
        const attributeValue = fulfillmentV1[key];
        return attributeValue
          ? { descriptor: { code: toUpper(value) }, value: attributeValue }
          : null;
      })
      .filter(Boolean); // Remove null values

    if (awbList.length > 0) {
      transformedTags.push({
        descriptor: { code: "AWB" },
        list: awbList,
      });
    }

    return {
      ...rest,
      type,
      stops: stops.length > 0 ? stops : undefined,
      tags: transformedTags.length > 0 ? transformedTags : undefined,
      "@ondc/org/awb_no": undefined,
    };
  }

  static transformArray(fulfillmentsV1: any[]): any[] {
    return fulfillmentsV1.map(this.transform.bind(this));
  }

  static reverseTransform(fulfillmentV2: any): any {
    if (!fulfillmentV2 || typeof fulfillmentV2 !== "object")
      return fulfillmentV2;

    if (Array.isArray(fulfillmentV2)) {
      return this.reverseTransformArray(fulfillmentV2);
    }

    const { type, stops, tags, ...rest } = fulfillmentV2;
    let start, end;

    if (Array.isArray(stops)) {
      start = stops.find((stop) => stop.type === "START");
      end = stops.find((stop) => stop.type === "END");
    }

    let transformedTags = TagsMapper.reverseTransform(tags || []);

    const ewayMappingsReverse = Object.fromEntries(
      Object.entries(EWAY_MAPPINGS).map(([key, value]) => [value, key])
    );

    const awbMappingsReverse = Object.fromEntries(
      Object.entries(AWB_MAPPINGS).map(([key, value]) => [value, key])
    );

    let ewayValues: Record<string, any> = {};
    let awbValues: Record<string, any> = {};

    // **Filter out EWAY and AWB tags, and extract their values**
    if (Array.isArray(tags)) {
      transformedTags = transformedTags.filter((tag) => {
        if (tag?.code === "eway" && Array.isArray(tag.list)) {
          tag.list.forEach((item: { code: any; value: any }) => {
            const originalKey = ewayMappingsReverse[item?.code];
            if (originalKey) {
              ewayValues[originalKey] = item.value;
            }
          });
          return false; // **Remove EWAY tag from transformedTags**
        }

        if (tag?.code === "awb" && Array.isArray(tag.list)) {
          tag.list.forEach((item: { code: any; value: any }) => {
            const originalKey = awbMappingsReverse[item?.code];
            if (originalKey) {
              awbValues[originalKey] = item.value;
            }
          });
          return false; // **Remove AWB tag from transformedTags**
        }

        return true; // **Keep other tags**
      });
    }

    return {
      ...rest,
      type,
      start: start
        ? {
            ...start,
            type: undefined,
            location: start.location
              ? {
                  gps: start.location.gps,
                  address: AddressMapper.reverseTransform(start.location),
                }
              : undefined,
            contact: start.contact
              ? ContactMapper.reverseTransform(start.contact)
              : undefined,
          }
        : undefined,
      end: end
        ? {
            ...end,
            type: undefined,
            location: end.location
              ? {
                  gps: end.location.gps,
                  address: AddressMapper.reverseTransform(end.location),
                }
              : undefined,
            contact: end.contact
              ? ContactMapper.reverseTransform(end.contact)
              : undefined,
          }
        : undefined,
      tags: transformedTags.length > 0 ? transformedTags : undefined,
      // **Restore original EWAY and AWB fields explicitly**
      "@ondc/org/ewaybillno": ewayValues["@ondc/org/ewaybillno"] || undefined,
      "@ondc/org/ebnexpirydate":
        ewayValues["@ondc/org/ebnexpirydate"] || undefined,
      "@ondc/org/awb_no": awbValues["@ondc/org/awb_no"] || undefined,
    };
  }

  static reverseTransformArray(fulfillmentsV2: any[]): any[] {
    return fulfillmentsV2.map(this.reverseTransform.bind(this));
  }
}
