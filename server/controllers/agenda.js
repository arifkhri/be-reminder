import fs from 'fs';
import xlsx from 'xlsx';
import dayjs from 'dayjs';

import Agenda from '../models/agenda';
import Employee from '../models/employee';
import mail from '../core/mail';

export default {
  create: async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { employee_id, description, date, remind_at } = req.body;

      if (!(employee_id || date || remind_at || description)) {
        res.status(400).send("All input is required");
      }
      console.log("[CONTROLLER]Agenda ~ create ~ req.body", req.body);

      const agenda = await Agenda.create([user_id, employee_id, remind_at, description, date]);
      console.log("[CONTROLLER]Agenda ~ create ~ data", agenda);

      if (agenda) {
        res.status(201).json('Succesfully created agenda');
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  getAll: async (req, res) => {

    try {
      const { limit: reqLimit, offset: reqOffset, ...restQ } = req.query;
      const limit = Number(reqLimit);
      const offset = Number(reqOffset);
      console.log("[CONTROLLER]Agenda ~ getAll ~ req.query", req.query);

      const agendas = await Agenda.getAll({ ...restQ, limit, offset });
      console.log("[CONTROLLER]Agenda ~ getAll ~ data", agendas);

      const rowTotal = await Agenda.getTotalRows();
      console.log("[CONTROLLER]Agenda ~ getAll ~ rowTotal", rowTotal);

      res.status(200).json({ data: agendas, total: rowTotal, offset, limit });

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  getById: async (req, res) => {

    try {
      const agenda = await Agenda.getById(Number(req.params.id));

      if (!agenda) {
        res.status(404).json("agenda not found");
      }
      res.status(200).json(agenda);

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  update: async (req, res) => {

    try {
      const user_id = req.user.user_id;
      const { employee_id, description, date, remind_at } = req.body;
      if (!(user_id || employee_id || date || remind_at)) {
        res.status(400).send("All input is required");
      }
      console.log("[CONTROLLER]Agenda ~ update ~ req.body", req.body);

      const agenda = await Agenda.update([user_id, employee_id, remind_at, description, date, Number(req.params.id)]);
      console.log("[CONTROLLER]Agenda ~ update ~ data", agenda);

      if (agenda) {
        res.status(200).json('Succesfully updated agenda');
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  delete: async (req, res) => {

    try {
      const agenda = await Agenda.delete(Number(req.params.id));

      if (agenda) {
        res.status(200).json('Succesfully deleted agenda');
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  complete: async (req, res) => {

    try {
      const user_id = req.user.user_id;
      const { ids, is_renew, employee_ids, description, date, remind_day } = req.body;

      console.log("🚀 ~ file: agenda.js ~ line 108 ~ complete: ~ is_renew", req.body)
      if (is_renew) {
        if (!(employee_ids.length || date || remind_day || description)) {
          res.status(400).send("All input is required");
        }

        console.log("[CONTROLLER]Agenda ~ create ~ req.body", req.body);
        const remind_at = dayjs(date).subtract(remind_day, 'day').set('hour', 7).set('minute', 0).set('second', 0).format("YYYY-MM-DD HH:mm:ss");

        const successCreate = [];
        const createNewAgenda = await new Promise((resolve, reject) => {
          employee_ids.forEach(async (employee_id) => {
            await Agenda.create([user_id, employee_id, remind_at, description, date]).catch((err) => {
              reject(err);
            });
  
            successCreate.push(employee_id);
  
            if (successCreate.length == employee_ids.length) {
              resolve(true);
            }
          });
        });
  
        if (!createNewAgenda) {
          res.status(500).json(createNewAgenda);
        }
      }

      const agenda = await Agenda.setComplete(ids);

      if (agenda) {
        res.status(200).json(`Succesfully completed agenda`);
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  updateStatus: async (req, res) => {

    try {
      const { is_active } = req.body;

      const agenda = await Agenda.updateStatus([is_active, Number(req.params.id)]);

      if (agenda) {
        res.status(200).json(`Succesfully ${is_active ? 'Active' : 'Inactive'} agenda`);
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },

  remindAgain: async (req, res) => {

    try {
      const { ids } = req.body;

      if (!(ids.length)) {
        res.status(400).send("Agenda ID is required");
      }
      console.log("[CONTROLLER]Agenda ~ create ~ req.body", req.body);
      const remind_at = dayjs().add(1, 'day').set('hour', 7).set('minute', 0).set('second', 0).format("YYYY-MM-DD HH:mm:ss")

      const agenda = await Agenda.updateRemindAt({ remind_at, ids });
      console.log("[CONTROLLER]Agenda ~ create ~ data", agenda);

      if (agenda) {
        res.status(200).json('Succesfully updated agenda');
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },

  shareReminder: async (req, res) => {

    try {
      const { agenda_ids, emails } = req.body;
      const agenda = await Agenda.getByIds(agenda_ids);
      const employee = await Employee.findByEmail({ email: emails });
      console.log("[CONTROLLER]Agenda ~ shareReminder ~ agenda", agenda);
      console.log("[CONTROLLER]Agenda ~ shareReminder ~ employee", employee);

      const employeeEmail = employee.map(data => data.email);
      const sentData = [];

      const reqMail = await new Promise((resolve, reject) => {
        agenda.forEach(async (data) => {
          await mail.sendReminder({ to: employeeEmail, agenda: data.description, reminder_date: dayjs(data.date).format('dddd, DD MMMM YYYY hh:mm') }).catch((err) => {
            reject(err);
          });

          sentData.push(data);

          if (sentData.length == agenda.length) {
            resolve(true);
          }
        });
      });

      console.log("[CONTROLLER]Agenda ~ shareReminder ~ result reqMail", reqMail);


      if (reqMail) {
        res.status(200).json('Succesfully send reminder email');

      } else {
        res.status(500).json(reqMail);
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },

  import: async (req, res) => {

    try {
      //   const Employee = await Employee.delete(Number(req.params.id));

      //   if (Employee) {
      //     res.status(200).json('Succesfully deleted Employee');
      //   }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  export: async (req, res) => {
    try {
      // const { name, filter } = req.query;
      const employees = await Agenda.getAll();
      const workbook = xlsx.utils.book_new();
      const filename = 'Sheet1';
      const dataSheet = xlsx.utils.json_to_sheet(employees);

      xlsx.utils.book_append_sheet(workbook, dataSheet, filename)

      const file = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
      fs.writeFileSync(`public/export/employee/${dayjs().format('YYYY-MM-DD')}.xlsx`, file);
      res.status(200).json({ data: employees, total: 0 });

    } catch (err) {
      res.status(500).json([err]);
    }
  },
}