export class PickListInfoLeverateDto {
  constructor(data?: PickListInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  name: string;
  value: number;
}
