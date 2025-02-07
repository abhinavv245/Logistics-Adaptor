# Project Structure, Design, and Working Document

## Project Structure

```
                   |
                   |  (Incoming Request)
                   v
          +------------------+
          | transformController |
          +------------------+
                   |
                   |  (Process Data)
                   v
          +------------------+
          |   BaseMapper     |
          +------------------+
                   |
                   |  (Transform Data)
                   +------------------+
                   |        |        |
                   v        v        v
          +----------------+ +----------------+ +----------------+ +----------------+
          |  Context Mapper | | Intent Mapper  | | Order Mapper   | | Catalog Mapper |
          +----------------+ +----------------+ +----------------+ +----------------+
                   |
                   |  (Return Transformed Data)
                   v
          +------------------+
          | transformController |
          +------------------+
                   |
                   |  (Send Response)
                   v
```

## Data Flow
- **Incoming Request**: Requests are received by the server.
- **Route to Controller**: The request is routed to the appropriate controller.
- **Process Data**: The controller processes the data using the `BaseMapper`.
- **Transform Data**: The `BaseMapper` utilizes specialized mappers to transform the data.
- **Return Transformed Data**: The transformed data is sent back to the controller.
- **Send Response**: The controller sends the final response back to the client.

---

## Mappers

### **Overview**
The `BaseMapper` class is a class designed to transform input data based on predefined mappings. It provides a flexible way to restructure objects, handling nested structures, deprecated fields, and modular transformations through specialized mapper classes.

This class integrates multiple mappers like `BillingMapper`, `PaymentMapper`, `FulfillmentMapper`, etc., to ensure data transformation across various components.

### **Purpose**
The main objectives of `BaseMapper` are:
- **Map and restructure input data** based on predefined mappings.
- **Remove deprecated fields** from the input.
- **Support nested object transformations** through specialized mappers.
- **Recursively traverse and transform objects and arrays**, ensuring correct restructuring.

### **Key Functionalities**
#### 1. **Transforming Input Data**
The `transform(input: any): any` method:
- Takes an input object.
- Calls `deepMap()` to process and restructure it based on predefined mappings.

#### 2. **Recursive Mapping (`deepMap`)**
The `deepMap(obj: any, parentKey: string = "")` method:
- **Recursively traverses objects and arrays** to apply transformations.
- **Handles nested structures**, ensuring sub-objects are properly transformed.
- **Maps object keys to their corresponding target structure** based on the `mappings` property.
- **Removes deprecated fields**, ensuring they don’t appear in the output.
- **Uses specialized mappers** (`ContextMapper`, `BillingMapper`, etc.) when encountering specific sections of the input.

#### 3. **Handling Specialized Mappers**
The class maintains a lookup object (`mapperLookup`) that associates keys with specific mappers:
```typescript
const mapperLookup: Record<string, any> = {
  context: ContextMapper,
  message: MessageMapper,
};
```
If an input field matches a key in `mapperLookup`, the corresponding mapper is used to transform the data.

#### 4. **Leaf Node Detection (`isLeafNode`)**
The function `isLeafNode(value: any): boolean` determines if a given value is a leaf node:
- A **leaf node** is a value that is **not an object** or is an **array**.
- If the value is a leaf node, it is directly set in the transformed object.
- Otherwise, it undergoes further processing via `deepMap`.

### **How It Works**
1. **The `transform(input)` method is called**, initiating recursive transformation via `deepMap()`.
2. **`deepMap()` iterates through each key-value pair**, checking if:
   - The key exists in `mappings`.
   - The key is in `deprecatedFields` (if yes, it is skipped).
   - The key corresponds to a specialized mapper (if yes, it is processed using that mapper).
   - The value is a **leaf node** (if yes, it is directly assigned).
   - Otherwise, it **recursively transforms** the nested object.
3. The final transformed object is returned.

---

## **Reverse Transformation**

The system supports reverse transformation, where transformed data is reverted to its original structure. This is useful when sending data to systems expecting the original format.

### **Reverse Mapping Functionality**
#### **1. Reverse Transform Method**
The `reverseTransform(output: any): any` method:
- Takes a transformed object.
- Calls `reverseMap()` to reconstruct the original data format.

#### **2. Recursive Reverse Mapping (`reverseMap`)**
The `reverseMap(obj: any, parentKey: string = "")` method:
- **Recursively processes objects and arrays** to reverse transformations.
- **Maps object keys to their original format** based on `reverseMappings`.
- **Reintroduces fields** that were previously transformed.
- **Applies specialized mappers** when reversing specific sections of the data.

#### **3. Reverse Mapper Lookup**
A `reverseMapperLookup` object is used for handling specific mappers in reverse transformation:
```typescript
const reverseMapperLookup: Record<string, any> = {
  context: ReverseContextMapper,
  message: ReverseMessageMapper,
};
```

### **Example Reverse Transformation**
#### **Transformed Object (Input to Reverse Transformation)**
```json
{
 "context": {
        "domain": "nic2004:60232",
        "location": {
            "city": {
                "code": "std:080"
            },
            "country": {
                "code": "IND"
            }
        },
        "version": "2.0.0",
        "action": "on_search",
        "bap_id": "lbnp.com",
        "bap_uri": "https://lbnp.com/ondc",
        "bpp_id": "lsp.com",
        "bpp_uri": "https://lsp.com/ondc",
        "transaction_id": "T1",
        "message_id": "M1",
        "timestamp": "2024-11-20T21:00:30.000Z"
    }
}
```

#### **Reverse Transformed Output (Restored to Original Format)**
```json
{
  "context": {
    "domain": "nic2004:60232",
    "country": "IND",
    "city": "std:080",
    "action": "on_search",
    "core_version": "1.2.5",
    "bap_id": "lbnp.com",
    "bap_uri": "https://lbnp.com/ondc",
    "bpp_id": "lsp.com",
    "bpp_uri": "https://lsp.com/ondc",
    "transaction_id": "T1",
    "message_id": "M1",
    "timestamp": "2024-11-20T21:00:30.000Z"
  }
}
```

---


