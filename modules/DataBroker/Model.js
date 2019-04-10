const Keyv = require("keyv");
const uuid = require("uuid");

class Model {
  constructor({ name, storeURI, schema }) {
    this.modelCache = new Keyv(storeURI, {
      namespace: name,
    });
    this.modelSchema = schema;
    this.modelCache.on("error", (err) => console.error(err));
  }

  async initIdList() {
    await this.modelCache.set("idList", []);
  };

  async validate (model) {
    const res = await this.modelSchema.validate(model);
    return res;
  };

  async getIdList() {
    const list = await this.modelCache.get("idList");
    if (list === undefined) {
      initIdList();
      return await this.modelCache.get("idList");
    } else {
      return list;
    }
  };

  async addToIdList (id) {
    const list = await getIdList();
    if (list.indexOf(id) >= 0) {
      await this.modelCache.set("idList", [...list, id]);
    }
    return;
  };

  async getById(id) {
    return await this.modelCache.get(id);
  };

  async where = async (fnfilter) => {
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
    await this.modelCache.set(s.id, s);
    await addToIdList(s.id);
    return s;
  };

  destroy = async (id) => {
    const list = await getIdList();
    await this.modelCache.set("idList", list.filter((x) => x !== id));
    await this.modelCache.delete(id);
  };
}

module.exports = Model;
