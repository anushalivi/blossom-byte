import { query } from '../db.js';
import crypto from 'crypto';

class ProductDocument {
  constructor(data, categoryData = null) {
    this._id = data.id || data._id;
    this.id = this._id;
    this.name = data.name;
    this.slug = data.slug || data.id;
    this.description = data.description || '';
    this.price = Number(data.price);
    this.discount = Number(data.discount || 0);
    this.stock = Number(data.stock ?? 10);
    this.image = data.image || '';
    this.features = typeof data.features === 'string' ? JSON.parse(data.features) : (data.features || []);
    this.isFeatured = Boolean(data.is_featured ?? data.isFeatured);
    this.sku = data.sku || `BLS-${this.id}`;
    this.rating = Number(data.rating || 4.8);
    this.reviews = Number(data.reviews || 50);
    this.deliveryTime = data.delivery_time || data.deliveryTime || 'Same Day Delivery';
    this.createdAt = data.created_at || data.createdAt || new Date();

    if (categoryData) {
      this.category = {
        _id: categoryData.id,
        id: categoryData.id,
        slug: categoryData.slug,
        name: categoryData.name
      };
    } else if (data.category_name || data.category_slug) {
      this.category = {
        _id: data.category_id,
        id: data.category_id,
        slug: data.category_slug,
        name: data.category_name
      };
    } else {
      this.category = data.category_id || data.category;
    }
  }
}

const Product = {
  find(filter = {}) {
    let shouldPopulate = false;
    let orderClause = 'ORDER BY p.created_at DESC';

    const execute = async () => {
      let sql;
      if (shouldPopulate) {
        sql = `
          SELECT 
            p.*, 
            c.name as category_name, 
            c.slug as category_slug 
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          ${orderClause}
        `;
      } else {
        sql = `SELECT p.* FROM products p ${orderClause}`;
      }

      const res = await query(sql);
      return res.rows.map(r => new ProductDocument(r));
    };

    const queryObj = {
      populate(field) {
        if (field === 'category') {
          shouldPopulate = true;
        }
        return queryObj;
      },
      sort(criteria) {
        if (criteria && criteria.createdAt === 1) {
          orderClause = 'ORDER BY p.created_at ASC';
        } else {
          orderClause = 'ORDER BY p.created_at DESC';
        }
        return queryObj;
      },
      then(resolve, reject) {
        return execute().then(resolve, reject);
      }
    };

    return queryObj;
  },

  async create(data) {
    const id = data.id || data.sku?.toLowerCase() || `prod-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryId = typeof data.category === 'object' ? data.category?._id || data.category?.id : (data.category || data.categoryId);

    const res = await query(`
      INSERT INTO products (
        id, name, slug, description, price, discount, category_id,
        stock, image, features, is_featured, sku
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      id,
      data.name,
      slug,
      data.description || '',
      Number(data.price),
      Number(data.discount || 0),
      categoryId,
      Number(data.stock ?? 10),
      data.image || '',
      JSON.stringify(data.features || []),
      Boolean(data.isFeatured),
      data.sku || `BLS-${id}`
    ]);

    return new ProductDocument(res.rows[0]);
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.name !== undefined) { fields.push(`name = $${idx++}`); values.push(updates.name); }
    if (updates.description !== undefined) { fields.push(`description = $${idx++}`); values.push(updates.description); }
    if (updates.price !== undefined) { fields.push(`price = $${idx++}`); values.push(Number(updates.price)); }
    if (updates.discount !== undefined) { fields.push(`discount = $${idx++}`); values.push(Number(updates.discount)); }
    if (updates.stock !== undefined) { fields.push(`stock = $${idx++}`); values.push(Number(updates.stock)); }
    if (updates.image !== undefined) { fields.push(`image = $${idx++}`); values.push(updates.image); }
    if (updates.category !== undefined || updates.categoryId !== undefined) {
      const catId = typeof updates.category === 'object' ? (updates.category?._id || updates.category?.id) : (updates.category || updates.categoryId);
      fields.push(`category_id = $${idx++}`);
      values.push(catId);
    }
    if (updates.features !== undefined) {
      fields.push(`features = $${idx++}`);
      values.push(JSON.stringify(updates.features));
    }
    if (updates.isFeatured !== undefined) {
      fields.push(`is_featured = $${idx++}`);
      values.push(Boolean(updates.isFeatured));
    }

    if (fields.length === 0) {
      const res = await query('SELECT * FROM products WHERE id = $1', [id]);
      return res.rows.length ? new ProductDocument(res.rows[0]) : null;
    }

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await query(sql, values);
    return res.rows.length ? new ProductDocument(res.rows[0]) : null;
  },

  async findByIdAndDelete(id) {
    const res = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return res.rows.length ? new ProductDocument(res.rows[0]) : null;
  },

  async deleteMany(filter = {}) {
    return query('DELETE FROM products');
  },

  async insertMany(products) {
    const list = [];
    for (const p of products) {
      const doc = await this.create(p);
      list.push(doc);
    }
    return list;
  }
};

export default Product;
