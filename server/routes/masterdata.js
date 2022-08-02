import express from 'express';

import authMiddleware from '../middlewares/auth';
import masterdataCtrl from '../controllers/masterdata';

const router = express.Router();

/**
  * @swagger
  * /api/v1/masterdata/department:
  *   get:
  *     tags:
  *     - Masterdata
  *     summary: Get Departments.
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
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Get Departments
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
  *                          name:
  *                            type: integer
*/
router.get('/department', authMiddleware, masterdataCtrl.getAllDepartment);

/**
  * @swagger
  * /api/v1/masterdata/position:
  *   get:
  *     tags:
  *     - Masterdata
  *     summary: Get Positions
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
  *     responses:
  *       500:
  *         description: Server error
  *       200:
  *         description: Get Positions
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
  *                          name:
  *                            type: integer
*/
router.get('/position', authMiddleware, masterdataCtrl.getAllPosition);

module.exports = router;
