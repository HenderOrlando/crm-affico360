export class DynamicAttributeInfoLeverateDto {
  constructor(data?: DynamicAttributeInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  name: string;
  value: object | number | string;
  shouldOverride: boolean;
  dynamicAttributeType: DynamicAttributeTypeLeverateEnum;
}

export enum DynamicAttributeTypeLeverateEnum {
  STRING = 'String',
  BIT = 'Bit',
  PICK_LIST = 'Picklist',
  DATETIME = 'DateTime',
}
