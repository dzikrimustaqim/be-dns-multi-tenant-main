module.exports = {
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;

    let whereStatement = {};

    if (searchTerm) {
      whereStatement = {
        [Sequelize.Op.or]: [
          {
            nama_studi: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [["createdAt", "ASC"]],
    };

    console.log("QUERY ", query);
    const count = await req.db.MatapelUji.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.MatapelUji.findAll(query)
      .then((resultMatapelUji) => {
        res.status(200).send({
          totalrows: count,
          data: resultMatapelUji,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.MatapelUji.findByPk(req.params.id, {})
      .then((resultMatapelUji) => {
        if (!resultMatapelUji) {
          return res.status(404).send({
            message: "MatapelUji Not Found",
          });
        }
        return res.status(200).send(resultMatapelUji);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.MatapelUji.create({
      nama_studi: req.body.nama_studi,
    })
      .then((resultMatapelUji) => res.status(201).send(resultMatapelUji))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.MatapelUji.findByPk(req.params.id, {})
      .then((resultMatapelUji) => {
        if (!resultMatapelUji) {
          return res.status(404).send({
            message: "MatapelUji Not Found",
          });
        }
        return resultMatapelUji.update({
          nama_studi: req.body.nama_studi || resultMatapelUji.nama_studi,
        })
          .then(() => res.status(200).send(resultMatapelUji))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.MatapelUji.findByPk(req.params.id)
      .then((resultMatapelUji) => {
        if (!resultMatapelUji) {
          return res.status(400).send({
            message: "MatapelUji Not Found",
          });
        }
        return resultMatapelUji.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
