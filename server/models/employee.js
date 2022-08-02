import { createConnection } from '../core/database';

const table = "employee";

export default {
  create: (payload) => {
    const qSql = `INSERT INTO ${table} (full_name, first_name, last_name, email, phone, nik, department_id, position_id, picture_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ;`;

    console.log("[MODELS]Employee ~ create ~ qSql", qSql);
    console.log("[MODELS]Employee ~ create ~ payload", payload);

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, payload, (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
        db.end();
      });
    });
  },
  update: (payload) => {
    const qSql = `UPDATE ${table} SET full_name=?, first_name=?, last_name=?, email=?, phone=?, nik=?, department_id=?, position_id=?, picture_url=? WHERE id=? ;`;

    console.log("[MODELS]Employee ~ update ~ qSql", qSql);
    console.log("[MODELS]Employee ~ update ~ payload", payload);
    
    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, payload, (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
        db.end();
      });
    });
  },
  findByEmail: (payload) => {
    const qSql = `SELECT id, full_name, email, phone, first_name, last_name FROM ${table} WHERE email IN(?)`;

    console.log("[MODELS]Employee ~ findByEmail ~ qSql", qSql);
    console.log("[MODELS]Employee ~ findByEmail ~ payload", payload);

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, [payload.email], (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });

      db.end();
    });
  },
  getById: (payload) => {
    const qSql = `SELECT id, full_name, email, phone, first_name, last_name, department_id, position_id, picture_url FROM ${table} WHERE id=?`;

    console.log("[MODELS]Employee ~ getById ~ qSql", qSql);
    console.log("[MODELS]Employee ~ getById ~ payload", payload);

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, payload, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data[0]);
      });

      db.end();
    });
  },
  getAll: (payload) => {
    let qSql = `SELECT ${table}.nik, ${table}.id, ${table}.full_name, ${table}.email, ${table}.phone, ${table}.first_name, ${table}.last_name, ${table}.department_id, ${table}.position_id, ${table}.picture_url, p.name as position, d.name as department FROM ${table} JOIN position as p ON ${table}.position_id = p.id JOIN department as d ON ${table}.department_id = d.id `;
    const p = [];
    let opCode = 'WHERE';
    let opFilterCode = 'WHERE';

    if (payload.keyword) {
      qSql = qSql + ` WHERE ${table}.full_name LIKE ?`;
      p.push(`%${payload.keyword}%`);
      opCode = 'AND';
      opFilterCode = 'AND';
    }

    if (payload.position) {
      qSql = qSql + " " + opCode + " p.name IN (?) ";
      p.push(payload.position.split(','));
      opCode = 'AND';
      opFilterCode = 'OR';
    }
    
    if (payload.department) {
      qSql = qSql + " " + opFilterCode + " d.name IN (?) ";
      p.push(payload.department.split(','));
      opCode = 'AND';
    }

    qSql = qSql + " " + opCode + " " + table + ".deleted_at IS NULL ORDER BY " +table+".created_at DESC ";

    if (payload.limit) {
      qSql = qSql + " LIMIT ? ";
      p.push(payload.limit);
    }

    if (payload.offset) {
      qSql = qSql + " OFFSET ? ";
      p.push(payload.limit);
    }
    
    console.log("[MODELS]Employee ~ getAll ~ qSql", qSql);
    console.log("[MODELS]Employee ~ getAll ~ payload", p);

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, p, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });

      db.end();
    });
  },
  getTotalRows: () => {
    const qSql = `SELECT COUNT(id) FROM ${table} WHERE deleted_at IS NULL`;

    console.log("[MODELS]Employee ~ getTotalRows ~ qSql", qSql);
    
    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data[0]['COUNT(id)']);
      });

      db.end();
    });
  },
}

