import { ProviderMapper } from "./providerMapper";
import { DescriptorMapper } from "./descriptorMapper";

export class CatalogMapper {
  static transform(catalogV1: any): any {
    if (!catalogV1 || typeof catalogV1 !== "object") return catalogV1;

    return {
      ...catalogV1, //Keep all existing properties unchanged
      descriptor: catalogV1["bpp/descriptor"]
        ? DescriptorMapper.transform(catalogV1["bpp/descriptor"])
        : undefined,
      providers: catalogV1["bpp/providers"]
        ? ProviderMapper.transform(catalogV1["bpp/providers"])
        : undefined,
      "bpp/descriptor": undefined, //Remove old key
      "bpp/providers": undefined, // Remove old key
    };
  }
}
