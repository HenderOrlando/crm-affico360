enum EventsNamesAffiliateEnum {
  // Websocket
  websocketPort = '3100',
  clientName = 'AFFILIATE',
  download = 'AFFILIATE.DOWNLOAD',
  //
  createMany = 'AFFILIATE.CREATE.MANY',
  createOne = 'AFFILIATE.CREATE.ONE',
  updateMany = 'AFFILIATE.UPDATE.MANY',
  updateOne = 'AFFILIATE.UPDATE.ONE',
  findAll = 'AFFILIATE.FIND.ALL',
  findOneById = 'AFFILIATE.FIND.ONE.BY.ID',
  deleteMany = 'AFFILIATE.DELETE.MANY',
  deleteOneById = 'AFFILIATE.DELETE.ONE.BY.ID',
  findOneByPublicKey = 'AFFILIATE.FIND.ONE.BY.PUBLIC.KEY',
  checkStats = 'AFFILIATE.CHECK.STATS',
  checkStatsOneAffiliate = 'AFFILIATE.CHECK.STATS.ONE.AFFILIATE',
  checkAffiliateLeadsStats = 'AFFILIATE.CHECK.AFFILIATE.LEADS.STATS',
  checkAffiliateStats = 'AFFILIATE.CHECK.AFFILIATE.STATS',
  checkTransferStats = 'AFFILIATE.CHECK.TRANSFER.STATS',
}

export default EventsNamesAffiliateEnum;
