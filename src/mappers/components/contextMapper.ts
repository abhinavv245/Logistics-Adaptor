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
  }