enum EventsNamesCrmEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'CRM',
  download = 'CRM.DOWNLOAD',
  //
  createOne = 'CRM.CREATE.ONE',
  createMany = 'CRM.CREATE.MANY',
  updateOne = 'CRM.UPDATE.ONE',
  updateMany = 'CRM.UPDATE.MANY',
  findAll = 'CATEGORY.CRM.ALL',
  findOneById = 'CRM.FIND.ONE.BY.ID',
  deleteOne = 'CRM.DELETE.ONE',
  deleteMany = 'CRM.DELETE.MANY',
  findOneByName = 'CRM.FIND.ONE.BY.NAME',
  createOneLeadOnCrm = 'CRM.CREATE.ONE.LEAD',
  moveOneLeadOnCrm = 'CRM.MOVE.ONE.LEAD',
  autologinLeadOnCrm = 'CRM.AUTOLOGIN.LEAD',
  createOneTransferOnCrm = 'CRM.CREATE.ONE.TRANSFER',
  checkCrmStats = 'CRM.CHECK.STATS',
  updateOneCrmById = 'CRM.UPDATE.ONE.BY.ID',
  checkCrmLeadStatus = 'CRM.CHECK.LEADS.STATUS',
}

export default EventsNamesCrmEnum;
