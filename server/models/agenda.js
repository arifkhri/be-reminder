import { createConnection } from '../core/database';

const table = "agenda";

export default {
  create: (payload) => {
    const qSql = `INSERT INTO ${table} (user_id, employee_id, remind_at, description, date) VALUES (?, ?, ?, ?, ?) ;`;

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
    const qSql = `UPDATE ${table} SET user_id=?, employee_id=?, remind_at=?, description=?, date=? WHERE id=? ;`;

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
  setComplete: (payload) => {
    const qSql = `UPDATE ${table} SET is_completed=true, is_active=false WHERE id IN (?) ;`;

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, [payload], (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
        db.end();
      });
    });
  },
  updateStatus: (payload) => {
    const qSql = `UPDATE ${table} SET is_active=? WHERE id=? ;`;

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
  updateRemindAt: (payload) => {
    const qSql = `UPDATE ${table} SET remind_at=? WHERE id IN (?)`;

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, [payload.remind_at ,payload.ids], (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });

      db.end();
    });
  },
  getById: (payload) => {
    const qSql = `SELECT ${table}.id, ${table}.employee_id, ${table}.remind_at, ${table}.description, ${table}.date, ${table}.is_active, e.full_name as employee, e.picture_url as employee_picture_url, d.name as department, p.name as position FROM ${table} JOIN employee as e ON ${table}.employee_id = e.id JOIN department as d ON e.department_id = d.id JOIN position as p ON e.position_id = p.id WHERE ${table}.id=?`;

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
  getByIds: (payload) => {
    const qSql = `SELECT ${table}.id, ${table}.employee_id, ${table}.remind_at, ${table}.description, ${table}.date, ${table}.is_active, e.full_name as employee, e.picture_url as employee_picture_url, d.name as department, p.name as position FROM ${table} JOIN employee as e ON ${table}.employee_id = e.id JOIN department as d ON e.department_id = d.id JOIN position as p ON e.position_id = p.id WHERE ${table}.id IN (?)`;

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, payload, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });

      db.end();
    });
  },
  getAll: (payload) => {
    let qSql = `SELECT ${table}.id, ${table}.employee_id, ${table}.remind_at, ${table}.description, ${table}.date, ${table}.is_active, e.nik as employee_nik, e.full_name as employee, e.picture_url as employee_picture_url, d.name as department, p.name as position FROM ${table} JOIN employee as e ON ${table}.employee_id = e.id JOIN department as d ON e.department_id = d.id JOIN position as p ON e.position_id = p.id `;
    const p = [];
    let opCode = 'WHERE';
    let opFilterCode = 'WHERE';

    if (payload.keyword) {
      qSql = qSql + ` WHERE (${table}.description LIKE ? OR e.full_name LIKE ?)`;
      p.push(`%${payload.keyword}%`);
      p.push(`%${payload.keyword}%`);
      opCode = 'AND';
      opFilterCode = 'AND';
    }

    if (payload.date) {
      const pDate = payload.date.split(",");
      qSql = qSql + ` ${opCode} (agenda.date BETWEEN ? AND ?)`;
      p.push(pDate[0], pDate[1]);
      opCode = 'AND';
      opFilterCode = 'AND';
    }

    if (payload.remind_at) {
      const pRemindAt = payload.date.split(",");
      qSql = qSql + ` ${opCode} (agenda.remind_at BETWEEN ? AND ?)`;
      p.push(pRemindAt[0], pRemindAt[1]);
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
    
    if (payload.is_active) {
      qSql = qSql + " " + opCode + " agenda.is_active=1 ";
      opCode = 'AND';
    }
    
    qSql = qSql + " " + opCode + " " + table + ".deleted_at IS NULL ORDER BY " +table+ ".created_at DESC ";

    qSql = qSql + " LIMIT ? ";
    p.push(payload.limit);

    qSql = qSql + " OFFSET ? ";
    p.push(payload.offset);
    
    console.log("[MODELS]Agenda ~ getAll ~ qSql", qSql);
    console.log("[MODELS]Agenda ~ getAll ~ payload", p);

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
  delete: (payload) => {
    const qSql = `DELETE FROM ${table} WHERE id=?`;

    return new Promise((resolve, reject) => {
      const db = createConnection();

      db.query(qSql, payload, (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
      });

      db.end();
    });
  },
}

