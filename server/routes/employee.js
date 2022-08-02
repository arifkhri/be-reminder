import express from 'express';

import employeeCtrl from '../controllers/employee';
import authMiddleware from '../middlewares/auth';
import multipartMiddleware from '../middlewares/multipart-form-data';

const router = express.Router();

/**
  * @swagger
  * /api/v1/employee:
  *   get:
  *     tags:
  *     - Employee
  *     summary: Get employees.
  *     parameters:
  *       - in: query
  *         name: limit
  *         schema:
  *           type: string
  *           required: true
  *       - in: query
  *         name: offset
  *         schema:
  *           type: string
  *           required: true
  *       - in: query
  *         name: keyword
  *         schema:
  *           type: string
  *       - in: query
  *         name: department
  *         schema:
  *           type: string
  *       - in: query
  *         name: position
  *         schema:
  *           type: string
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Get Employee List
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 total:
  *                    type: integer
  *                 limit:
  *                    type: integer
  *                 offset:
  *                    type: integer
  *                 data:
  *                    type: array
  *                    items:
  *                        type: object
  *                        properties:
  *                          id:
  *                            type: integer
  *                          full_name:
  *                            type: string
  *                          first_name:
  *                            type: string
  *                          last_name:
  *                            type: string
  *                          email:
  *                            type: string
  *                          phone:
  *                            type: string
  *                          department_id:
  *                            type: string
  *                          department:
  *                            type: string
  *                          position_id:
  *                            type: string
  *                          position:
  *                            type: string
  *                          picture_url:
  *                            type: string
*/
router.get('/', authMiddleware, employeeCtrl.getAll);

/**
  * @swagger
  * /api/v1/employee/{id}:
  *   get:
  *     tags:
  *     - Employee
  *     summary: Get Employee.
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Get Employee
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 full_name:
  *                   type: string
  *                 first_name:
  *                   type: string
  *                 last_name:
  *                   type: string
  *                 email:
  *                   type: string
  *                 phone:
  *                   type: string
  *                 picture_url:
  *                   type: string
  *                 department_id:
  *                   type: string
  *                 position_id:
  *                   type: string
*/
router.get('/:id', authMiddleware, employeeCtrl.getById)

/**
  * @swagger
  * /api/v1/employee:
  *   post:
  *     tags: 
  *      - Employee
  *     summary: Create a employee.
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *          schema:
  *           type: object
  *           properties:
  *            full_name:
  *              type: string
  *            email:
  *              type: string
  *            phone:
  *              type: string
  *            nik:
  *              type: string
  *            file:
  *              type: file
  *            position_id:
  *              type: string
  *            department_id:
  *              type: string
  *     responses:
  *       500:
  *         description: Server error
  *       201:
  *         description: Created
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully created Employee
*/
router.post('/', [authMiddleware, multipartMiddleware.img()], employeeCtrl.create);

/**
  * @swagger
  * /api/v1/employee/{id}:
  *   put:
  *     tags: 
  *      - Employee
  *     summary: Update a employee.
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *          schema:
  *           type: object
  *           properties:
  *            full_name:
  *              type: string
  *            file:
  *              type: file
  *            email:
  *              type: string
  *            phone:
  *              type: string
  *            nik:
  *              type: string
  *            department_id:
  *              type: string
  *            department:
  *              type: string
  *            position_id:
  *              type: string
  *            position:
  *              type: string
  *            picture_url:
  *              type: string
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Updated
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully updated Employee
*/
router.put('/:id', [authMiddleware, multipartMiddleware.img()], employeeCtrl.update);

/**
  * @swagger
  * /api/v1/employee/import:
  *   post:
  *     tags: 
  *      - Employee
  *     summary: Import Employee.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            is_active:
  *              type: boolean
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Updated status Employee
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully change status Employee
*/
router.post('/import', authMiddleware, employeeCtrl.import);

/**
  * @swagger
  * /api/v1/employee/export:
  *   post:
  *     tags: 
  *      - Employee
  *     summary: Export employee.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            new_password:
  *              type: boolean
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Updated status Employee
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully updated password Employee
*/
router.post('/export', authMiddleware, employeeCtrl.export);

module.exports = router;
