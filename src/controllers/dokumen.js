module.exports = {
  list(req, res) {
    return req.db.Dokumen.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultDokumen) => res.status(200).send(resultDokumen))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Dokumen.findByPk(req.params.id, {})
      .then((resultDokumen) => {
        if (!resultDokumen) {
          return res.status(404).send({
            message: "Dokumen Not Found",
          });
        }
        return res.status(200).send(resultDokumen);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Dokumen.create({
      deskripsi: req.body.deskripsi,
      path: req.body.path,
    })
      .then((resultDokumen) => res.status(201).send(resultDokumen))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.Dokumen.findByPk(req.params.id, {})
      .then((resultDokumen) => {
        if (!resultDokumen) {
          return res.status(404).send({
            message: "Dokumen Not Found",
          });
        }
        return resultDokumen
          .update({
            deskripsi: req.body.deskripsi || resultDokumen.deskripsi,
            path: req.body.path || resultDokumen.path,
          })
          .then(() => res.status(200).send(resultDokumen))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Dokumen.findByPk(req.params.id)
      .then((resultDokumen) => {
        if (!resultDokumen) {
          return res.status(400).send({
            message: "Dokumen Not Found",
          });
        }
        return resultDokumen.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
