const Pool = require("pg").Pool;
const pool = new Pool({
  user: "Admin",
  host: "bkkpb.ath.cx",
  database: "pb",
  password: "Admin1234!",
  port: 54327,
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

const getSubDistrict = (request, res) => {

  pool.query(
    "SELECT * FROM subdistrict ORDER BY id ASC",
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
  getProject,
  getSubDistrict,
  getSubDistrictByDistrictId,
  getZipCodeBySubDistrictId
};
