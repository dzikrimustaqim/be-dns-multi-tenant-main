const Gurustudi = require("../models").Gurustudi;
const Walikelas = require("../models").Walikelas;
const { Sequelize } = require("sequelize");

module.exports = {
  list(req, res) {
    return req.db.Gurustudi.findAll({
      include: [
        "User",
        "Studi",
        {
          model: req.db.Walikelas,
          as: "Walikelas",
          attributes: ["id"],
          required: false,
          include: ["User", "TahunAjaran", "Semester", "Kelas"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Gurustudi) => res.status(200).send(Gurustudi))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getGurustudiBySemester(req, res) {
    return req.db.Gurustudi.findAll({
      include: [
        "User",
        "Studi",
        {
          model: req.db.Walikelas,
          as: "Walikelas",
          attributes: ["id"],
          required: false,
          include: ["User", "TahunAjaran", "Semester", "Kelas"],
          where: { semester_id: req.body.semester_id },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Gurustudi) => res.status(200).send(Gurustudi))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Gurustudi.findByPk(req.params.id, {})
      .then((Gurustudi) => {
        if (!Gurustudi) {
          return res.status(404).send({
            message: "Gurustudi Not Found",
          });
        }
        return res.status(200).send(Gurustudi);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.Gurustudi.findOne({ where: { slug: req.body.slug } })
      .then((Gurustudi) => {
        if (!Gurustudi) {
          return res.status(404).send({
            message: "Gurustudi Not Found",
          });
        }
        return res.status(200).send(Gurustudi);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Gurustudi.create({
      proguser_id: req.body.proguser_id,
      walikelas_id: req.body.walikelas_id,
      studi_id: req.body.studi_id,
    })
      .then((Gurustudi) => res.status(201).send(Gurustudi))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Gurustudi.findByPk(req.params.id, {})
      .then((Gurustudi) => {
        if (!Gurustudi) {
          return res.status(404).send({
            message: "Gurustudi Not Found",
          });
        }
        return Gurustudi.update({
          proguser_id: req.body.proguser_id,
          walikelas_id: req.body.walikelas_id,
          studi_id: req.body.studi_id,
        })
          .then(() => res.status(200).send(Gurustudi))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Gurustudi.findByPk(req.params.id)
      .then((Gurustudi) => {
        if (!Gurustudi) {
          return res.status(400).send({
            message: "Gurustudi Not Found",
          });
        }
        return Gurustudi.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
