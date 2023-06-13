const Pool = require("pg").Pool;
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
const bcrypt = require("bcrypt");
const getDistrict = (request, res) => {
  pool.query(
    "SELECT * FROM district WHERE province_id=1 ORDER BY district_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getDistrictById = (request, res) => {
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
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getProjectStatus = (request, res) => {
  pool.query(
    "SELECT * FROM project_status ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getProjectStatusById = (request, res) => {
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
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getProject = (request, res) => {
  pool.query("SELECT * FROM project ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const response = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    res.status(status).json(response);
  });
};

const getSubDistrict = (request, res) => {
  pool.query("SELECT * FROM subdistrict ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const response = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    res.status(status).json(response);
  });
};

const getSubDistrictByDistrictId = (request, res) => {
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
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getZipCodeBySubDistrictId = (request, res) => {
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
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getRole = (request, res) => {
  pool.query("SELECT * FROM role ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows;
    const status = 200;
    const status_msg = "OK";
    const response = {
      status: status,
      status_msg: status_msg,
      data: data,
    };
    res.status(status).json(response);
  });
};

const postRegistUser = async (request, res) => {
  const {
    title,
    firstname,
    lastname,
    position,
    phone,
    email,
    district,
    subdistrict,
    zipcode,
    community,
    password,
  } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users (title, firstname, lastname, position, phone, email, district, subdistrict, zipcode, community, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      values: [
        title,
        firstname,
        lastname,
        position,
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
    

    process.env.TOKEN_SECRET;
    token = jwt.sign(
      { id: data[0].id, email: data[0].email, role:data[0].position },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  
    const status = 200;
    const status_msg = "OK";
    const response = {
      status: status,
      status_msg: status_msg,
      data: data,
      token: token
    };

    res.status(status).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCommunityDistrictId = (request, res) => {
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
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};

const getCommunity = (request, res) => {
  pool.query(
    "SELECT * FROM community ORDER BY id",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = "OK";
      const response = {
        status: status,
        status_msg: status_msg,
        data: data,
      };
      res.status(status).json(response);
    }
  );
};


module.exports = {
  getDistrict,
  getDistrictById,
  getProjectStatus,
  getProjectStatusById,
  getProject,
  getSubDistrict,
  getSubDistrictByDistrictId,
  getZipCodeBySubDistrictId,
  postRegistUser,
  getRole,
  getCommunityDistrictId,
  getCommunity
};
