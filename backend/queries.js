const Pool = require("pg").Pool;
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "pb",
  password: "password",
  port: 5432,
});
const getDistrict = (request, res) => {
  pool.query(
    "SELECT * FROM district WHERE province_id=1 ORDER BY district_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = 'OK'; 
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
      const status_msg = 'OK'; 
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
      const status_msg = 'OK'; 
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
      const status_msg = 'OK'; 
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

  pool.query(
    "SELECT * FROM project ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const data = results.rows;
      const status = 200;
      const status_msg = 'OK'; 
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
  getProject
};
