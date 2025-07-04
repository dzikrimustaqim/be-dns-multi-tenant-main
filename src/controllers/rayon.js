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
            nama_rayon: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      include: [
        {
          model: req.db.Proguser,
          as: "ProguserRayon",
          required: true,
          include: [
            {
              model: req.db.StaffProfile,
              as: "userProfile",
              required: true,
            },
          ],
        },
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.Rayon.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Rayon.findAll(query)
      .then((resultRayon) => {
        res.status(200).send({
          totalrows: count,
          data: resultRayon,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Rayon.findByPk(req.params.id, {})
      .then((resultRayon) => {
        if (!resultRayon) {
          return res.status(404).send({
            message: "Rayon Not Found",
          });
        }
        return res.status(200).send(resultRayon);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByGedung(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.Rayon.findAll({
      where: {
        id_gedung: req.params.id,
      },
      order: [["createdAt", "ASC"]],
    })
      .then((AscPeriods) => res.status(200).send(AscPeriods))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    if (!req.body.id_gedung || !req.body.nama_rayon || !req.body.id_murobbi) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.Rayon.create({
      id_gedung: req.body.id_gedung,
      nama_rayon: req.body.nama_rayon,
      id_murobbi: req.body.id_murobbi,
    })
      .then((resultRayon) => res.status(201).send(resultRayon))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    if (!req.body.nama_rayon) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.Rayon.findByPk(req.params.id, {})
      .then((resultRayon) => {
        if (!resultRayon) {
          return res.status(404).send({
            message: "Rayon Not Found",
          });
        }
        return resultRayon
          .update({
            id_gedung: req.body.id_gedung || resultRayon.id_gedung,
            nama_rayon: req.body.nama_rayon || resultRayon.nama_rayon,
            id_murobbi: req.body.id_murobbi || resultRayon.id_murobbi,
          })
          .then(() => res.status(200).send(resultRayon))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Rayon.findByPk(req.params.id)
      .then((resultRayon) => {
        if (!resultRayon) {
          return res.status(400).send({
            message: "Rayon Not Found",
          });
        }
        return resultRayon
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
