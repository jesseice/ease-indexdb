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
          try {
            db.createObjectStore(key, options);
          } catch (error) {
            continue;
          }
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
 * 删除数据
 * @param db 数据库实例
 * @param tableName 表名
 * @param deleteKeys 删除的主键
 * @param returnType 返回类型 keyToBoolean  返回{[key]: false|true} 默认返回false|true
 * @returns {Promise<boolean[] | Record<string, boolean>[]>}
 */
export const deleteDataFn = async (
  db: any,
  tableName: string,
  deleteKeys: string[] | string,
  returnType: "keyToBoolean" | "default"
): Promise<boolean[] | Record<string, boolean>[] | boolean> => {
  const dbHandle = db
    .transaction(tableName, "readwrite")
    .objectStore(tableName);
  const res: any = [];
  if (!Array.isArray(deleteKeys)) {
    dbHandle.delete(deleteKeys);
    return true;
  }
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

/**
 * 修改数据库数据
 * @param db 数据库实例
 * @param tableName 表名
 * @param data 修改的数据 可以数组 或者直接修改后的对象
 * @returns
 */
export const modifyData = (db: any, tableName: string, data: any[] | any) => {
  const objectStore = db
    .transaction([tableName], "readwrite")
    .objectStore(tableName);
  try {
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {
        try {
          objectStore.put(data[index]);
        } catch (error) {
          continue;
        }
      }
    } else {
      objectStore.put(data);
      return true;
    }
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
};

/**
 *
 * @param db 数据库实例
 * @param tableName 表名
 * @param condition 查询条件
 * @returns
 */
export const findDataFn = async (db: any, tableName: string, key: string) => {
  const res = await new Promise((resolve) => {
    try {
      const temp = db.transaction([tableName]).objectStore(tableName).get(key);
      temp.onsuccess = (e: any) => {
        resolve(e.target.result);
      };
      temp.onerror = () => {
        resolve(null);
      };
    } catch (error: any) {
      console.error("error.message", error.message);
      resolve(null);
    }
  });
  return res;
};

export const getAllDataFn = (db: any, tableName: string) => {
  return new Promise((resolve) => {
    try {
      const temp = db.transaction([tableName]).objectStore(tableName).getAll();
      temp.onsuccess = (e: any) => resolve(e.target.result);
      temp.onerror = () => resolve(null);
    } catch (error: any) {
      console.error("error.message", error.message);
      resolve(null);
    }
  });
};

/** 清除表数据 */
export const clearAllData = (db: any, tableName: string) => {
  return new Promise((resolve) => {
    try {
      const temp = db
        .transaction([tableName], "readwrite")
        .objectStore(tableName)
        .clear();
      temp.onsuccess = () => resolve(true);
      temp.onerror = () => resolve(false);
    } catch (error: any) {
      console.error("error.message", error.message);
      resolve(false);
    }
  });
};
