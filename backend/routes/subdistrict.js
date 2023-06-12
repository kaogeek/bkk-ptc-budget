/**
 * @swagger
 * components:
 *   schemas:
 *     SubDistrict:
 *       type: object
 *       required:
 *         - zip_code
 *         - name_th
 *         - name_en
 *         - amphure_id
 *         - created_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the sub district
 *         name_th:
 *           type: string
 *           description: The title of sub district in Thai
 *         name_en:
 *           type: string
 *           description:  The title of sub district in Eng
 *         amphure_id:
 *           type: string
 *           description: The district code
 *         created_at:
 *           type: string
 *           format: date
 *           description: The date sub district was added
 *       example:
 *         id: "100101"
 *         zip_code: 10200
 *         name_th: พระบรมมหาราชวัง
 *         name_en: Phra Borom Maha Ratchawang
 *         amphure_id: 1001
 *         created_at: 9/8/2019 03:33:09
 * tags:
 *   name: SubDistricts
 *   description: The SubDistricts managing API
 * /subdistrict:
 *   get:
 *     summary: Lists all the sub districts
 *     tags: [SubDistricts]
 *     responses:
 *       200:
 *         description: The list of the sub districts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubDistrict'
 *   post:
 *     summary: Create a new district
 *     tags: [SubDistricts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubDistrict'
 *     responses:
 *       200:
 *         description: The created sub district.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubDistrict'
 *       500:
 *         description: Some server error
 * /subdistrict/{id}:
 *   get:
 *     summary: Get the Sub district by district id
 *     tags: [SubDistricts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The district id
 *     responses:
 *       200:
 *         description: The Sub district response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubDistrict'
 *       404:
 *         description: The District was not found
 *   put:
 *    summary: Update the Sub district by the id
 *    tags: [SubDistricts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Sub district id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SubDistrict'
 *    responses:
 *      200:
 *        description: The Sub District was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SubDistrict'
 *      404:
 *        description: The Sub District was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the sub district by id
 *     tags: [SubDistricts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sub district id
 *
 *     responses:
 *       200:
 *         description: The sub district was deleted
 *       404:
 *         description: The sub district was not found
 */
