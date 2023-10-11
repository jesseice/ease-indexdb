import {
  connectDb,
  insertData,
  deleteDataFn,
  modifyData,
  findDataFn,
  getAllDataFn,
  clearAllData,
} from "./indexdb";

export class EIndexdb {
  options;
  dbInstance: any;
  constructor(options: {
    name: string;
    version: number;
    initTableName: string[];
    configs: any;
  }) {
    const { name, version, initTableName, configs } = options;
    this.options = { name, version, initTableName, options: configs };
  }
  async connect() {
    this.dbInstance = await connectDb(this.options);
    return this.dbInstance;
  }
  addData(tableName: string, data: any[]) {
    return insertData(this.dbInstance, tableName, data);
  }
  async deleteData(
    tableName: string,
    keys: any[],
    returnType: "keyToBoolean" | "default" = "default"
  ) {
    return await deleteDataFn(this.dbInstance, tableName, keys, returnType);
  }

  updateData(tableName: string, data: any[] | any) {
    return modifyData(this.dbInstance, tableName, data);
  }
  findData(tableName: string, key: string) {
    return findDataFn(this.dbInstance, tableName, key);
  }
  getAllData(tableName: string) {
    return getAllDataFn(this.dbInstance, tableName);
  }
  clear(tableName: string) {
    return clearAllData(this.dbInstance, tableName);
  }
}
