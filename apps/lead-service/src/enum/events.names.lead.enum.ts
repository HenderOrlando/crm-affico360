enum EventsNamesLeadEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'LEAD',
  download = 'LEAD.DOWNLOAD',
  downloadDatabase = 'LEAD.DOWNLOAD.DATABASE',
  downloadData = 'LEAD.DOWNLOAD.DATA',
  downloadCftd = 'LEAD.DOWNLOAD.CFTD',
  downloadFtd = 'LEAD.DOWNLOAD.FTD',
  downloadRetention = 'LEAD.DOWNLOAD.RETENTION',
  //
  createMany = 'LEAD.CREATE.MANY',
  createOne = 'LEAD.CREATE.ONE',
  updateMany = 'LEAD.UPDATE.MANY',
  updateOne = 'LEAD.UPDATE.ONE',
  updateOneByTpId = 'LEAD.UPDATE.ONE.BY.TP.ID',
  findAll = 'FILE.LEAD.ALL',
  findOneById = 'LEAD.FIND.ONE.BY.ID',
  deleteMany = 'LEAD.DELETE.MANY',
  deleteOneById = 'LEAD.DELETE.ONE.BY.ID',

  findOneByTpId = 'LEAD.FIND.ONE.BY.TP.ID',
  getAffiliatesFromLeads = 'LEAD.FIND.AFFILIATES',
  addLeadFromAffiliate = 'LEAD.CREATE.FROM.AFFILIATE',
  checkLeadsCreatedInCrm = 'LEAD.CHECK.CREATED.IN.CRM',
  checkLeadsForAffiliateStats = 'LEAD.CHECK.FOR.AFFILIATE.STATS',
  checkLeadsForBrandStats = 'LEAD.CHECK.FOR.BRAND.STATS',
  checkLeadsForCrmStats = 'LEAD.CHECK.FOR.CRM.STATS',
  checkLeadsStatusInCrm = 'LEAD.CHECK.STATUS.IN.CRM',
  //
  checkStatsDateAll = 'LEAD.CHECK.STATS.DATE.ALL',
}

export default EventsNamesLeadEnum;
