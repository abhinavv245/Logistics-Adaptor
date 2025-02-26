import { toUpper, toLower } from "lodash";

export class TagsMapper {
  static transform(tagsV1: any[]): any[] {
    return Array.isArray(tagsV1)
      ? tagsV1.map(tag => ({
          descriptor: { code: toUpper(tag.code) },
          list: Array.isArray(tag.list)
            ? tag.list.map((item: { code: any; value: any }) => ({
                descriptor: { code: toUpper(item.code) },
                value: item.value
              }))
            : []
        }))
      : [];
  }

  static reverseTransform(tagsV2: any[]): any[] {
    return Array.isArray(tagsV2)
      ? tagsV2.map(tag => ({
          code: toLower(tag.descriptor.code),
          list: Array.isArray(tag.list)
            ? tag.list.map((item: { descriptor: any; value: any }) => ({
                code: toLower(item.descriptor.code),
                value: item.value
              }))
            : []
        }))
      : [];
  }
}