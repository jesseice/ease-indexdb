import { connectDb, insertData, removeData } from "./indexdb";

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
  async addData(tableName: string, data: any[]) {
    return await insertData(this.dbInstance, tableName, data);
  }
  async deleteData(
    tableName: string,
    keys: any[],
    returnType: "keyToBoolean" | "default" = "default"
  ) {
    return await removeData(this.dbInstance, tableName, keys, returnType);
  }
}