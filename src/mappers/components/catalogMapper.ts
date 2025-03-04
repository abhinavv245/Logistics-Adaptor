import { ProviderMapper } from "./providerMapper";
import { DescriptorMapper } from "./descriptorMapper";
import { TagsMapper } from "./tagsMapper";

export class CatalogMapper {
  static transform(catalogV1: any): any {
    if (!catalogV1 || typeof catalogV1 !== "object") return catalogV1;

    return {
      ...catalogV1, // Keep all existing properties unchanged
      descriptor: catalogV1["bpp/descriptor"]
        ? DescriptorMapper.transform(catalogV1["bpp/descriptor"])
        : undefined,
      providers: catalogV1["bpp/providers"]
        ? ProviderMapper.transform(catalogV1["bpp/providers"])
        : undefined,
      tags: catalogV1.tags ? TagsMapper.transform(catalogV1.tags) : undefined,
      "bpp/descriptor": undefined, // Remove old key
      "bpp/providers": undefined, // Remove old key
    };
  }

  static reverseTransform(catalogV2: any): any {
    if (!catalogV2 || typeof catalogV2 !== "object") return catalogV2;

    return {
      ...catalogV2, // Keep all existing properties unchanged
      "bpp/descriptor": catalogV2.descriptor
        ? DescriptorMapper.reverseTransform(catalogV2.descriptor)
        : undefined,
      "bpp/providers": catalogV2.providers
        ? ProviderMapper.reverseTransform(catalogV2.providers)
        : undefined,
      tags: catalogV2.tags
        ? TagsMapper.reverseTransform(catalogV2.tags)
        : undefined,
      descriptor: undefined, // Remove new key
      providers: undefined, // Remove new key
    };
  }
}
