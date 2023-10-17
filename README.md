# ease-indexdb 1.0.3

easier use of indexdb

## Installation


```shell
$ npm i ease-indexdb
$ yarn add ease-indexdb
```

## USE

### javascript

```javascript
import { EIndexdb } from "ease-indexdb";

const edb = new EIndexdb({
  name: "abc", // 数据库名称
  version: 1, // 版本号 新增表需要更版本才能是浏览器更新数据库
  initTableName: ["db1", "db2"], // 需要初始化表的名称
  // https://developer.mozilla.org/zh-CN/docs/Web/API/IDBDatabase/createObjectStore
  configs: { keyPath: "id" }, // 表配置 keyPath autoIncrement 详情点上链接查看
});
edb.connect().then(async (e) => {
  const insertData = new Array(50).fill(null).map((v, index) => ({
    id: index,
    time: `${new Date().getTime()}${index}`,
  }));
  const addRes = await edb.addData("db1", insertData);
  console.log("[addRes] ---> ", addRes);

  const removeRes = await edb.deleteData("db1", -1);
  console.log("[removeRes] ---> ", removeRes);

  const updateDataRes = edb.updateData("db1", { id: 3, time: 1234 });
  console.log("[updateDataRes] ---> ", updateDataRes);

  const findDataRes = await edb.findData("db1", 1);
  console.log("[findDataRes] ---> ", findDataRes);

  const allData = await edb.getAllData("db1");
  console.log("[allData] ---> ", allData);

  const clearRes = await edb.clear("db1");
  console.log("[clearRes] ---> ", clearRes);
});
```

### ts
```typescript
import { EIndexdb } from "ease-indexdb";
// 引入类型获取类型提示
import mainType from "ease-indexdb/dist/main.d.ts";
const edb: mainType.EIndexdb = new EIndexdb({
  name: "abc",
  version: 2,
  initTableName: ["db1", "db2"],
  configs: { keyPath: "id" },
});
```

## TYPE


|   方法名   |                            参数                             |               作用               |        返回值        |
| :--------: | :---------------------------------------------------------: | :------------------------------: | :------------------: |
|  connect   |                             无                              | 用于连接数据库 获取 db 实例 异步 | Promise<IDBDatabase> |
|  addData   |            tabelName: 表名, data: 插入数据 数组             |             添加数据             |     Promise<T[]>     |
| deleteData |                 tabelName: 表名, key: 键值                  |             删除数据             |   Promise<boolean>   |
| updateData | tabelName: 表名, data: 需要更新的数据数组 或者 直接数据对象 |             更新数据             |       boolean        |
|  findData  |                 tabelName: 表名, key: 键值                  |           查找某个数据           |   Promise<object>    |
| getAllData |                       tabelName: 表名                       |           获取全部数据           |     Promise<T[]>     |
|   clear    |                       tabelName: 表名                       |         删除该表全部数据         |   Promise<boolean>   |
