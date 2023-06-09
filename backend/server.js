const express      = require('express');
const multer       = require('multer');
const path         = require('path');
const bodyParser   = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');
const app          = express();
const db           = require('./queries');
const cors         = require('cors');
const jwt          = require('jsonwebtoken');
const Pool         = require("pg").Pool;
const bcrypt       = require("bcrypt");
const fs           = require('fs');
const dotenv       = require('dotenv');
const port         = 8090;

if (!fs.existsSync('.env')) {
  console.error('ไม่พบไฟล์ .env');
  process.exit(1);
}

dotenv.config();
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
process.env.TOKEN_SECRET;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

// info
app.get('/api', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

// เขต/อำเภอ
app.get('/api/districts', (request, response) => {

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
})


app.get('api/districts/:id', (request, response) => {
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
})


app.get('/api/subdistrict', (request, response) => {
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
})


app.get('/api/subdistrict/:id', (request, response) => {
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
})


app.get('/api/zipcode/:id', (request, response) => {
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
  );;
})

// รับ images
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;

  if (filename === '0'){
    res.sendFile(path.join(__dirname, 'uploads/img', 'og_image.png'));
  }else{
    res.sendFile(path.join(__dirname, 'uploads/img', filename));
  }
});

// download doc 
app.get('/api/download/doc/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads/doc', filename);

  res.download(filePath, (err) => {
    if (err) {
      // หากเกิดข้อผิดพลาดในการดาวน์โหลดไฟล์
      console.error(err);
      res.status(500).send('Error downloading file.');
    }
  });
});

// delete/doc
app.delete('/api/delete/doc/:filename', (req, res) => {
 
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads/doc', filename);

  // ลบไฟล์
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting file.');
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/api/project/status', (request, response) => {
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
})

app.get('/api/project/status/:id', (request, response) => {
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
})

// project
app.get('/api/project/', (request, response) => {

  pool.query("SELECT * FROM project ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    
    // แปลง description
    var decodedData = results.rows.map(function(obj) {
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

})

// project id
app.get('/api/project/:id', (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM project  WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      // แปลง description
      var decodedData = results.rows.map(function(obj) {
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
    }
  );
})


app.get('/api/role', async (request, response) => {
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
})


app.get('/api/community/district/:id', async (request, response) => {
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
        data: data
      };
      response.status(status).json(res_data);
    }
  );
})

app.get('/api/community/', async (request, response) => {
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
})

// post -----------------------------

// เช็ก user auth
// auth
app.post('/api/user/auth', (request, response) => {
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

        bcrypt.compare(password, data[0].password, (error, isMatch) => {
          if (error) {
            // Handle the error
            console.error(error);
            return;
          }

          if (isMatch) {
            process.env.TOKEN_SECRET;
            token = jwt.sign({ 
              id: data[0].id, 
              email: data[0].email, 
              role: data[0].position, 
              fullname: data[0].fullname,
              district: data[0].district,
              zipcode: data[0].zipcode,
              community: data[0].community,
              subdistrict: data[0].subdistrict,
              },
              process.env.TOKEN_SECRET,
              { expiresIn: "1h" }
            );

            const res_json = {
              status: 200,
              statusMsg: 'เข้าสู่ระบบสำเร็จ',
              data: data,
              token: token
            };
            response.status(200).json(res_json);
          } else {
              // Passwords do not match
              response.status(200).json({       
              status: 401,
              statusMsg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
              data: [],
              token: '', });
              console.log("Password is incorrect");
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/api/createNewUser', (req, res) => {
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});

// register
app.post('/api/user/register', async (request, response) => {

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
      token: '', });
      
  }else{
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
    
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
    
      const token = jwt.sign(
        { id: data[0].id, email: data[0].email, role: data[0].position },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );
    
      const res_json = {
        status: 200,
        statusMsg: "สมัครสมาชิกสำเสร็จ",
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
app.post('/api/add/project', async (request, response) => {
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
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];

  let thaiDate = `${day} ${thaiMonths[month - 1]} ${year + 543}`;
  // console.log(`วันที่ปัจจุบัน: ${thaiDate}`);
  let list_update = {"data": []}
  let file_doc = {"data": []}

  try {
    const query = {
      text: "INSERT INTO project (status_id, owner_id, name, short_description, og_image, description, participation, evaluation, financial_plan, hashtag, create_email, date, note, status_note, communityname, districtname, list_update, file_doc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *",
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
      ],
    };
    
    const results = await pool.query(query);
    const data = results.rows;
    // console.log('data : ',data)
    const res_json = {
      status: 200,
      statusMsg: "เพิ่มโครงการเรียบร้อยแล้ว",
      data: data,
      token: '',
    };
  
    response.status(200).json(res_json);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
  
});

// api/upload/img
const storage_img = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/img'); 
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload_img = multer({ storage: storage_img });
app.post('/api/upload/img',  upload_img.single('file'), (req, res) => {
  if (req.file) {
    // A file was uploaded
    const filename = req.file.filename;

    // Perform any additional operations with the filename

    res.status(200).send({ filename: filename });
  } else {
    // No file was uploaded
    res.status(400).send('No file was uploaded.');
  }
});

// api/upload/doc
const storage_doc = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/doc'); 
  },
  filename: function (req, file, cb) {
    // กำหนดชื่อไฟล์ใหม่
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload_doc = multer({ storage: storage_doc });
app.post('/api/upload/doc',  upload_doc.single('file'), (req, res) => {
  if (req.file) {

    const filename = req.file.filename;
    res.status(200).send({ filename: filename });

  } else {
    res.status(400).send('No file was uploaded.');
  }
});

// update status_id
app.post('/api/update/status_id', (request, response) => {
  const {status_id, row_id, status_note, note } = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];

  let thaiDate = `${day} ${thaiMonths[month - 1]} ${year + 543}`;

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
app.post('/api/update/chat_id', async (request, response) => {
  const {list_update, row_id,} = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543} ${hours}:${minutes}:${seconds}`;

  list_update.date = thaiDateWithTime;
  const query = {
    text: "SELECT list_update FROM project WHERE id = $1",
    values: [row_id],
  };

    const results = await pool.query(query);
    let data_list = results.rows[0].list_update.data;
    let new_list_update = {"data": data_list}
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

// update file_name id
app.post('/api/update/file_name_id', async (request, response) => {
  const {file_name_db, row_id} = request.body;

  const query = {
    text: "SELECT file_doc FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].file_doc.data;
  data_list = data_list.filter(item => item.file_name_db !== file_name_db);

  let new_list_update = {"data": data_list}

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
app.post('/api/update/doc_id', async (request, response) => {
  const {list_update, row_id,} = request.body;

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];
  let thaiDateWithTime = `${day} ${thaiMonths[month - 1]} ${year + 543} ${hours}:${minutes}:${seconds}`;
  
  // add date
  list_update.date = thaiDateWithTime;

  const query = {
    text: "SELECT file_doc FROM project WHERE id = $1",
    values: [row_id],
  };

  const results = await pool.query(query);
  let data_list = results.rows[0].file_doc.data;
  let new_list_update = {"data": data_list}
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
app.post('/api/get/district/id', (request, response) => {
  const {id,} = request.body;
  
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
})

// get community name by id
app.post('/api/get/community/id', (request, response) => {
  const {id,} = request.body;

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
})


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Participatory Budgeting',
      version: '0.1.0',
      description: 'Participatory Budgeting RESTFUL API',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Kaogeek',
        url: '',
        email: '',
      },
    },
    servers: [
      {
        url: 'http://bkkpb.ath.cx/api',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});


// node server.js
// nodemon server.js


