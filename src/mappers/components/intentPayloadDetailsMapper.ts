export class IntentPayloadDetailsMapper {
  static extract(fulfillmentTags: any[]): Record<string, any> | undefined {
    if (!Array.isArray(fulfillmentTags)) return undefined;

    const linkedOrderTag = fulfillmentTags.find(
      (tag) => tag.code === "linked_order"
    );
    if (!linkedOrderTag?.list) return undefined;

    let payloadDetails: Record<string, any> = { };

    linkedOrderTag.list.forEach((item: { code: any; value: any }) => {
      const key = item.code;
      const value = item.value;

      switch (key) {
        case "currency":
          payloadDetails.value = {
            ...(payloadDetails.value || {}),
            currency: value,
          };
          break;
        case "declared_value":
          payloadDetails.value = {
            ...(payloadDetails.value || {}),
            value: value,
          };
          break;
        case "category":
          payloadDetails.category = value;
          break;
        case "weight_unit":
          payloadDetails.weight = {
            ...(payloadDetails.weight || {}),
            unit: value,
          };
          break;
        case "weight_value":
          payloadDetails.weight = {
            ...(payloadDetails.weight || {}),
            value: parseFloat(value),
          };
          break;
        case "dim_unit":
          payloadDetails.dimensions = {
            length: { unit: value },
            breadth: { unit: value },
            height: { unit: value },
          };
          break;
        case "length":
          payloadDetails.dimensions.length.value = parseFloat(value);
          break;
        case "breadth":
          payloadDetails.dimensions.breadth.value = parseFloat(value);
          break;
        case "height":
          payloadDetails.dimensions.height.value = parseFloat(value);
          break;
      }
    });

    return Object.keys(payloadDetails).length > 1 ? payloadDetails : undefined;
  }
}
