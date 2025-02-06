import _, { toUpper } from "lodash";

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
      tags: tags.length > 0 ? tags : undefined, // Now contains separate objects for each settlement detail,
      "@ondc/org/collection_amount":undefined,
    };
  }
}

export const PAYMENT_FIELD_MAPPINGS: Record<string, string> = {
  "@ondc/org/settlement_basis": "settlement_basis",
  "@ondc/org/settlement_window": "settlement_window",
  "@ondc/org/settlement_details.settlement_counterparty":
    "settlement_counterparty",
  "@ondc/org/settlement_details.settlement_type": "settlement_type",
  "@ondc/org/settlement_details.upi_address": "upi_address",
  "@ondc/org/settlement_details.settlement_bank_account_no":
    "settlement_bank_account_no",
  "@ondc/org/settlement_details.settlement_ifsc_code": "settlement_ifsc_code",
};
