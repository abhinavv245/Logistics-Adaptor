import { DescriptorMapper } from "./descriptorMapper";
import { FulfillmentMapper } from "./fulfillmentMapper";
import { ItemMapper } from "./itemsMapper";
import { TagsMapper } from "./tagsMapper";

export class ProviderMapper {
  static transform(providersV1: any[]): any[] {
    if (!Array.isArray(providersV1)) return [];

    return providersV1.map((provider) => ({
      ...provider, // Keep other provider properties unchanged
      descriptor: provider.descriptor
        ? DescriptorMapper.transform(provider.descriptor)
        : undefined,
      items: provider.items ? ItemMapper.transform(provider.items) : undefined,
      fulfillments: provider.fulfillments
        ? FulfillmentMapper.transformArray(provider.fulfillments)
        : undefined,
      tags: provider.tags ? TagsMapper.transform(provider.tags) : undefined,
    }));
  }

  static reverseTransform(providersV2: any[]): any[] {
    if (!Array.isArray(providersV2)) return [];

    return providersV2.map((provider) => ({
      ...provider, // Keep other provider properties unchanged
      descriptor: provider.descriptor
        ? DescriptorMapper.reverseTransform(provider.descriptor)
        : undefined,
      items: provider.items ? ItemMapper.reverseTransform(provider.items) : undefined,
      fulfillments: provider.fulfillments
        ? FulfillmentMapper.reverseTransformArray(provider.fulfillments)
        : undefined,
      tags: provider.tags ? TagsMapper.reverseTransform(provider.tags) : undefined,
    }));
  }
}