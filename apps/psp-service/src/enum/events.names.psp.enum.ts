enum EventsNamesPspEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'PSP',
  download = 'PSP.DOWNLOAD',
  //
  createMany = 'PSP.CREATE.MANY',
  createOne = 'PSP.CREATE.ONE',
  updateMany = 'PSP.UPDATE.MANY',
  updateOne = 'PSP.UPDATE.ONE',
  findAll = 'PSP.FIND.ALL',
  findOneById = 'PSP.FIND.ONE.BY.ID',
  findOneByCode = 'PSP.FIND.ONE.BY.CODE',
  findOneByName = 'PSP.FIND.ONE.BY.NAME',
  deleteMany = 'PSP.DELETE.MANY',
  deleteOneById = 'PSP.DELETE.ONE.BY.ID',

  checkCashierPsps = 'PSP.CHECK.CASHIER',
  checkStatsPsp = 'STATS.PSP.CHECK',
  checkPspStats = 'PSP.CHECK.STATS',
  // -----
  checkStatsForAllPspAccount = 'PSP.ACCOUNT.CHECK.STATS.FOR.ALL',
  checkStatsForOnePspAccount = 'PSP.ACCOUNT.CHECK.STATS.FOR.ONE',
}

export default EventsNamesPspEnum;
