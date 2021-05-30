/*
 * @Description: BaseTable
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-05-25 22:54:54
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-05-25 22:55:08
 */
/**
 * Table is known as ObjectStore in IndexedDb
 */
 export class BaseTable {
    public static DEFAULT_DB_NAME = 'xx_db'
    db?: IDBDatabase = undefined
    isCreatingTable = false
  
    /**
     * Derived class have to override this method and return a database name!
     */
    public databaseName (): string {
      throw new Error('Derived class have to override \'databaseName\', and set a proper database name!')
    }
  
    /**
     * Derived class have to override this method and return a table name!
     */
    public tableName (): string {
      throw new Error('Derived class have to override \'tableName\', and set a proper table name!')
    }
  
    /**
     * Make sure to open database, and the table is already created before add/put/delete, etc.
     */
    private async checkAndOpenDatabase (): Promise<IDBDatabase> {
      let timeLeft = 2000
      while (this.isCreatingTable && timeLeft > 0) {
        // need to wait until db is opened! because we are not sure if onsuccess is runned already! WTF!
        console.log('Database is openning, need to wait...')
        this.sleep(1000)
        timeLeft -= 1000
      }
      if (!this.db) {
        return new Promise<IDBDatabase>((resolve, reject) => {
          this.openDatabase(this.databaseName(), 2, () => {
            if (this.db && !this.isCreatingTable) {
              resolve(this.db)
            }
            console.log(`successCallback called, this.db: ${!!this.db}, this.isCreatingStore: ${this.isCreatingTable}`)
          }, () => {
            reject(new Error('Failed to open database!'))
          }, () => {
            if (this.db) {
              resolve(this.db)
            }
            console.log(`successCallback called, this.db: ${!!this.db}, this.isCreatingStore: ${this.isCreatingTable}`)
          })
        })
      } else {
        return Promise.resolve(this.db)
      }
    }
  
    /**
     * Opens a database
     */
    openDatabase (database: string, version?: number, successCallback?: any, errorCallback?: any, upgradeneededCallback?: any) {
      if (this.isCreatingTable) {
        return // avoid re-entry
      }
      this.isCreatingTable = true
      const request = window.indexedDB.open(database, version)
      const table = this.tableName()
      const self = this
      request.onsuccess = (event) => {
        self.db = request.result
        console.log(`IndexedDb ${database} is opened.`)
        if (self.db.objectStoreNames.contains(table)) {
          self.isCreatingTable = false
        }
        successCallback && successCallback(event)
      }
  
      request.onerror = (event: Event) => {
        console.error(`Failed to open database. ${event}`)
        self.isCreatingTable = false
        errorCallback && errorCallback(event)
      }
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result
        console.log(`Creating table ${table}.`)
        if (!db.objectStoreNames.contains(table)) {
          db.createObjectStore(table, { keyPath: 'key', autoIncrement: true }) // keyPath: 'ssn', 'key'
        }
        self.isCreatingTable = false
        console.log(`Table ${table} opened`)
        upgradeneededCallback && upgradeneededCallback(event)
      }
    }
  
    /**
     * Adds a record to a table
     */
    add (record: any, successCallback?: any, errorCallback?: any) {
      const table = this.tableName()
      this.checkAndOpenDatabase().then(db => {
        const objectStore = db.transaction([table], 'readwrite').objectStore(table)
        const request = objectStore.add(record)
  
        request.onsuccess = successCallback
        request.onerror = errorCallback
      })
    }
  
    /**
     * Saves a record
     */
    save (record: any, successCallback?: any, errorCallback?: any) {
      const table = this.tableName()
      this.checkAndOpenDatabase().then(db => {
        const objectStore = db.transaction([table], 'readwrite').objectStore(table)
        const request = objectStore.put(record)
  
        request.onsuccess = successCallback
        request.onerror = errorCallback
      })
    }
  
    /**
     * Deletes a record
     */
    delete (key: string, successCallback?: any, errorCallback?: any) {
      const table = this.tableName()
      this.checkAndOpenDatabase().then(db => {
        const objectStore = db.transaction([table], 'readwrite').objectStore(table)
        const request = objectStore.delete(key)
  
        request.onsuccess = successCallback
        request.onerror = errorCallback
      })
    }
  
    /**
     * Updates a record
     */
    update () {
      this.checkAndOpenDatabase().then(db => {
        // TODO
      })
    }
  
    /**
     * Queries records in a table
     */
    query (queryString: string, successCallback?: any, errorCallback?: any) {
      const table = this.tableName()
      this.checkAndOpenDatabase().then(db => {
        const objectStore = db.transaction([table], 'readonly').objectStore(table)
        const cursor = objectStore.openCursor()
        const result: any = []
        cursor.onsuccess = (event: any) => {
          const csr = event.target.result // cursor
          if (csr) {
            console.log(`Name for SSN ${csr.key} 'is' ${csr.value.name}`)
            csr.continue()
            result.push(csr.value)
          } else {
            successCallback && successCallback(result)
          }
        }
  
        cursor.onerror = errorCallback
      })
    }
  
    async sleep (ms: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, ms)
      })
    }
  }