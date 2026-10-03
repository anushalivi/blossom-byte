import { query } from '../db.js';
import crypto from 'crypto';

class OrderDocument {
  constructor(data, userData = null) {
    this._id = data.id || data._id;
    this.id = this._id;
    this.orderId = data.order_id || data.orderId || this._id;
    this.total = Number(data.total);
    this.gst = Number(data.gst || 0);
    this.deliveryFee = Number(data.delivery_fee || 0);
    this.status = data.status || 'Processing';
    this.items = typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || []);
    this.shippingDetails = typeof data.shipping_details === 'string' ? JSON.parse(data.shipping_details) : (data.shipping_details || {});
    this.createdAt = data.created_at || data.createdAt || new Date();

    if (userData) {
      this.user = {
        _id: userData.id,
        id: userData.id,
        name: userData.name,
        email: userData.email
      };
    } else if (data.user_name || data.user_email) {
      this.user = {
        _id: data.user_id,
        id: data.user_id,
        name: data.user_name,
        email: data.user_email
      };
    } else {
      this.user = data.user_id || data.user;
    }
  }
}

const Order = {
  find(filter = {}) {
    let shouldPopulate = false;
    let orderClause = 'ORDER BY o.created_at DESC';

    const execute = async () => {
      let sql;
      if (shouldPopulate) {
        sql = `
          SELECT 
            o.*, 
            u.name as user_name, 
            u.email as user_email 
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ${orderClause}
        `;
      } else {
        sql = `SELECT o.* FROM orders o ${orderClause}`;
      }

      const res = await query(sql);
      return res.rows.map(r => new OrderDocument(r));
    };

    const queryObj = {
      populate(field, subfields) {
        if (field === 'user') {
          shouldPopulate = true;
        }
        return queryObj;
      },
      sort(criteria) {
        if (criteria && criteria.createdAt === 1) {
          orderClause = 'ORDER BY o.created_at ASC';
        } else {
          orderClause = 'ORDER BY o.created_at DESC';
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
    const id = data.id || `ord-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const orderId = data.orderId || data.id || `ORD-${Date.now()}`;
    const userId = typeof data.user === 'object' ? data.user?._id || data.user?.id : (data.user || data.userId);

    const res = await query(`
      INSERT INTO orders (
        id, order_id, user_id, items, total, gst, delivery_fee, status, shipping_details
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      id,
      orderId,
      userId || null,
      JSON.stringify(data.items || []),
      Number(data.total),
      Number(data.gst || 0),
      Number(data.deliveryFee || 0),
      data.status || 'Processing',
      JSON.stringify(data.shippingDetails || {})
    ]);

    return new OrderDocument(res.rows[0]);
  },

  async findOneAndUpdate(filter, updates) {
    if (filter.orderId) {
      const res = await query(`
        UPDATE orders
        SET status = $1
        WHERE order_id = $2
        RETURNING *
      `, [updates.status, filter.orderId]);
      return res.rows.length ? new OrderDocument(res.rows[0]) : null;
    }
    return null;
  }
};

export default Order;
