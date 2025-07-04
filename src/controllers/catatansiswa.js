const { Sequelize } = require("sequelize");

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
            nama_lengkap: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
          {
            regnumber: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      include: [
        {
          model: req.db.Siswa,
          as: "Siswa",
          required: true,
          where: whereStatement,
        },
        "Siswa",
        {
          model: req.db.Proguser,
          as: "Proguser",
          required: false,
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
      // where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.CatatanSiswa.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.CatatanSiswa.findAll(query)
      .then((resultCatatanSiswa) => {
        res.status(200).send({
          totalrows: count,
          data: req.db.CatatanSiswa,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.CatatanSiswa.findByPk(req.params.id, {})
      .then((resultCatatanSiswa) => {
        if (!resultCatatanSiswa) {
          return res.status(404).send({
            message: "CatatanSiswa Not Found",
          });
        }
        return res.status(200).send(resultCatatanSiswa);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    if (
      !req.body.periode_id ||
      !req.body.semester ||
      !req.body.id_siswa ||
      !req.body.guru_id ||
      !req.body.tanggal
    ) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.CatatanSiswa.create({
      tahun_ajaran_id: req.body.periode_id,
      semester: req.body.semester,
      siswa_id: req.body.id_siswa,
      guru_id: req.body.guru_id,
      tanggal: req.body.tanggal,
      catatan_positif: req.body.catatan_positif,
      catatan_negatif: req.body.catatan_negatif,
    })
      .then((resultCatatanSiswa) => res.status(201).send(resultCatatanSiswa))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    if (!req.body.nama_CatatanSiswa) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.CatatanSiswa.findByPk(req.params.id, {})
      .then((resultCatatanSiswa) => {
        if (!resultCatatanSiswa) {
          return res.status(404).send({
            message: "CatatanSiswa Not Found",
          });
        }
        return resultCatatanSiswa
          .update({
            nama_CatatanSiswa:
              req.body.nama_CatatanSiswa ||
              resultCatatanSiswa.nama_CatatanSiswa,
          })
          .then(() => res.status(200).send(resultCatatanSiswa))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.CatatanSiswa.findByPk(req.params.id)
      .then((resultCatatanSiswa) => {
        if (!resultCatatanSiswa) {
          return res.status(400).send({
            message: "CatatanSiswa Not Found",
          });
        }
        return resultCatatanSiswa.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
