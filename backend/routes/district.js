/**
 * @swagger
 * components:
 *   schemas:
 *     Districts:
 *       type: object
 *       required:
 *         - name_th
 *         - name_en
 *         - province_id
 *       properties:
 *         district_id:
 *           type: string
 *           description: The auto-generated id of the district
 *         name_th:
 *           type: string
 *           description: The title of district in Thai
 *         name_en:
 *           type: string
 *           description:  The title of district in Eng
 *         province_id:
 *           type: string
 *           description: The province code
 *         created_at:
 *           type: string
 *           format: date
 *           description: The date district was added
 *       example:
 *         district_id: 1001
 *         name_th: เขตพระนคร
 *         name_en: Khet Phra Nakhon
 *         province_id: 1
 *         created_at: 2019-08-08T17:00:00.000Z
 * tags:
 *   name: Districts
 *   description: The Districts managing API
 * /districts:
 *   get:
 *     summary: Lists all the districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: The list of the districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Districts'
 *   post:
 *     summary: Create a new district
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Districts'
 *     responses:
 *       200:
 *         description: The created district.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Districts'
 *       500:
 *         description: Some server error
 * /districts/{id}:
 *   get:
 *     summary: Get the district by district id
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The district id
 *     responses:
 *       200:
 *         description: The district response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Districts'
 *       404:
 *         description: The District was not found
 *   put:
 *    summary: Update the district by the id
 *    tags: [Districts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The district id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Districts'
 *    responses:
 *      200:
 *        description: The District was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Districts'
 *      404:
 *        description: The District was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the district by id
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The district id
 *
 *     responses:
 *       200:
 *         description: The district was deleted
 *       404:
 *         description: The district was not found
 */
