export class ContextMapper {
  static transform(contextV1: any): any {
    if (!contextV1 || typeof contextV1 !== "object") return contextV1;

    return {
      domain: contextV1.domain,
      location: {
        city: { code: contextV1.city },
        country: { code: contextV1.country }
      },
      version: "2.0.0",
      ...contextV1,
      core_version: undefined,
      city: undefined,
      country: undefined
    };
  }

  static reverseTransform(contextV2: any): any {
    if (!contextV2 || typeof contextV2 !== "object") return contextV2;

    return {
      ...contextV2,
      city: contextV2.location?.city?.code,
      country: contextV2.location?.country?.code,
      core_version: '1.2.5', // Map version back to core_version
      location: undefined, // Remove location key
      version: undefined, // Remove version key
    };
  }
}