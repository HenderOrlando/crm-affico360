export interface ResponseDownloadWebsocketInterface<ItemType = any> {
  count: number;
  progress: number;
  item: ItemType;
  filename?: string;
  filenameXlsx?: string;
  fileBase64?: string;
  fileBase64Xlsx?: string;
}
