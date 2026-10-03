import { query } from '../db.js';

class CategoryDocument {
  constructor(data) {
    this._id = data.id || data._id;
    this.id = this._id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description || '';
    this.image = data.image || '';
    this.createdAt = data.created_at || data.createdAt || new Date();
  }
}

const Category = {
  find(filter = {}) {
    let orderClause = 'ORDER BY created_at DESC';

    const execute = async () => {
      const res = await query(`SELECT * FROM categories ${orderClause}`);
      return res.rows.map(r => new CategoryDocument(r));
    };

    return {
      sort(criteria) {
        if (criteria && criteria.createdAt === 1) {
          orderClause = 'ORDER BY created_at ASC';
        } else {
          orderClause = 'ORDER BY created_at DESC';
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

  async create(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = data.id || slug;

    const res = await query(`
      INSERT INTO categories (id, name, slug, description, image)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, image = EXCLUDED.image
      RETURNING *
    `, [id, data.name, slug, data.description || '', data.image || '']);

    return new CategoryDocument(res.rows[0]);
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.name) {
      fields.push(`name = $${idx++}`);
      values.push(updates.name);
    }
    if (updates.slug) {
      fields.push(`slug = $${idx++}`);
      values.push(updates.slug);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(updates.description);
    }
    if (updates.image !== undefined) {
      fields.push(`image = $${idx++}`);
      values.push(updates.image);
    }

    if (fields.length === 0) {
      const res = await query('SELECT * FROM categories WHERE id = $1', [id]);
      return res.rows.length ? new CategoryDocument(res.rows[0]) : null;
    }

    values.push(id);
    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await query(sql, values);
    return res.rows.length ? new CategoryDocument(res.rows[0]) : null;
  },

  async findByIdAndDelete(id) {
    const res = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return res.rows.length ? new CategoryDocument(res.rows[0]) : null;
  },

  async deleteMany(filter = {}) {
    return query('DELETE FROM categories');
  },

  async insertMany(categories) {
    const inserted = [];
    for (const cat of categories) {
      const doc = await this.create(cat);
      inserted.push(doc);
    }
    return inserted;
  }
};

export default Category;
