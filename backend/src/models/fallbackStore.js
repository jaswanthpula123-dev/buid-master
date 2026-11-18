const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../../data/store.json');

// Ensure data directory exists
const dataDir = path.dirname(STORE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let memoryData = {
  users: [],
  projects: [],
  properties: [],
  enquiries: [],
  wishlists: [],
};

// Load saved data if present
try {
  if (fs.existsSync(STORE_PATH)) {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    if (raw.trim()) {
      memoryData = JSON.parse(raw);
    }
  }
} catch (e) {
  console.error('Error loading fallback store:', e.message);
}

const persist = () => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryData, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback store:', e.message);
  }
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

// Simple match helper
const matchQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    const val = query[key];
    if (key === '$or' && Array.isArray(val)) {
      const orMatched = val.some(subQuery => matchQuery(item, subQuery));
      if (!orMatched) return false;
      continue;
    }
    if (val && typeof val === 'object') {
      if ('$regex' in val) {
        const regex = new RegExp(val.$regex, val.$options || 'i');
        const itemVal = item[key] || '';
        if (!regex.test(String(itemVal))) return false;
        continue;
      }
      if ('$in' in val && Array.isArray(val.$in)) {
        if (!val.$in.includes(item[key])) return false;
        continue;
      }
      if ('$gte' in val && item[key] < val.$gte) return false;
      if ('$lte' in val && item[key] > val.$lte) return false;
      if ('$gt' in val && item[key] <= val.$gt) return false;
      if ('$lt' in val && item[key] >= val.$lt) return false;
      if ('$ne' in val && item[key] === val.$ne) return false;
      continue;
    }
    if (String(item[key]) !== String(val)) {
      return false;
    }
  }
  return true;
};

class FallbackQuery {
  constructor(items, collectionName) {
    this.items = [...items];
    this.collectionName = collectionName;
  }

  sort(sortOptions) {
    if (sortOptions) {
      let key = '';
      let dir = 1;

      if (typeof sortOptions === 'string') {
        const trimmed = sortOptions.trim().split(/\s+/)[0];
        if (trimmed.startsWith('-')) {
          key = trimmed.substring(1);
          dir = -1;
        } else {
          key = trimmed;
          dir = 1;
        }
      } else if (typeof sortOptions === 'object') {
        const keys = Object.keys(sortOptions);
        if (keys.length > 0) {
          key = keys[0];
          dir = sortOptions[key] === -1 || sortOptions[key] === 'desc' ? -1 : 1;
        }
      }

      if (key) {
        this.items.sort((a, b) => {
          const aVal = a[key] ?? '';
          const bVal = b[key] ?? '';
          if (aVal < bVal) return -1 * dir;
          if (aVal > bVal) return 1 * dir;
          return 0;
        });
      }
    }
    return this;
  }

  skip(n) {
    if (typeof n === 'number') {
      this.items = this.items.slice(n);
    }
    return this;
  }

  limit(n) {
    if (typeof n === 'number') {
      this.items = this.items.slice(0, n);
    }
    return this;
  }

  populate(field) {
    this.items = this.items.map(item => {
      const copy = { ...item };
      if (field === 'property' || field === 'propertyId') {
        const targetId = copy.property || copy.propertyId;
        if (targetId) {
          const propIdStr = typeof targetId === 'object' ? targetId._id : targetId;
          const found = memoryData.properties.find(p => String(p._id) === String(propIdStr));
          if (found) copy[field] = found;
        }
      }
      if (field === 'project' || field === 'projectId') {
        const targetId = copy.project || copy.projectId;
        if (targetId) {
          const projIdStr = typeof targetId === 'object' ? targetId._id : targetId;
          const found = memoryData.projects.find(p => String(p._id) === String(projIdStr));
          if (found) copy[field] = found;
        }
      }
      if (field === 'user' || field === 'customerId') {
        const targetId = copy.user || copy.customerId;
        if (targetId) {
          const uIdStr = typeof targetId === 'object' ? targetId._id : targetId;
          const found = memoryData.users.find(u => String(u._id) === String(uIdStr));
          if (found) {
            const { password, ...safeUser } = found;
            copy[field] = safeUser;
          }
        }
      }
      return copy;
    });
    return this;
  }

  select() {
    return this;
  }

  async exec() {
    return this.items;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }

  finally(callback) {
    return this.exec().finally(callback);
  }
}

class FallbackModel {
  constructor(name) {
    this.name = name;
    if (!memoryData[name]) {
      memoryData[name] = [];
    }
  }

  get collection() {
    return memoryData[this.name] || [];
  }

  find(query = {}) {
    const matched = this.collection.filter(item => matchQuery(item, query));
    return new FallbackQuery(matched, this.name);
  }

  findOne(query = {}) {
    const matched = this.collection.find(item => matchQuery(item, query));
    const doc = matched
      ? {
          ...matched,
          save: async function () {
            persist();
            return this;
          },
        }
      : null;

    return {
      item: doc,
      populate: function (field) {
        if (!this.item) return this;
        // Basic populate
        if (field === 'property' || field === 'propertyId') {
          const targetId = this.item.property || this.item.propertyId;
          if (targetId) {
            const propIdStr = typeof targetId === 'object' ? targetId._id : targetId;
            const found = memoryData.properties.find(p => String(p._id) === String(propIdStr));
            if (found) this.item[field] = found;
          }
        }
        return this;
      },
      select: function () {
        return this;
      },
      exec: async function () {
        return this.item;
      },
      then: function (resolve, reject) {
        return Promise.resolve(this.item).then(resolve, reject);
      },
      catch: function (reject) {
        return Promise.resolve(this.item).catch(reject);
      },
      finally: function (callback) {
        return Promise.resolve(this.item).finally(callback);
      },
    };
  }

  findById(id) {
    return this.findOne({ _id: String(id) });
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.collection.findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;

    const current = this.collection[index];
    const updatePayload = update.$set ? { ...update.$set } : { ...update };
    delete updatePayload.$set;

    const updated = {
      ...current,
      ...updatePayload,
      updatedAt: new Date().toISOString(),
    };

    this.collection[index] = updated;
    persist();
    return updated;
  }

  async findByIdAndDelete(id) {
    const index = this.collection.findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;
    const [deleted] = this.collection.splice(index, 1);
    persist();
    return deleted;
  }

  async deleteOne(query = {}) {
    const index = this.collection.findIndex(item => matchQuery(item, query));
    if (index !== -1) {
      this.collection.splice(index, 1);
      persist();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    const initialCount = this.collection.length;
    memoryData[this.name] = this.collection.filter(item => !matchQuery(item, query));
    const deletedCount = initialCount - memoryData[this.name].length;
    persist();
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    if (!query || Object.keys(query).length === 0) {
      return this.collection.length;
    }
    return this.collection.filter(item => matchQuery(item, query)).length;
  }

  async create(data) {
    if (Array.isArray(data)) {
      const createdItems = data.map(d => ({
        _id: d._id || generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...d,
      }));
      this.collection.push(...createdItems);
      persist();
      return createdItems;
    }

    const doc = {
      _id: data._id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    this.collection.push(doc);
    persist();
    return {
      ...doc,
      save: async function () {
        persist();
        return this;
      },
    };
  }

  async distinct(field) {
    const set = new Set();
    for (const item of this.collection) {
      if (item[field] !== undefined) {
        set.add(item[field]);
      }
    }
    return Array.from(set);
  }
}

const fallbackModels = {
  User: new FallbackModel('users'),
  Project: new FallbackModel('projects'),
  Property: new FallbackModel('properties'),
  Enquiry: new FallbackModel('enquiries'),
  Wishlist: new FallbackModel('wishlists'),
  persist,
  memoryData,
};

module.exports = fallbackModels;
