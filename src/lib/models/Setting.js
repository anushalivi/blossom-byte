import { query } from '../db.js';

const Setting = {
  async find(filter = {}) {
    const res = await query('SELECT key, value FROM settings');
    return res.rows.map(r => ({
      key: r.key,
      value: typeof r.value === 'string' ? (r.value.startsWith('"') || r.value.startsWith('{') || r.value.startsWith('[') ? JSON.parse(r.value) : r.value) : r.value
    }));
  },

  async updateOne(filter, updateDoc, options = {}) {
    const key = filter.key;
    const value = updateDoc.$set ? updateDoc.$set.value : updateDoc.value;
    const jsonValue = JSON.stringify(value);

    await query(`
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value
    `, [key, jsonValue]);

    return { acknowledged: true, modifiedCount: 1 };
  },

  async insertMany(settings) {
    for (const s of settings) {
      await this.updateOne({ key: s.key }, { value: s.value });
    }
    return settings;
  }
};

export default Setting;
