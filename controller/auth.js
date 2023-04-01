const employee = require("../models/employee")
const manager = require("../models/manager")
const jwt = require("jsonwebtoken");
const employeeLogin = async (req, res) => {
    try {
        const {employeeEmail,employeePassword} = req.body;
        if (!employeeEmail || !employeePassword) {
            return res
                .status(422)
                .send({error: 'You must provide email and password.'});
        }
        const result = await employee.findOne({ employeeEmail:employeeEmail });
        if(!result){
          return res.status(401).send({
            message:"Invalid username or password"
          })
        }
        if (result) {
            const password = await employee.findOne({ employeePassword:employeePassword });
            if (password) {
                var token = jwt.sign({ result: result }, "ClothingCompany", {
                  expiresIn: "30d",
                });
                const resultRes = {
                  message: "Login Successfull",
                  token: token,
                  employeeEmail:result.employeeEmail
                };
                res.status(200).send(resultRes);
              } else {
                res.status(401).send({
                    message:"Invalid username or password"
                });
              }
        }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
  const managerLogin = async (req, res) => {
    try {
        const {managerEmail,managerPassword} = req.body;
        if (!managerEmail || !managerPassword) {
            return res
                .status(422)
                .send({error: 'You must provide email and password.'});
        }
        const result = await manager.findOne({ managerEmail:managerEmail });
        if(!result){
          return res.status(401).send({
            message:"Invalid username or password"
          })
        }
        if (result) {
            const password = await manager.findOne({ managerPassword:managerPassword });
            if (password) {
                var token = jwt.sign({ result: result }, "ClothingCompany", {
                  expiresIn: "30d",
                });
                const resultRes = {
                  message: "Login Successfull",
                  token: token,
                  managerEmail:result.managerEmail
                };
                res.status(200).send(resultRes);
              } else {
                res.status(401).send({
                    message:"Invalid username or password"
                });
              }
        }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
  module.exports = {
    employeeLogin,
    managerLogin
  }