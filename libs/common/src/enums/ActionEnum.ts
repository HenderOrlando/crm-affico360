enum ActionsEnum {
  // Start session
  LOGIN = 'LOGIN',
  // End session
  LOGOUT = 'LOGOUT',
  // All actions for some resource
  ALL = 'ALL',
  // Manage actions for some resource
  MANAGE = 'MANAGE',
  // Create and Update some resource
  SET = 'SET',
  // View and Search some resource
  READ = 'READ',
  // View some resource
  VIEW = 'VIEW',
  // Search/Filter some resource
  SEARCH = 'SEARCH',
  // Update some resource
  UPDATE = 'UPDATE',
  // Create some resource
  CREATE = 'CREATE',
  // Delete some resource
  DELETE = 'DELETE',
  // Approve some resource
  APPROVE = 'APPROVE',
  // Move some resource
  MOVE = 'MOVE',
  // Download excel, csv or json data of some resource
  DOWNLOAD = 'DOWNLOAD',
  // No Action
  NOACTION = 'NO',
}

export default ActionsEnum;
