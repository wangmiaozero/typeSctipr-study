/*
 * @Description: BimTreeTable
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-05-25 22:56:42
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-05-25 22:56:50
 */
import { BaseTable } from './BaseTable'

/**
 * Table is known as ObjectStore in IndexedDb
 * BimTreeTable in IndexedDb
 */
export class BimTreeTable extends BaseTable {
  public databaseName () {
    return BaseTable.DEFAULT_DB_NAME
  }

  public tableName () {
    return 'bim_tree'
  }

  private static _instance: BimTreeTable | undefined = undefined
  public static instance (): BimTreeTable {
    if (!BimTreeTable._instance) {
      BimTreeTable._instance = new BimTreeTable()
    }
    return BimTreeTable._instance
  }
}