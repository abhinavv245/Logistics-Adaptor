export class LinkedOrderMapper {
  static extract(fulfillmentTags: any[]): Record<string, any> | undefined {
    if (!Array.isArray(fulfillmentTags)) return undefined;

    const linkedOrderTag = fulfillmentTags.find(
      (tag) => tag.code === "linked_order"
    );
    const linkedProviderTag = fulfillmentTags.find(
      (tag) => tag.code === "linked_provider"
    );
    const linkedOrderItemTags = fulfillmentTags.filter(
      (tag) => tag.code === "linked_order_item"
    );

    if (!linkedOrderTag?.list) return undefined;

    let linkedOrder: Record<string, any> = {};
    let linkedProvider: Record<string, any> = {};
    let linkedItems: any[] = [];

    // Process `linked_order`
    linkedOrderTag.list.forEach((item: { code: string; value: string }) => {
      if (item.code === "id") linkedOrder.order = { id: item.value };
      else if (item.code === "weight_unit")
        linkedOrder.order = {
          ...linkedOrder.order,
          weight: { unit: item.value },
        };
      else if (item.code === "weight_value")
        linkedOrder.order.weight.value = parseFloat(item.value);
      else if (item.code === "dim_unit")
        linkedOrder.order.dimensions = {
          length: { unit: item.value },
          breadth: { unit: item.value },
          height: { unit: item.value },
        };
      else if (item.code === "length")
        linkedOrder.order.dimensions.length.value = parseFloat(item.value);
      else if (item.code === "breadth")
        linkedOrder.order.dimensions.breadth.value = parseFloat(item.value);
      else if (item.code === "height")
        linkedOrder.order.dimensions.height.value = parseFloat(item.value);
    });

    // Process `linked_provider`
    if (linkedProviderTag?.list) {
      linkedProviderTag.list.forEach(
        (item: { code: string; value: string }) => {
          if (item.code === "name")
            linkedProvider.descriptor = { name: item.value };
          else if (item.code === "address") {
            const addressParts = item.value.split(",");
            linkedProvider.address = {
              name: addressParts[0]?.trim(),
              building: addressParts[1]?.trim(),
              locality: addressParts[2]?.trim(),
              city: addressParts[3]?.trim(),
              state: addressParts[4]?.trim(),
              area_code: addressParts[5]?.trim(),
            };
          }
        }
      );
    }

    // Process `linked_order_item`
    linkedOrderItemTags.forEach((tag) => {
      let itemObj: Record<string, any> = {};
      tag.list.forEach((item: { code: string; value: string }) => {
        if (item.code === "category") itemObj.category_id = item.value;
        else if (item.code === "name")
          itemObj.descriptor = { name: item.value };
        else if (item.code === "currency")
          itemObj.price = { currency: item.value };
        else if (item.code === "value") itemObj.price.value = item.value;
        else if (item.code === "quantity")
          itemObj.quantity = { count: parseInt(item.value) };
        else if (item.code === "weight_unit")
          itemObj.quantity = {
            ...itemObj.quantity,
            measure: { unit: item.value },
          };
        else if (item.code === "weight_value")
          itemObj.quantity.measure.value = parseFloat(item.value);
      });
      linkedItems.push(itemObj);
    });

    return {
      ...linkedOrder,
      provider:
        Object.keys(linkedProvider).length > 0 ? linkedProvider : undefined,
      items: linkedItems.length > 0 ? linkedItems : undefined,
    };
  }
}
