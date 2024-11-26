enum EventsNamesStatusEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'STATUS',
  download = 'STATUS.DOWNLOAD',
  //
  createMany = 'STATUS.CREATE.MANY',
  createOne = 'STATUS.CREATE.ONE',
  updateMany = 'STATUS.UPDATE.MANY',
  updateOne = 'STATUS.UPDATE.ONE',
  findAll = 'STATUS.FIND.ALL',
  findOneById = 'STATUS.FIND.ONE.BY.ID',
  deleteMany = 'STATUS.DELETE.MANY',
  deleteOneById = 'STATUS.DELETE.ONE.BY.ID',

  checkCashierStatus = 'STATUS.CHECK.CASHIER.STATUS',
  findOneByName = 'STATUS.FIND.ONE.BY.NAME',
  findOneByDescription = 'STATUS.FIND.ONE.BY.DESCRIPTION',
}

export default EventsNamesStatusEnum;
