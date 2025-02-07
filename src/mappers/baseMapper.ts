import _ from "lodash";
import { ContextMapper } from "./components/contextMapper";
import { MessageMapper } from "./components/messageMapper";

export class BaseMapper {
  protected mappings: Record<string, string | null> = {};
  protected deprecatedFields: string[] = [];

  constructor(
    mappings?: Record<string, string | null>,
    deprecatedFields?: string[]
  ) {
    this.mappings = mappings ?? {};
    this.deprecatedFields = deprecatedFields ?? [];
  }

  transform(input: any): any {
    return this.deepMap(input);
  }

  /**
   * Recursively maps the input object to the target structure.
   */
  protected deepMap(obj: any, parentKey: string = ""): any {
    if (!_.isObject(obj)) return obj; // Base case, return the value if not an object

    // Handle arrays correctly
    if (_.isArray(obj)) {
      return obj.map((item) => this.deepMap(item, parentKey));
    }

    const result: Record<string, any> = {};

    // Define a lookup for modular mappers outside the loop for better performance
    const mapperLookup: Record<string, any> = {
      context: ContextMapper,
      message: MessageMapper,
    };

    for (const [key, value] of Object.entries(obj)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      // Skip deprecated fields
      if (this.deprecatedFields.includes(currentKey)) continue;

      // Map current key based on mappings, defaulting to the key if not found
      const mappedPath = this.mappings[currentKey] ?? currentKey;
      if (mappedPath === null) continue;

      // Check if we need to apply a modular mapper
      const mapper = mapperLookup[key];
      if (mapper && _.isObject(value)) {
        _.set(result, mappedPath, mapper.transform(value));
      } else if (this.isLeafNode(value)) {
        _.set(result, mappedPath, value);
      } else {
        // Recursively map nested values
        _.merge(result, this.deepMap(value, currentKey));
      }
    }

    return result;
  }

  protected isLeafNode(value: any): boolean {
    return !_.isObject(value) || _.isArray(value);
  }
}
