const Tingkat = require('../models').Tingkat;
const Lembaga = require('../models').Lembaga;

module.exports = {
  list(req, res) {
    return req.db.Tingkat.findAll({
      include: [
        {
          model: req.db.Lembaga,
          as: "Lembaga",
          required: true,
        },
      ],
      order: [
        ["urut", "ASC"],
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultTingkat) => res.status(200).send(resultTingkat))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByLembaga(req, res) {
    return req.db.Tingkat.findAll({
      include: [
        {
          model: req.db.Lembaga,
          as: "Lembaga",
          required: true,
        },
      ],
      where: { id_lembaga: req.params.id },
      order: [
        ["urut", "ASC"],
        // ['createdAt', 'DESC'],
        // ['createdAt', 'DESC'],
      ],
    })
      .then((resultTingkat) => res.status(200).send(resultTingkat))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Tingkat.findByPk(req.params.id, {})
      .then((resultTingkat) => {
        if (!tingkat) {
          return res.status(404).send({
            message: 'tingkat Not Found',
          });
        }
        return res.status(200).send(resultTingkat);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Tingkat.create({
      id_lembaga: req.body.id_lembaga,
      nama_tingkat: req.body.nama_tingkat,
      urut: req.body.urut,
      ppsb: req.body.ppsb,
    })
      .then((resultTingkat) => res.status(201).send(resultTingkat))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.Tingkat.findByPk(req.params.id, {})
      .then((resultTingkat) => {
        if (!Tingkat) {
          return res.status(404).send({
            message: 'Tingkat Not Found',
          });
        }
        return resultTingkat
          .update({
            id_lembaga: req.body.id_lembaga || resultTingkat.id_lembaga,
            nama_tingkat: req.body.nama_tingkat || resultTingkat.nama_tingkat,
            urut: req.body.urut || resultTingkat.urut,
            ppsb: req.body.ppsb || resultTingkat.ppsb,
          })
          .then(() => res.status(200).send(resultTingkat))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Tingkat.findByPk(req.params.id)
      .then((resultTingkat) => {
        if (!Tingkat) {
          return res.status(400).send({
            message: 'Tingkat Not Found',
          });
        }
        return resultTingkat
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};