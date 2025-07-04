module.exports = {
  list(req, res) {
    return req.db.IzinSantri.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultIzinSantri) => res.status(200).send(resultIzinSantri))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.IzinSantri.findByPk(req.params.id, {})
      .then((resultIzinSantri) => {
        if (!resultIzinSantri) {
          return res.status(404).send({
            message: "IzinSantri Not Found",
          });
        }
        return res.status(200).send(resultIzinSantri);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.IzinSantri.create({
      deskripsi: req.body.deskripsi,
      path: req.body.path,
    })
      .then((resultIzinSantri) => res.status(201).send(resultIzinSantri))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.IzinSantri.findByPk(req.params.id, {})
      .then((resultIzinSantri) => {
        if (!resultIzinSantri) {
          return res.status(404).send({
            message: "IzinSantri Not Found",
          });
        }
        return resultIzinSantri
          .update({
            deskripsi: req.body.deskripsi || resultIzinSantri.deskripsi,
            path: req.body.path || resultIzinSantri.path,
          })
          .then(() => res.status(200).send(resultIzinSantri))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.IzinSantri.findByPk(req.params.id)
      .then((resultIzinSantri) => {
        if (!resultIzinSantri) {
          return res.status(400).send({
            message: "IzinSantri Not Found",
          });
        }
        return resultIzinSantri.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
