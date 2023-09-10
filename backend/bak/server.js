import express, { json, urlencoded } from "express";
import multer, { diskStorage } from "multer";
import { join, extname } from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import pg from "pg";
import { compare, hash } from "bcrypt";
import { existsSync, unlink } from "fs";
import { env } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { Pool } = pg;
const { sign } = jsonwebtoken;

if (!env.DB_NAME || !env.TOKEN_SECRET) {
  console.error("need environment parameters");
  process.exit(1);
}

const port = env.API_PORT || 8090;

const pool = new Pool({
  user: env.DB_USER || postgres,
  host: env.DB_HOST || localhost,
  database: env.DB_NAME || postgres,
  password: env.DB_PASSWORD,
  port: env.DB_PORT || 5432,
});

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

function generateAccessToken(username) {
  return sign(username, env.TOKEN_SECRET, { expiresIn: "1800s" });
}

// info
app.get("/api", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

// เขต/อำเภอ
app.get("/api/districts", (request, response) => {
  pool.query(
    "SELECT * FROM district WHERE province_id=1 ORDER BY district_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

app.get("api/districts/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM district WHERE district_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

app.get("/api/subdistrict", (request, response) => {
  pool.query("SELECT * FROM subdistrict ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const res_data = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    response.status(status).json(res_data);
  });
});

app.get("/api/subdistrict/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM subdistrict WHERE amphure_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

app.get("/api/zipcode/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM subdistrict WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// รับ images
app.get("/api/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = join(__dirname, "uploads/img", filename);

  if (existsSync(filePath)) {
    if (filename === "0") {
      res.sendFile(join(__dirname, "uploads/img", "og_image.png"));
    } else {
      res.sendFile(join(__dirname, "uploads/img", filename));
    }
  } else {
    // ส่งรูปภาพอื่นที่คุณต้องการกลับไป เช่น รูปภาพเริ่มต้นหรือรูปภาพใหม่
    const fallbackFilePath = join(
      __dirname,
      "uploads/img",
      "og_image.png"
    );
    res.sendFile(fallbackFilePath);
  }
});

// รับ chart_img
app.get("/api/get/chart_img/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = join(__dirname, "uploads/chart_img", filename);

  if (existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // ส่งรูปภาพอื่นที่คุณต้องการกลับไป เช่น รูปภาพเริ่มต้นหรือรูปภาพใหม่
    const fallbackFilePath = join(
      __dirname,
      "uploads/chart_img",
      "default.jpg"
    );
    res.sendFile(fallbackFilePath);
  }
});

// delete/doc
app.delete("/api/delete/chart_img/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = join(__dirname, "uploads/chart_img", filename);

  // ลบไฟล์
  unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file.");
    } else {
      res.sendStatus(200);
    }
  });
});

// download doc
app.get("/api/download/doc/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = join(__dirname, "uploads/doc", filename);

  res.download(filePath, (err) => {
    if (err) {
      // หากเกิดข้อผิดพลาดในการดาวน์โหลดไฟล์
      console.error(err);
      res.status(500).send("Error downloading file.");
    }
  });
});

// delete/doc
app.delete("/api/delete/doc/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = join(__dirname, "uploads/doc", filename);

  // ลบไฟล์
  unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file.");
    } else {
      res.sendStatus(200);
    }
  });
});

app.get("/api/project/status", (request, response) => {
  pool.query(
    "SELECT * FROM project_status ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

app.get("/api/project/status/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM project_status WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// project
app.get("/api/project/", (request, response) => {
  pool.query("SELECT * FROM project ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }

    // แปลง description
    var decodedData = results.rows.map(function (obj) {
      obj.description = decodeURIComponent(obj.description);
      return obj;
    });
    const status = 200;
    const status_msg = "OK";
    const res_data = {
      status: status,
      status_msg: status_msg,
      data: decodedData,
    };
    response.status(status).json(res_data);
  });
});

// project id
app.get("/api/project/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM project  WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    // แปลง description
    var decodedData = results.rows.map(function (obj) {
      obj.description = decodeURIComponent(obj.description);
      return obj;
    });

    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const res_data = {
      status: status,
      status_msg: status_msg,
      data: decodedData,
    };
    response.status(status).json(res_data);
  });
});

app.get("/api/role", async (request, response) => {
  pool.query("SELECT * FROM role ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const res_data = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    response.status(status).json(res_data);
  });
});

app.get("/api/community/district/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM community WHERE district_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";

      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

app.get("/api/community/", async (request, response) => {
  pool.query("SELECT * FROM community ORDER BY id", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const res_data = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    response.status(status).json(res_data);
  });
});

// post -----------------------------

// เช็ก user auth
// auth
app.post("/api/user/auth", (request, response) => {
  const { email, password } = request.body;
  try {
    pool.query(
      "SELECT * FROM USERS WHERE email=$1",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        const data = results.rows;
        if (Array.isArray(data) && data.length != 0) {
          compare(password, data[0].password, (error, isMatch) => {
            const accountIsActive = data[0].active === 1 ? true : false;

            if (error) {
              // Handle the error
              console.error(error);
              return;
            }

            if (isMatch) {
              env.TOKEN_SECRET;
              const token = sign(
                {
                  id: data[0].id,
                  email: data[0].email,
                  role: data[0].position,
                  fullname: data[0].fullname,
                  district: data[0].district,
                  zipcode: data[0].zipcode,
                  community: data[0].community,
                  subdistrict: data[0].subdistrict,
                  active: data[0].active,
                },
                env.TOKEN_SECRET,
                { expiresIn: "1h" }
              );

              const res_json = accountIsActive
                ? {
                  status: 200,
                  statusMsg: "เข้าสู่ระบบสำเร็จ",
                  data: data,
                  token: token,
                }
                : {
                  status: 401,
                  statusMsg:
                    "บัญชีของคุณยังไม่ถูกเปิดใช้งาน ทีมงานของเรากำลังดำเนินการเปิดใช้งานบัญชีภายใน 5-10 นาที โปรดเข้าสู่ระบบอีกครั้ง หรือติดต่อเจ้าหน้าที่ได้ที่ช่องทาง [ใดๆ]",
                  data: data,
                  token: token,
                };
              response.status(200).json(res_json);
            } else {
              // Passwords do not match
              response.status(200).json({
                status: 401,
                statusMsg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                data: [],
                token: "",
              });
              console.log("Password is incorrect");
            }
          });
        } else {
          response.status(200).json({
            status: 401,
            statusMsg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
            data: [],
            token: "",
          });
          console.log("Email is incorrect");
        }
      }
    );
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/createNewUser", (req, res) => {
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});

// register
app.post("/api/user/register", async (request, response) => {
  const {
    title,
    fullname,
    position,
    address,
    phone,
    email,
    district,
    subdistrict,
    zipcode,
    community,
    password,
  } = request.body;

  // เช็กเมล์ซ้ำ
  const query = {
    text: "SELECT email FROM users WHERE email = $1",
    values: [email],
  };

  const results = await pool.query(query);
  const data = results.rows;

  if (data.length > 0) {
    // อีเมล์นี้มีอยู่ในฐานข้อมูล
    response.status(200).json({
      status: 401,
      statusMsg: "มีอีเมลนี้ในระบบแล้ว",
      data: [],
      token: "",
    });
  } else {
    try {
      const hashedPassword = await hash(password, 10);

      const query = {
        text: "INSERT INTO users (title, fullname, position, address, phone, email, district, subdistrict, zipcode, community, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        values: [
          title,
          fullname,
          position,
          address,
          phone,
          email,
          district,
          subdistrict,
          zipcode,
          community,
          hashedPassword,
        ],
      };

      const results = await pool.query(query);
      const data = results.rows;

      const token = sign(
        { id: data[0].id, email: data[0].email, role: data[0].position },
        env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const res_json = {
        status: 200,
        statusMsg: "สมัครสมาชิกสำเร็จ",
        data: data,
        token: token,
      };

      response.status(200).json(res_json);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// add project
app.post("/api/add/project", async (request, response) => {
  const {
    status_id,
    owner_id,
    name,
    short_description,
    og_image,
    description,
    participation,
    evaluation,
    financial_plan,
    hashtag,
    create_email,
    note,
    status_note,
    communityname,
    districtname,
  } = request.body;

  let encode_description = encodeURIComponent(description);
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  let thaiDate = `${day} ${thaiMonths[month - 1]} ${year + 543}`;
  // console.log(`วันที่ปัจจุบัน: ${thaiDate}`);
  let list_update = { data: [] };
  let file_doc = { data: [] };
  let list_budget = { data: [] };

  try {
    const query = {
      text: "INSERT INTO project (status_id, owner_id, name, short_description, og_image, description, participation, evaluation, financial_plan, hashtag, create_email, date, note, status_note, communityname, districtname, list_update, file_doc, list_budget) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *",
      values: [
        status_id,
        owner_id,
        name,
        short_description,
        og_image,
        encode_description,
        participation,
        evaluation,
        financial_plan,
        hashtag,
        create_email,
        thaiDate,
        note,
        status_note,
        communityname,
        districtname,
        list_update,
        file_doc,
        list_budget,
      ],
    };

    const results = await pool.query(query);
    const data = results.rows;
    // console.log('data : ',data)
    const res_json = {
      status: 200,
      statusMsg: "เพิ่มโครงการเรียบร้อยแล้ว",
      data: data,
      token: "",
    };

    response.status(200).json(res_json);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// upload project
app.post("/api/upload/project", async (request, response) => {
  const { name, hashtag, short_description, description, og_image, row_id } =
    request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  let date = thaiDateWithTime;

  try {
    const query = {
      text: "UPDATE project SET name = $1, hashtag = $2, short_description = $3, description = $4, og_image = $5, date= $6 WHERE id = $7 RETURNING *",
      values: [
        name,
        hashtag,
        short_description,
        description,
        og_image,
        date,
        row_id,
      ],
    };

    const results = await pool.query(query);
    const data = results.rows;

    const res_json = {
      status: 200,
      statusMsg: "แก้ไขการเรียบร้อยแล้ว",
      data: data,
      token: "",
    };

    response.status(200).json(res_json);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// api/upload/img
const storage_img = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/img");
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่
    cb(
      null,
      file.fieldname + "-" + Date.now() + extname(file.originalname)
    );
  },
});

const upload_img = multer({ storage: storage_img });
app.post("/api/upload/img", upload_img.single("file"), (req, res) => {
  if (req.file) {
    // A file was uploaded
    const filename = req.file.filename;

    // Perform any additional operations with the filename

    res.status(200).send({ filename: filename });
  } else {
    // No file was uploaded
    res.status(400).send("No file was uploaded.");
  }
});

// api/upload/doc
const storage_doc = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/doc");
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่
    cb(
      null,
      file.fieldname + "-" + Date.now() + extname(file.originalname)
    );
  },
});

const upload_doc = multer({ storage: storage_doc });
app.post("/api/upload/doc", upload_doc.single("file"), (req, res) => {
  if (req.file) {
    const filename = req.file.filename;
    res.status(200).send({ filename: filename });
  } else {
    res.status(400).send("No file was uploaded.");
  }
});

// api/upload/image
const storage_image = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chart_img");
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่
    cb(
      null,
      file.fieldname + "-" + Date.now() + extname(file.originalname)
    );
  },
});

const upload_image = multer({ storage: storage_image });
app.post("/api/upload/image", upload_image.single("file"), (req, res) => {
  if (req.file) {
    const filename = req.file.filename;
    res.status(200).send({ filename: filename });
  } else {
    res.status(400).send("No file was uploaded.");
  }
});

// update status_id
app.post("/api/update/status_id", (request, response) => {
  const { status_id, row_id, status_note, note } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  pool.query(
    "UPDATE project SET status_id = $1, status_note =$2 WHERE id = $3",
    [status_id, status_note, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update note_id
app.post("/api/update/note_id", (request, response) => {
  const { row_id, note } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  note.date = thaiDateWithTime;

  pool.query(
    "UPDATE project SET note = $1 WHERE id = $2",
    [note, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update status_id
app.post("/api/update/status_id", (request, response) => {
  const { status_id, row_id, status_note, note } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  let thaiDate = `${day} ${thaiMonths[month - 1]} ${year + 543}`;

  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  note.date = thaiDateWithTime;

  pool.query(
    "UPDATE project SET status_id = $1, date = $2, status_note =$3, note = $4 WHERE id = $5",
    [status_id, thaiDate, status_note, note, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update chat_id
app.post("/api/update/chat_id", async (request, response) => {
  const { list_update, row_id } = request.body;

  function generateRandomString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  list_update.date = thaiDateWithTime;
  list_update.id = generateRandomString(20);
  const query = {
    text: "SELECT list_update FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].list_update.data;
  let new_list_update = { data: data_list };
  data_list.push(list_update);

  pool.query(
    "UPDATE project SET list_update = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update edit chat_id
app.post("/api/edit/chat_id", async (request, response) => {
  const { id, title, content, img_name, row_id } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  const query = {
    text: "SELECT list_update FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].list_update.data;

  for (let item of data_list) {
    if (item.id === id) {
      item.date = thaiDateWithTime;
      item.title = title;
      item.content = content;
      item.img_name = img_name;
    }
  }

  let new_list_update = { data: data_list };

  pool.query(
    "UPDATE project SET list_update = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update file_name id
app.post("/api/update/file_name_id", async (request, response) => {
  const { file_name_db, row_id } = request.body;

  const query = {
    text: "SELECT file_doc FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].file_doc.data;
  data_list = data_list.filter((item) => item.file_name_db !== file_name_db);

  let new_list_update = { data: data_list };

  pool.query(
    "UPDATE project SET file_doc = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// update chat_id
app.post("/api/update/doc_id", async (request, response) => {
  const { list_update, row_id } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  // add date
  list_update.date = thaiDateWithTime;

  const query = {
    text: "SELECT file_doc FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].file_doc.data;
  let new_list_update = { data: data_list };
  data_list.push(list_update);

  pool.query(
    "UPDATE project SET file_doc = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// get district name by id
app.post("/api/get/district/id", (request, response) => {
  const { id } = request.body;

  pool.query(
    "SELECT * FROM district WHERE district_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// get community name by id
app.post("/api/get/community/id", (request, response) => {
  const { id } = request.body;

  pool.query(
    "SELECT * FROM community WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// เพิ่ม รายการ ตารางแผนการใช้เงินสำหรับโครงการ
app.post("/api/add/list_budget", async (request, response) => {
  const { list_name, budget, row_id } = request.body;

  function generateRandomString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  const query = {
    text: "SELECT list_budget FROM project WHERE id = $1",
    values: [row_id],
  };
  const results = await pool.query(query);
  let data_list = results.rows[0].list_budget.data;

  data_list.push({
    id: generateRandomString(20),
    list_name: list_name,
    budget: budget,
    date: thaiDateWithTime,
  });

  let new_list_update = { data: data_list };

  pool.query(
    "UPDATE project SET list_budget = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

// แก้ไข รายการ ตารางแผนการใช้เงินสำหรับโครงการ
app.post("/api/edit/list_budget", async (request, response) => {
  const { id, list_name, budget, row_id } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543
    } ${hours}:${minutes}:${seconds}`;

  const query = {
    text: "SELECT list_budget FROM project WHERE id = $1",
    values: [row_id],
  };
  const results = await pool.query(query);
  let data_list = results.rows[0].list_budget.data;

  for (let item of data_list) {
    if (item.id === id) {
      item.date = thaiDateWithTime;
      item.list_name = list_name;
      item.budget = budget;
    }
  }

  let new_list_update = { data: data_list };

  pool.query(
    "UPDATE project SET list_budget = $1 WHERE id = $2",
    [new_list_update, row_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "200";
      const res_data = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      response.status(status).json(res_data);
    }
  );
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Participatory Budgeting",
      version: "0.1.0",
      description: "Participatory Budgeting RESTFUL API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Kaogeek",
        url: "",
        email: "",
      },
    },
    servers: [
      {
        url: "http://bkkpb.ath.cx/api",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api/api-docs",
  serve,
  setup(specs, { explorer: true })
);

const server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

/**
 * Graceful shutdown
 */
const gracefulShutdown = () => {
  console.log("SIGTERM signal received: closing HTTP server");
  // stop http request
  server.close(() => {
    console.log("HTTP connection", "closed");
    // clean up connections
    pool.end(() => {
      console.log("PG pool:", "closed");
    });
    // done normal exit
    console.log("Process:", "closed");
    process.exit(0);
  });

  // too long force shutdown
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10 * 1000);
};

// listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);

// node server.js
// nodemon server.js
