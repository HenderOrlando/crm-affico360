enum EventsNamesPspAccountEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'PSP.ACCOUNT',
  download = 'PSP.ACCOUNT.DOWNLOAD',
  //
  createMany = 'PSP.ACCOUNT.CREATE.MANY',
  createOne = 'PSP.ACCOUNT.CREATE.ONE',
  updateMany = 'PSP.ACCOUNT.UPDATE.MANY',
  updateOne = 'PSP.ACCOUNT.UPDATE.ONE',
  findAll = 'PSP.ACCOUNT.FIND.ALL',
  findOneById = 'PSP.ACCOUNT.FIND.ONE.BY.ID',
  findOneByCode = 'PSP.ACCOUNT.FIND.ONE.BY.CODE',
  findOneByName = 'PSP.ACCOUNT.FIND.ONE.BY.NAME',
  deleteMany = 'PSP.ACCOUNT.DELETE.MANY',
  deleteOneById = 'PSP.ACCOUNT.DELETE.ONE.BY.ID',

  countPspAccount = 'PSP.ACCOUNT.COUNT',
  checkPspAccountStats = 'PSP.ACCOUNT.CHECK.STATS',
}

export default EventsNamesPspAccountEnum;
