import express from 'express';

import authMiddleware from '../middlewares/auth';
import agendaCtrl from '../controllers/agenda';

const router = express.Router();

/**
  * @swagger
  * /api/v1/agenda:
  *   get:
  *     tags:
  *     - Agenda
  *     summary: Get agenda list.
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
  *         name: is_active
  *         schema:
  *           type: string
  *       - in: query
  *         name: position
  *         schema:
  *           type: string
  *       - in: query
  *         name: date
  *         schema:
  *           type: string
  *       - in: query
  *         name: remind_at
  *         schema:
  *           type: string
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Get Agenda List
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 total:
  *                    type: integer
  *                 limit:
  *                    type: integer
  *                 page:
  *                    type: integer
  *                 data:
  *                    type: array
  *                    items:
  *                      type: object
  *                      properties:
  *                       id:
  *                         type: integer
  *                       employee_id:
  *                         type: integer
  *                       is_active:
  *                         type: integer
  *                       employee:
  *                         type: string
  *                       employee_picture_url:
  *                         type: string
  *                       department:
  *                         type: string
  *                       position:
  *                         type: string
  *                       date:
  *                         type: string
  *                       description:
  *                         type: string
  *                       remind_at:
  *                         type: string
*/
router.get('/', authMiddleware, agendaCtrl.getAll);

/**
  * @swagger
  * /api/v1/agenda/{id}:
  *   get:
  *     tags:
  *     - Agenda
  *     summary: Get Agenda.
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
  *         description: Get Agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 employee_id:
  *                   type: integer
  *                 is_active:
  *                   type: integer
  *                 employee:
  *                   type: string
  *                 employee_picture_url:
  *                   type: string
  *                 department:
  *                   type: string
  *                 position:
  *                   type: string
  *                 date:
  *                   type: string
  *                 description:
  *                   type: string
  *                 remind_at:
  *                   type: string
*/
router.get('/:id', authMiddleware, agendaCtrl.getById)

/**
  * @swagger
  * /api/v1/agenda:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Create a agenda.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            employee_id:
  *              type: string
  *            date:
  *              example: 2022-05-18 15:00:00
  *              type: string
  *            description:
  *              type: string
  *            remind_at:
  *              example: 2022-05-18 15:00:00
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
  *               example: Succesfully created agenda
*/
router.post('/', authMiddleware, agendaCtrl.create);

/**
  * @swagger
  * /api/v1/agenda/{id}:
  *   put:
  *     tags: 
  *      - Agenda
  *     summary: Update a agenda.
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            employee_id:
  *              type: string
  *            date:
  *              example: 2022-05-18 15:00:00
  *              type: string
  *            description:
  *              type: string
  *            remind_at:
  *              example: 2022-05-18 15:00:00
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
  *               example: Succesfully updated agenda
*/
router.put('/:id', authMiddleware, agendaCtrl.update);

/**
  * @swagger
  * /api/v1/agenda/{id}/active:
  *   put:
  *     tags: 
  *      - Agenda
  *     summary: Update status a agenda.
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
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
  *         description: Updated status agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully change status agenda
*/
router.put('/:id/active', authMiddleware, agendaCtrl.updateStatus);

/**
  * @swagger
  * /api/v1/agenda/{id}:
  *   delete:
  *     tags: 
  *      - Agenda
  *     summary: Update status a agenda.
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
  *         description: Updated status agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully deleted agenda
*/
router.delete('/:id', authMiddleware, agendaCtrl.delete);

/**
  * @swagger
  * /api/v1/agenda/remind:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Update agenda remind at.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            ids:
  *              type: array
  *              items:
  *               type: string
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Updated remind_at agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully remind agenda
*/
router.post('/remind', authMiddleware, agendaCtrl.remindAgain);

/**
  * @swagger
  * /api/v1/agenda/complete:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Update agenda remind at.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            ids:
  *              type: array
  *              items:
  *               type: string
  *            is_renew:
  *              type: boolean
  *            employee_ids:
  *               type: array
  *               items:
  *                 type: string
  *            date:
  *              example: 2022-05-18 15:00:00
  *              type: string
  *            description:
  *              type: string
  *            remind_day:
  *              type: number
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Updated remind_at agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully remind agenda
*/
router.post('/complete', authMiddleware, agendaCtrl.complete);

/**
  * @swagger
  * /api/v1/agenda/share:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Share agenda.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *          schema:
  *           type: object
  *           properties:
  *            emails:
  *              type: array
  *              items:
  *               type: string
  *            agenda_ids:
  *              type: array
  *              items:
  *               type: string
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Share agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully share agenda
*/
router.post('/share', authMiddleware, agendaCtrl.shareReminder);

/**
  * @swagger
  * /api/v1/agenda/import:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Import agenda.
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
  *         description: Updated status Agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully change status Agenda
*/
router.post('/import', authMiddleware, agendaCtrl.import);

/**
  * @swagger
  * /api/v1/agenda/export:
  *   post:
  *     tags: 
  *      - Agenda
  *     summary: Export agenda.
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
  *         description: Updated status Agenda
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: Succesfully updated password Agenda
*/
router.post('/export', authMiddleware, agendaCtrl.export);

module.exports = router;
