enum EventsNamesMessageEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'MESSAGE',
  download = 'MESSAGE.DOWNLOAD',
  //
  createMany = 'MESSAGE.CREATE.MANY',
  createOne = 'MESSAGE.CREATE.ONE',
  updateMany = 'MESSAGE.UPDATE.MANY',
  updateOne = 'MESSAGE.UPDATE.ONE',
  findAll = 'MESSAGE.FIND.ALL',
  findOneById = 'MESSAGE.FIND.ONE.BY.ID',
  deleteMany = 'MESSAGE.DELETE.MANY',
  deleteOneById = 'MESSAGE.DELETE.ONE.BY.ID',

  sendEmail = 'MESSAGE.SEND.EMAIL',
}

export default EventsNamesMessageEnum;
