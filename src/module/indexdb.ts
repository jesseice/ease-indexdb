/** 连接 */
export const connectDb = async (params: {
  name: string;
  version?: number;
  initTableName: string[];
  options: any;
}): Promise<any> => {
  try {
    const { name, version, initTableName, options } = params;
    const dbInstance = await new Promise((resolve) => {
      const e = window.indexedDB.open(name, version);
      e.onsuccess = (e: any) => resolve(e.target.result);
      e.onerror = () => resolve(null);
      e.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        for (let index = 0; index < initTableName.length; index++) {
          const key = initTableName[index];
          db.createObjectStore(key, options);
        }
      };
    });
    return dbInstance || null;
  } catch (error: any) {
    console.log("[connectDb error] ---> ", error.message);
    return null;
  }
};

/** 插入 */
export const insertData = async (db: any, tableName: string, data: any[]) => {
  return new Promise((resolve) => {
    const dbHandle = db
      .transaction(tableName, "readwrite")
      .objectStore(tableName);
    console.log("[dbHandle] ---> ", dbHandle);
    console.log("[data] ---> ", data);
    for (let index = 0; index < data.length; index++) {
      dbHandle.add(data[index]);
    }
    resolve(1);
  });
};
