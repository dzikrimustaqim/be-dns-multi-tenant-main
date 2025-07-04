module.exports = {
  list(req, res) {
    return req.db.Walikelas.findAll({
      include: ["User", "TahunAjaran", "Kelas"],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultWalikelas) => res.status(200).send(resultWalikelas))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  async getWalikelasByPeriode(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const periode = req.query.periode_id;

    let whereStatement = {
      periode_id: periode,
    };

    let whereNameStatement = "";

    if (searchTerm) {
      whereNameStatement = {
        [Sequelize.Op.and]: [
          {
            real_name: {
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
          as: "User",
          required: true,
          include: [
            {
              model: req.db.StaffProfile,
              as: "userProfile",
              required: true,
              where: whereNameStatement,
            },
          ],
        },
        "TahunAjaran",
        "Kelas",
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.Walikelas.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Walikelas.findAll(query)
      .then((resultWalikelas) => {
        res.status(200).send({
          totalrows: count,
          data: resultWalikelas,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Walikelas.findByPk(req.params.id, {})
      .then((resultWalikelas) => {
        if (!resultWalikelas) {
          return res.status(404).send({
            message: "Walikelas Not Found",
          });
        }
        return res.status(200).send(resultWalikelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.Walikelas.findOne({ where: { slug: req.body.slug } })
      .then((resultWalikelas) => {
        if (!resultWalikelas) {
          return res.status(404).send({
            message: "Walikelas Not Found",
          });
        }
        return res.status(200).send(resultWalikelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriodeAndKelas(req, res) {
    return req.db.Walikelas.findOne({
      include: [
        {
          model: req.db.Proguser,
          as: "User",
          required: true,
          include: [
            {
              model: req.db.StaffProfile,
              as: "userProfile",
              required: true,
            },
          ],
        },
        "TahunAjaran",
        "Kelas",
      ],
      where: { periode_id: req.params.periode, kelas_id: req.params.kelas },
    })
      .then((resultWalikelas) => {
        if (!resultWalikelas) {
          return res.status(404).send({
            message: "Walikelas Not Found",
          });
        }
        return res.status(200).send(resultWalikelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Walikelas.create({
      periode_id: req.body.periode_id,
      proguser_id: req.body.proguser_id,
      kelas_id: req.body.kelas_id,
    })
      .then((resultWalikelas) => res.status(201).send(resultWalikelas))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Walikelas.findByPk(req.params.id, {})
      .then((resultWalikelas) => {
        if (!resultWalikelas) {
          return res.status(404).send({
            message: "Walikelas Not Found",
          });
        }
        return resultWalikelas
          .update({
            periode_id: req.body.periode_id || resultWalikelas.periode_id,
            proguser_id: req.body.proguser_id || resultWalikelas.proguser_id,
            kelas_id: req.body.kelas_id || resultWalikelas.kelas_id,
          })
          .then(() => res.status(200).send(resultWalikelas))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Walikelas.findByPk(req.params.id)
      .then((resultWalikelas) => {
        if (!resultWalikelas) {
          return res.status(400).send({
            message: "Walikelas Not Found",
          });
        }
        return resultWalikelas.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
