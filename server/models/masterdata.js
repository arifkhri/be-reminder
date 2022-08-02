import { createConnection } from '../core/database';

export default {
  getAllDepartment: (payload) => {
    let p = [];

    let qSql = `SELECT id, name FROM department WHERE deleted_at IS NULL ${payload.keyword && `AND name LIKE '%${payload.keyword}%'`}`;
    
    if (payload.limit) {
      qSql = qSql + " LIMIT ? ";
      p.push(payload.limit);
    }

    if (payload.offset) {
      qSql = qSql + " OFFSET ? ";
      p.push(payload.limit);
    }

    console.log("[MODELS]Masterdata ~ getAllDepartment ~ qSql", qSql);
    console.log("[MODELS]Masterdata ~ getAllDepartment ~ payload", payload);

    return new Promise((resolve, reject) => {
      const db = createConnection();
   
      db.query(qSql, [payload.limit, payload.offset], (err, data) => {
        if (err) {
          reject(err);
        }
  
        resolve(data);
      });
  
      db.end();
    });
  },
  getAllPosition: (payload) => {
  console.log("🚀 ~ file: masterdata.js ~ line 37 ~ payload", payload)
    let p = [];
    let qSql = `SELECT id, name FROM position WHERE deleted_at IS NULL`;

    if (payload.keyword) {
      qSql = qSql + ` AND name LIKE ? `;
      p.push(`%${payload.keyword}%`);
    }

    if (payload.department_id) {
      qSql = qSql + ` AND department_id=? `;
      p.push(payload.department_id);
    }

    if (payload.limit) {
      qSql = qSql + " LIMIT ? ";
      p.push(payload.limit);
    }

    if (payload.offset) {
      qSql = qSql + " OFFSET ? ";
      p.push(payload.limit);
    }
   
    console.log("[MODELS]Masterdata ~ getAllPosition ~ qSql", qSql);
    console.log("[MODELS]Masterdata ~ getAllPosition ~ payload", payload);

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
  getTotalRows: (table) => {
    const qSql = `SELECT COUNT(id) FROM ${table} WHERE deleted_at IS NULL`;
   
    console.log("[MODELS]Masterdata ~ getTotalRows ~ qSql", qSql);

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
  }
}

