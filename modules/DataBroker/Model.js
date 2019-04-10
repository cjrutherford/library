const Keyv = require("keyv");
const uuid = require("uuid");

class Model {
  modelCache;
  constructor({ name, storeURI }) {
    modelCache = new Keyv(storeURI, {
      namespace: name,
    });
    modelCache.on("error", (err) => console.error(err));
  }

  initIdList = async () => {
    await modelCache.set("idList", []);
  };

  getIdList = async () => {
    const list = await modelCache.get("idList");
    if (list === undefined) {
      initIdList();
      return await modelCache.get("idList");
    } else {
      return list;
    }
  };

  addToIdList = async (id) => {
    const list = await getIdList();
    if (list.indexOf(id) >= 0) {
      await modelCache.set("idList", [...list, id]);
    }
    return;
  };

  getById = async (id) => {
    return await modelCache.get(id);
  };

  where = async (fnfilter) => {
    const idList = await getIdList();
    const ServerList = idList
      .forEach(async (id) => {
        return await getById(id);
      })
      .filter(fnFilter);
    return ServerList;
  };

  insert = async (s) => {
    s.id = s.id === undefined ? uuid.v4() : s.id;
    await modelCache.set(s.id, s);
    await addToIdList(s.id);
    return s;
  };

  destroy = async (id) => {
    const list = await getIdList();
    await modelCache.set("idList", list.filter((x) => x !== id));
    await modelCache.delete(id);
  };
}

module.exports = Model;
