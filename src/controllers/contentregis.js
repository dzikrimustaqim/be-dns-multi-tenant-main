module.exports = {
  getByType(req, res) {
    return req.db.ContentRegis.findOne({
      where: { type: req.params.type },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((ContentRegis) => res.status(200).send(ContentRegis))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.ContentRegis.findByPk(req.params.id, {})
      .then((ContentRegis) => {
        if (!ContentRegis) {
          return res.status(404).send({
            message: "ContentRegis Not Found",
          });
        }
        return res.status(200).send(ContentRegis);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.type) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.ContentRegis.create({
      type: req.body.type,
      name: req.body.name,
      body: req.body.body,
    })
      .then((ContentRegis) => res.status(201).send(ContentRegis))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.type) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.ContentRegis.findByPk(req.params.id)
      .then((ContentRegis) => {
        if (!ContentRegis) {
          return res.status(400).send({
            message: "ContentRegis Not Found",
          });
        }
        console.log(ContentRegis);

        return ContentRegis.update({
          type: req.body.type,
          name: req.body.name,
          body: req.body.body,
        })
          .then((ContentRegis) => res.status(201).send(ContentRegis))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
