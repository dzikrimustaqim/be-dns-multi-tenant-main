const Lembaga = require('../models').Lembaga;

module.exports = {
  list(req, res) {
    return req.db.Lembaga.findAll({
      order: [
        ["urut", "ASC"],
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLembaga) => res.status(200).send(resultLembaga))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByInstansi(req, res) {
    return req.db.Lembaga.findAll({
      where: { id_instansi: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLembaga) => res.status(200).send(resultLembaga))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Lembaga.findByPk(req.params.id, {})
      .then((resultLembaga) => {
        if (!resultLembaga) {
          return res.status(404).send({
            message: 'lembaga Not Found',
          });
        }
        return res.status(200).send(resultLembaga);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Lembaga.create({
      nama_lembaga: req.body.nama_lembaga,
      urut: req.body.urut,
    })
      .then((resultLembaga) => res.status(201).send(resultLembaga))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.Lembaga.findByPk(req.params.id, {})
      .then((resultLembaga) => {
        if (!resultLembaga) {
          return res.status(404).send({
            message: 'Lembaga Not Found',
          });
        }
        return resultLembaga.update({
          nama_lembaga: req.body.nama_lembaga || resultLembaga.nama_lembaga,
          urut: req.body.urut || resultLembaga.urut,
        })
          .then(() => res.status(200).send(resultLembaga))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Lembaga.findByPk(req.params.id)
      .then((resultLembaga) => {
        if (!resultLembaga) {
          return res.status(400).send({
            message: 'Lembaga Not Found',
          });
        }
        return resultLembaga
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};