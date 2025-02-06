import _ from "lodash";
import { ContextMapper } from "./components/contextMapper";
import { CatalogMapper } from "./components/catalogMapper";
import { OrderMapper } from "./components/orderMapper";
import { IntentMapper } from "./components/intentMapper";

export class BaseMapper {
  protected mappings: Record<string, string | null> = {};
  protected deprecatedFields: string[] = [];

  constructor(
    mappings?: Record<string, string | null>,
    deprecatedFields?: string[]
  ) {
    if (mappings) {
      this.mappings = mappings;
    }
    if (deprecatedFields) {
      this.deprecatedFields = deprecatedFields;
    }
  }

  transform(input: any): any {
    return this.deepMap(input, "");
  }

  /**
   * Recursively maps the input object to the target structure.
   */
  protected deepMap(obj: any, parentKey: string = ""): any {
    if (!_.isObject(obj)) return obj;

    // Handle arrays correctly
    if (_.isArray(obj)) {
      return obj.map((item) => this.deepMap(item, parentKey));
    }

    let result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      if (this.deprecatedFields.includes(currentKey)) continue;

      let mappedPath = this.mappings[currentKey] || currentKey;
      if (mappedPath === null) continue;

      // Define a lookup for modular mappers
      const mapperLookup: Record<string, any> = {
        context: ContextMapper,
        intent: IntentMapper,
        catalog: CatalogMapper,
        order: OrderMapper,
      };

      if (mapperLookup[key] && _.isObject(value)) {
        _.set(result, mappedPath, mapperLookup[key].transform(value));
      } else if (this.isLeafNode(value)) {
        _.set(result, mappedPath, value);
      } else {
        const transformedValue = this.deepMap(value, currentKey);
        result = _.merge(result, transformedValue);
      }
    }

    return result;
  }

  protected isLeafNode(value: any): boolean {
    return !_.isObject(value) || _.isArray(value);
  }
}
