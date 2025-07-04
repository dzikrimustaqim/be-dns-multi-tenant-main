const Helper = require('../utils/helper');
const { sequelize } = require('../models');
const Siswa = require('../models').Siswa;

module.exports = {
  login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }
    // if (!Helper.isValidEmail(req.body.email)) {
    //   return res.status(400).send({ 'message': 'Please enter a valid email address' });
    // }

    return Siswa
      .findOne({ where: { username: req.body.username } })
      .then((Proguser) => {
        if (!Proguser) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        if (!Helper.comparePassword(Proguser.password, req.body.password)) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        
        const token = Helper.generateToken(Proguser.username, req.tenantId);
        
        const jsonUser = {
          "iduser":Proguser.id,
          "username":Proguser.username,
          "grade":"PARENT",
          "telepon":Proguser.telepon,
          "email":Proguser.email,
        };
        const user = Helper.strEncode(JSON.stringify(jsonUser));

        return res.status(200).send({ token, user });
      })
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return req.db.Siswa.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultSiswa) => res.status(200).send(resultSiswa))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listSiswaAktif(req, res) {
    return req.db.Siswa.findAll({
      where: { status: "t" },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultSiswa) => res.status(200).send(resultSiswa))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Siswa.findByPk(req.params.id, {})
      .then((resultSiswa) => {
        if (!resultSiswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        return res.status(200).send(resultSiswa);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {

    if (!req.body.username || !req.body.password || !req.body.email || !req.body.telepon) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    const hashPassword = Helper.hashPassword(req.body.password);
    const regNumber = Helper.generateRegNumber();
    
    console.log('regnum', regNumber);

    console.log("regnum", regNumber);

    return req.db.Siswa.create({
      regnumber: regNumber,
      reg_date: new Date(),
      username: req.body.username,
      password: hashPassword,
      email: req.body.email,
      telepon: req.body.telepon,
    })
      .then((resultSiswa) => res.status(201).send(resultSiswa))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.Siswa.findByPk(req.params.id, {})
      .then((resultSiswa) => {
        if (!resultSiswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        return resultSiswa
          .update({
            username: req.body.username || resultSiswa.username,
            password: req.body.password
              ? Helper.hashPassword(req.body.password)
              : resultSiswa.password,
            email: req.body.email || resultSiswa.email,
            telepon: req.body.telepon || resultSiswa.telepon,
            status: req.body.status || resultSiswa.status,
          })
          .then(() => res.status(200).send(resultSiswa))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Siswa.findByPk(req.params.id)
      .then((resultSiswa) => {
        if (!resultSiswa) {
          return res.status(400).send({
            message: 'Siswa Not Found',
          });
        }
        return resultSiswa.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};