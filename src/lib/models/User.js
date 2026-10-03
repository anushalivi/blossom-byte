import { query } from '../db.js';
import crypto from 'crypto';

class UserDocument {
  constructor(data) {
    this._id = data.id || data._id;
    this.id = this._id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone || '';
    this.isAdmin = Boolean(data.is_admin ?? data.isAdmin);
    this.tier = data.tier || 'Silver';
    this.addresses = typeof data.addresses === 'string' ? JSON.parse(data.addresses) : (data.addresses || []);
    this.createdAt = data.created_at || data.createdAt || new Date();
    this.updatedAt = data.updated_at || data.updatedAt || new Date();
  }

  async save() {
    await query(`
      UPDATE users
      SET 
        name = $1,
        email = $2,
        password = $3,
        phone = $4,
        is_admin = $5,
        tier = $6,
        addresses = $7,
        updated_at = NOW()
      WHERE id = $8
    `, [
      this.name,
      this.email,
      this.password,
      this.phone,
      this.isAdmin,
      this.tier,
      JSON.stringify(this.addresses),
      this.id
    ]);
    return this;
  }
}

const User = {
  async findOne(filter = {}) {
    if (filter.email) {
      const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [filter.email.trim()]);
      if (res.rows.length === 0) return null;
      return new UserDocument(res.rows[0]);
    }
    if (filter.isAdmin !== undefined || filter.is_admin !== undefined) {
      const res = await query('SELECT * FROM users WHERE is_admin = TRUE LIMIT 1');
      if (res.rows.length === 0) return null;
      return new UserDocument(res.rows[0]);
    }
    if (filter.id || filter._id) {
      const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [filter.id || filter._id]);
      if (res.rows.length === 0) return null;
      return new UserDocument(res.rows[0]);
    }
    const res = await query('SELECT * FROM users LIMIT 1');
    if (res.rows.length === 0) return null;
    return new UserDocument(res.rows[0]);
  },

  find(filter = {}) {
    let selectFields = '*';
    const execute = async () => {
      const sql = `SELECT ${selectFields} FROM users ORDER BY created_at DESC`;
      const res = await query(sql);
      return res.rows.map(r => new UserDocument(r));
    };

    return {
      select(fields) {
        if (fields.includes('-password')) {
          selectFields = 'id, name, email, phone, is_admin, tier, addresses, created_at, updated_at';
        }
        return {
          then(resolve, reject) {
            return execute().then(resolve, reject);
          }
        };
      },
      then(resolve, reject) {
        return execute().then(resolve, reject);
      }
    };
  },

  async create(userData) {
    const id = userData.id || userData._id || `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const addresses = Array.isArray(userData.addresses) ? userData.addresses : [];
    const isAdmin = Boolean(userData.isAdmin || userData.is_admin);
    const tier = userData.tier || (isAdmin ? 'Platinum' : 'Silver');

    const res = await query(`
      INSERT INTO users (id, name, email, password, phone, is_admin, tier, addresses)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      id,
      userData.name,
      userData.email.toLowerCase().trim(),
      userData.password,
      userData.phone || '',
      isAdmin,
      tier,
      JSON.stringify(addresses)
    ]);

    return new UserDocument(res.rows[0]);
  },

  async findByIdAndDelete(id) {
    const res = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows.length > 0 ? new UserDocument(res.rows[0]) : null;
  }
};

export default User;
