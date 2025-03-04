export class ContextMapper {
  static transform(contextV1: any): any {
    if (!contextV1 || typeof contextV1 !== "object") return undefined;

    return {
      domain: contextV1.domain || undefined,
      location: contextV1.location
        ? {
            city: { code: contextV1.city || undefined },
            country: { code: contextV1.country || undefined },
          }
        : undefined,
      version: "2.0.0",
      ...contextV1,
      core_version: undefined,
      city: undefined,
      country: undefined,
    };
  }

  static reverseTransform(contextV2: any): any {
    if (!contextV2 || typeof contextV2 !== "object") return undefined;

    return {
      ...contextV2,
      city: contextV2.location?.city?.code || undefined,
      country: contextV2.location?.country?.code || undefined,
      core_version: "1.2.5", // Map version back to core_version
      location: undefined, // Remove location key
      version: undefined, // Remove version key
    };
  }
}
