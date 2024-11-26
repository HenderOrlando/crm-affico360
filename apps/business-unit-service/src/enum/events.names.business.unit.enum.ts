enum EventsNamesBusinessUnitEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'BUSINESS_UNIT',
  download = 'BUSINESS_UNIT.DOWNLOAD',
  //
  createOne = 'BUSINESS_UNIT.CREATE.ONE',
  createMany = 'BUSINESS_UNIT.CREATE.MANY',
  updateOne = 'BUSINESS_UNIT.UPDATE.ONE.BY.ID',
  updateMany = 'BUSINESS_UNIT.UPDATE.MANY',
  findAll = 'BUSINESS_UNIT.FIND.MANY',
  findOneById = 'BUSINESS_UNIT.FIND.ONE.BY.ID',
  deleteOneById = 'BUSINESS_UNIT.DELETE.ONE',
  deleteMany = 'BUSINESS_UNIT.DELETE.MANY',
  checkCashierBrands = 'BUSINESS_UNIT.CHECK.CASHIER.BRANDS',
  findOneByName = 'BUSINESS_UNIT.FIND.ONE.BY.NAME',
  checkBrandStats = 'BUSINESS_UNIT.CHECK.STATS',
}

export default EventsNamesBusinessUnitEnum;
