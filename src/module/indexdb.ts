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
  const dbHandle = db
    .transaction(tableName, "readwrite")
    .objectStore(tableName);
  const res: any = [];
  let isStop = false;
  for (let index = 0; index < data.length; index++) {
    if (isStop) break;
    const addRes = await new Promise((resolve) => {
      const res1 = dbHandle.add(data[index]);
      res1.onsuccess = (e: any) => resolve(e.target.result);
      res1.onerror = (e: any) => {
        resolve(e.target.error);
        isStop = true;
      };
    });
    res.push(addRes);
  }
  return res;
};

/**
 *
 * @param db 数据库实例
 * @param tableName 表名
 * @param deleteKeys 删除的主键
 * @param returnType 返回类型 keyToBoolean  返回{[key]: false|true} 默认返回false|true
 * @returns {Promise<boolean[] | Record<string, boolean>[]>}
 */
export const removeData = async (
  db: any,
  tableName: string,
  deleteKeys: string[],
  returnType: "keyToBoolean" | "default"
): Promise<boolean[] | Record<string, boolean>[]> => {
  const dbHandle = db
    .transaction(tableName, "readwrite")
    .objectStore(tableName);
  const res: any = [];
  let isStop = false;
  for (let index = 0; index < deleteKeys.length; index++) {
    const key = deleteKeys[index];
    if (isStop) break;
    const addRes = await new Promise((resolve) => {
      const res1 = dbHandle.delete(key);
      res1.onsuccess = () =>
        resolve(returnType === "keyToBoolean" ? { [key]: true } : true);
      res1.onerror = () => {
        resolve(returnType === "keyToBoolean" ? { [key]: false } : false);
        isStop = true;
      };
    });
    res.push(addRes);
  }
  return res;
};
