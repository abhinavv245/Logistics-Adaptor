import _, { toUpper, toLower } from "lodash";

export class PaymentMapper {
  static transform(paymentV1: any): any {
    if (!paymentV1 || typeof paymentV1 !== "object") return paymentV1;

    const settlementDetailsArray =
      paymentV1["@ondc/org/settlement_details"] || [];

    // Create separate tag objects for each settlement detail
    const tags = settlementDetailsArray.map((settlementDetails: any) => {
      const tagsList = Object.entries(PAYMENT_FIELD_MAPPINGS)
        .map(([oldKey, newKey]) => {
          const value =
            _.get(paymentV1, oldKey) ||
            _.get(settlementDetails, oldKey.split(".").pop() || "");
          return value
            ? { descriptor: { code: toUpper(newKey) }, value }
            : null;
        })
        .filter(Boolean); // Remove null values

      return {
        descriptor: { code: "SETTLEMENT_TERMS" },
        list: tagsList,
      };
    });

    return {
      type: paymentV1.type,
      collected_by: paymentV1.collected_by,
      tags: tags.length > 0 ? tags : undefined, // Now contains separate objects for each settlement detail
      "@ondc/org/collection_amount": undefined,
    };
  }

  static reverseTransform(paymentV2: any): any {
    if (!paymentV2 || typeof paymentV2 !== "object") return paymentV2;

    const settlementDetailsArray: any[] = [];
    const reversedPayment: any = {
      type: paymentV2.type,
      collected_by: paymentV2.collected_by,
      "@ondc/org/settlement_details": undefined, // Will be populated if tags exist
    };

    if (Array.isArray(paymentV2.tags)) {
      paymentV2.tags.forEach((tag: { descriptor: { code: string; }; list: any[]; }) => {
        if (tag.descriptor.code === "SETTLEMENT_TERMS" && Array.isArray(tag.list)) {
          const settlementDetails: Record<string, any> = {};

          tag.list.forEach((item) => {
            const originalKey = PAYMENT_FIELD_MAPPINGS_REVERSE[toLower(item.descriptor.code)];
            if (originalKey) {
              if (originalKey.startsWith("@ondc/org/settlement_details")) {
                const keyName = originalKey.split(".").pop();
                if (keyName) settlementDetails[keyName] = item.value;
              } else {
                reversedPayment[originalKey] = item.value;
              }
            }
          });

          if (Object.keys(settlementDetails).length > 0) {
            settlementDetailsArray.push(settlementDetails);
          }
        }
      });
    }

    if (settlementDetailsArray.length > 0) {
      reversedPayment["@ondc/org/settlement_details"] = settlementDetailsArray;
    }

    return reversedPayment;
  }
}

export const PAYMENT_FIELD_MAPPINGS: Record<string, string> = {
  "@ondc/org/settlement_basis": "settlement_basis",
  "@ondc/org/settlement_window": "settlement_window",
  "@ondc/org/settlement_details.settlement_counterparty": "settlement_counterparty",
  "@ondc/org/settlement_details.settlement_type": "settlement_type",
  "@ondc/org/settlement_details.upi_address": "upi_address",
  "@ondc/org/settlement_details.settlement_bank_account_no": "settlement_bank_account_no",
  "@ondc/org/settlement_details.settlement_ifsc_code": "settlement_ifsc_code",
};

// Reverse mapping for `reverseTransform()`
export const PAYMENT_FIELD_MAPPINGS_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(PAYMENT_FIELD_MAPPINGS).map(([key, value]) => [value, key])
);