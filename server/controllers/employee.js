import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import dayjs from 'dayjs';

import Employee from '../models/employee';

export default {
  create: async (req, res) => {

    try {
      const { full_name, email, phone, nik, department_id, position_id } = req.body;

      if (!(full_name || email || phone || nik || department_id || position_id)) {
        res.status(400).send("All input is required");
      }

      const registeredEmployee = await Employee.findByEmail({ email }).catch(err => { res.status(500).json([err.sqlMessage]); });
      if (registeredEmployee.length) {
        res.status(400).send("Employee Already Exist");
      }
      console.log("[CONTROLLER]Employee ~ create ~ req.body", req.body);

      const file = req.file;
      let fileName = '';
      let targetPath = '';

      if (file) {
        const ext = file.mimetype.split('/')
        const bufferFileName = Buffer.from(`${email}-${file.originalname}`).toString('base64');
        fileName = `${bufferFileName}.${ext[1]}`;
        targetPath = path.join(`public/picture/employee/${fileName}`);

        // create the file
        fs.createWriteStream(targetPath).write(file.buffer, (err) => {
          if (err) {
            res.status(500).json([err]);
          }
        });

        console.log("[CONTROLLER]Employee ~ create ~ fileName", fileName);
        console.log("[CONTROLLER]Employee ~ create ~ targetPath", targetPath);
      }

      const name = full_name.split(' ');
      const employee = await Employee.create([full_name, name[0], name[1], email, phone, nik, department_id, position_id, fileName]);
      console.log("[CONTROLLER]Employee ~ create ~ data", employee);

      if (employee) {
        res.status(201).json('Succesfully created Employee');

      } else {
        if (file) {
          fs.unlink(targetPath, err => {
            if (err) throw new Error(err);
          });
        }
      }

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  getAll: async (req, res) => {

    try {
      const { limit: reqLimit, offset: reqOffset, ...restQ } = req.query;
      const limit = Number(reqLimit || 0);
      const offset = Number(reqOffset || 0);
      console.log("[CONTROLLER]Employee ~ getAll ~ req.query", req.query);
      
      const employees = await Employee.getAll({ ...restQ, limit, offset });
      console.log("[CONTROLLER]Agenda ~ getAll ~ data", employees);

      const rowTotal = await Employee.getTotalRows().catch(err => { res.status(500).json([err.sqlMessage]); });
      console.log("[CONTROLLER]Employee ~ getAll ~ rowTotal", rowTotal);

      res.status(200).json({ data: employees, total: rowTotal, offset: offset || null, limit: limit || null });

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  getById: async (req, res) => {

    try {
      console.log("[CONTROLLER]Employee ~ getById ~ req.params", req.params);
      
      const employee = await Employee.getById(Number(req.params.id));
      console.log("[CONTROLLER]Employee ~ getById ~ data", employee);

      if (!employee) {
        res.status(404).json("Employee not found");
      }

      res.status(200).json(employee);

    } catch (err) {
      res.status(500).json([err]);
    }
  },
  update: async (req, res) => {

    try {
      const { full_name, email, phone, nik, department_id, position_id, picture_url } = req.body;

      if (!(full_name || email || phone || nik || department_id || position_id)) {
        res.status(400).send("All input is required");
      }

      console.log("[CONTROLLER]Employee ~ update ~ req.params", req.body);

      const file = req.file;
      let fileName = picture_url;
      let targetPath = '';

      if (file) {
        const ext = file.mimetype.split('/');
        if (picture_url) {
          const pathExistingPicture = path.join(`public/picture/employee/${fileName}`);
          if (fs.existsSync(pathExistingPicture)) {
            // remove existing picture
            fs.unlinkSync(pathExistingPicture);
          }
        }

        const bufferFileName = Buffer.from(`${email}-${file.originalname}`).toString('base64');
        fileName = `${bufferFileName}.${ext[1]}`;
        targetPath = path.join(`public/picture/employee/${fileName}`);

        // create the file
        fs.createWriteStream(targetPath).write(file.buffer, (err) => {
          if (err) {
            res.status(500).json([err]);
          }
        });

        console.log("[CONTROLLER]Employee ~ update ~ fileName", fileName);
        console.log("[CONTROLLER]Employee ~ update ~ targetPath", targetPath);
      }

      const name = full_name.split(' ');
      const employee = await Employee.update([full_name, name[0], name[1], email, phone, nik, department_id, position_id, fileName, Number(req.params.id)]);
      console.log("[CONTROLLER]Employee ~ update ~ data", employee);

      if (employee) {
        res.status(200).json('Succesfully updated Employee');

      } else {
        if (file) {
          fs.unlink(targetPath, err => {
            if (err) throw new Error(err);
          });
        }
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
      const employees = await Employee.getAll();
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