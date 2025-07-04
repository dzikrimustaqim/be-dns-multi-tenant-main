// const Biaya = require('../models').Biaya;
// const JenisBayar = require('../models').JenisBayar;

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
            nama_Biaya: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      include: [
        {
          model: req.db.Tingkat,
          as: "tingkatBiaya",
          required: true,
          include: [
            {
              model: req.db.Lembaga,
              as: "Lembaga",
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

    const count = await req.db.Biaya.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Biaya.findAll(query)
      .then((Biaya) => {
        res.status(200).send({
          totalrows: count,
          data: Biaya,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Biaya.findByPk(req.params.id, {})
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(404).send({
            message: "Biaya Not Found",
          });
        }
        return res.status(200).send(Biaya);
      })
      .catch((error) => res.status(400).send(error));
  },

  listAll(req, res) {
    return req.db.JenisBayar.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((JenisBayar) => res.status(200).send(JenisBayar))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getByPeriode(req, res) {
    return req.db.JenisBayar.findAll({
      include: [
        {
          model: req.db.Biaya,
          as: "biaya",
          required: false,
          where: { id_periode: req.params.periode },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((JenisBayar) => res.status(200).send(JenisBayar))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.Biaya.create({
      id_tingkat: req.body.id_tingkat,
      nama_Biaya: req.body.nama_Biaya,
      nama_Biaya_ar: req.body.nama_Biaya_ar,
    })
      .then((Biaya) => res.status(201).send(Biaya))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Biaya.findByPk(req.params.id, {})
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(404).send({
            message: "Biaya Not Found",
          });
        }
        return Biaya.update({
          tingkat: req.body.tingkat || Biaya.tingkat,
          nama_Biaya: req.body.nama_Biaya || Biaya.nama_Biaya,
          nama_Biaya_ar: req.body.nama_Biaya_ar || Biaya.nama_Biaya_ar,
        })
          .then(() => res.status(200).send(Biaya))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Biaya.findByPk(req.params.id)
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(400).send({
            message: "Biaya Not Found",
          });
        }
        return Biaya.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
