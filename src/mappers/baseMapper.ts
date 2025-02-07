import _ from "lodash";
import { ContextMapper } from "./components/contextMapper";
import { MessageMapper } from "./components/messageMapper";

export class BaseMapper {
  protected mappings: Record<string, string | null> = {};

  protected reverseMappings: Record<string, string | null> = {};
  protected deprecatedFields: string[] = [];

  constructor(
    mappings?: Record<string, string | null>,
    deprecatedFields?: string[]
  ) {
    this.mappings = mappings ?? this.mappings;
    this.reverseMappings = this.invertMappings(this.mappings); // Auto-generate reverse mappings
    this.deprecatedFields = deprecatedFields ?? this.deprecatedFields;
  }

  /**
   * Main function that triggers transformation based on version.
   */
  transform(input: any, version: string): any {
    return this.deepMap(input, version);
  }

  /**
   * Recursively maps the input object based on the version.
   * Calls the correct transformation method for modular mappers.
   */
  protected deepMap(obj: any, version: string, parentKey: string = ""): any {
    if (!_.isObject(obj)) return obj;
    if (_.isArray(obj))
      return obj.map((item) => this.deepMap(item, version, parentKey));

    const result: Record<string, any> = {};
    const mapperLookup: Record<string, any> = {
      context: ContextMapper,
      message: MessageMapper,
    };

    // Determine which mappings to use based on the version
    const mappings = version === "2.0" ? this.mappings : this.reverseMappings;

    for (const [key, value] of Object.entries(obj)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (this.deprecatedFields.includes(currentKey)) continue;

      const mappedPath = mappings[currentKey] ?? currentKey;
      if (mappedPath === null) continue;

      const mapper = mapperLookup[key];

      if (mapper && _.isObject(value)) {
        if (version === "1.2.5") {
          _.set(result, mappedPath, mapper.transform(value)); // Use transform for 1.2.5
        } else {
          _.set(result, mappedPath, mapper.reverseTransform(value)); // Use reverseTransform for 2.0
        }
      } else if (this.isLeafNode(value)) {
        _.set(result, mappedPath, value);
      } else {
        _.merge(result, this.deepMap(value, version, currentKey));
      }
    }

    return result;
  }

  protected isLeafNode(value: any): boolean {
    return !_.isObject(value) || _.isArray(value);
  }

  private invertMappings(
    mappings: Record<string, string | null>
  ): Record<string, string | null> {
    const inverted: Record<string, string | null> = {};
    for (const [key, value] of Object.entries(mappings)) {
      if (value !== null) {
        inverted[value] = key;
      }
    }
    return inverted;
  }
}
