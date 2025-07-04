const { Sequelize } = require("sequelize");
const Helper = require("../utils/helper");

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
            nama_kelas: {
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
          as: "tingkatkelas",
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
        [{ model: req.db.Tingkat, as: "tingkatkelas" }, "urut", "ASC"],
        ["nama_kelas", "ASC"],
      ],
    };

    const count = await req.db.Kelas.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Kelas.findAll(query)
      .then((Kelas) => {
        res.status(200).send({
          totalrows: count,
          data: Kelas,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Kelas.findByPk(req.params.id, {
      include: [
        {
          model: req.db.Tingkat,
          as: "tingkatkelas",
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
    })
      .then((Kelas) => {
        if (!Kelas) {
          return res.status(404).send({
            message: "Kelas Not Found",
          });
        }
        return res.status(200).send(Kelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Kelas.create({
      id_tingkat: req.body.id_tingkat,
      kode_kelas: req.body.kode_kelas,
      nama_kelas: req.body.nama_kelas,
      nama_kelas_ar: req.body.nama_kelas_ar,
    })
      .then((Kelas) => res.status(201).send(Kelas))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Kelas.findByPk(req.params.id, {})
      .then((Kelas) => {
        if (!Kelas) {
          return res.status(404).send({
            message: "Kelas Not Found",
          });
        }
        return Kelas.update({
          tingkat: req.body.tingkat || Kelas.tingkat,
          kode_kelas: req.body.kode_kelas || Kelas.kode_kelas,
          nama_kelas: req.body.nama_kelas || Kelas.nama_kelas,
          nama_kelas_ar: req.body.nama_kelas_ar || Kelas.nama_kelas_ar,
        })
          .then(() => res.status(200).send(Kelas))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Kelas.findByPk(req.params.id)
      .then((Kelas) => {
        if (!Kelas) {
          return res.status(400).send({
            message: "Kelas Not Found",
          });
        }
        return Kelas.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
