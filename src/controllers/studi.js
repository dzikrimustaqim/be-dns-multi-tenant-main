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
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.Studi.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Studi.findAll(query)
      .then((resultStudi) => {
        res.status(200).send({
          totalrows: count,
          data: resultStudi,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Studi.findByPk(req.params.id, {})
      .then((resultStudi) => {
        if (!resultStudi) {
          return res.status(404).send({
            message: "Studi Not Found",
          });
        }
        return res.status(200).send(resultStudi);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Studi.create({
      kode_studi: req.body.kode_studi,
      nama_studi: req.body.nama_studi,
      nama_studi_en: req.body.nama_studi_en,
      nama_studi_ar: req.body.nama_studi_ar,
      relasi_nilai: req.body.relasi_nilai,
      is_nilai_harian: req.body.is_nilai_harian,
      is_nilai_mid: req.body.is_nilai_mid,
      is_nilai_semester: req.body.is_nilai_semester,
    })
      .then((resultStudi) => res.status(201).send(resultStudi))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Studi.findByPk(req.params.id, {})
      .then((resultStudi) => {
        if (!resultStudi) {
          return res.status(404).send({
            message: "Studi Not Found",
          });
        }
        return resultStudi.update({
          kode_studi: req.body.kode_studi || resultStudi.kode_studi,
          nama_studi: req.body.nama_studi || resultStudi.nama_studi,
          nama_studi_en: req.body.nama_studi_en || resultStudi.nama_studi_en,
          nama_studi_ar: req.body.nama_studi_ar || resultStudi.nama_studi_ar,
          relasi_nilai: req.body.relasi_nilai,
          is_nilai_harian: req.body.is_nilai_harian,
          is_nilai_mid: req.body.is_nilai_mid,
          is_nilai_semester: req.body.is_nilai_semester,
        })
          .then(() => res.status(200).send(resultStudi))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Studi.findByPk(req.params.id)
      .then((resultStudi) => {
        if (!resultStudi) {
          return res.status(400).send({
            message: "Studi Not Found",
          });
        }
        return resultStudi.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
