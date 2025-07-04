module.exports = {
  list(req, res) {
    return req.db.TemplateSetting.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultTemplateSetting) => res.status(200).send(resultTemplateSetting))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.TemplateSetting.findByPk(req.params.id, {})
      .then((resultTemplateSetting) => {
        if (!resultTemplateSetting) {
          return res.status(404).send({
            message: "TemplateSetting Not Found",
          });
        }
        return res.status(200).send(resultTemplateSetting);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByTemplate(req, res) {
    return req.db.TemplateSetting.findOne({
      where: { template: req.params.template },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Bank) => res.status(200).send(Bank))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.TemplateSetting.create({
      deskripsi: req.body.deskripsi,
      path: req.body.path,
    })
      .then((resultTemplateSetting) => res.status(201).send(resultTemplateSetting))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.TemplateSetting.findByPk(req.params.id, {})
      .then((resultTemplateSetting) => {
        if (!resultTemplateSetting) {
          return res.status(404).send({
            message: "TemplateSetting Not Found",
          });
        }
        return resultTemplateSetting
          .update({
            content: req.body.content || resultTemplateSetting.content,
          })
          .then(() => res.status(200).send(resultTemplateSetting))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.TemplateSetting.findByPk(req.params.id)
      .then((resultTemplateSetting) => {
        if (!resultTemplateSetting) {
          return res.status(400).send({
            message: "TemplateSetting Not Found",
          });
        }
        return resultTemplateSetting.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
