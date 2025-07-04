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
            name: {
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
      order: [["urut", "ASC"]],
    };

    const count = await req.db.Berkas.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Berkas.findAll(query)
      .then((resultBerkas) => {
        res.status(200).send({
          totalrows: count,
          data: resultBerkas,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getBerkasAktif(req, res) {
    return req.db.Berkas.findOne({
      where: { active: true },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultBerkas) => res.status(200).send(resultBerkas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getAllSiswaBerkas(req, res) {
    return req.db.Berkas.findAll({
      where: { active: true },
      include: [
        {
          model: req.db.DokumenSyarat,
          as: "dokumen",
          required: false,
          where: { id_siswa: req.params.idsiswa },
        },
      ],
      order: [
        ["urut", "ASC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultBerkas) => res.status(200).send(resultBerkas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Berkas.findByPk(req.params.id, {})
      .then((resultBerkas) => {
        if (!resultBerkas) {
          return res.status(404).send({
            message: "Berkas Not Found",
          });
        }
        return res.status(200).send(resultBerkas);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    console.log(req.body);
    if (!req.body.nama_dokumen) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.Berkas.create({
      nama_dokumen: req.body.nama_dokumen,
      jumlah: req.body.jumlah,
      urut: req.body.urut,
      mandatory: req.body.mandatory,
    })
      .then((resultBerkas) => res.status(201).send(resultBerkas))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log(req.body);
    if (!req.body.nama_dokumen) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    return req.db.Berkas.findByPk(req.params.id)
      .then((resultBerkas) => {
        if (!resultBerkas) {
          return res.status(400).send({
            message: "Berkas Not Found",
          });
        }
        console.log(resultBerkas);

        return resultBerkas.update({
          nama_dokumen: req.body.nama_dokumen,
          jumlah: req.body.jumlah,
          urut: req.body.urut,
          mandatory: req.body.mandatory,
        })
          .then((resultBerkas) => res.status(201).send(resultBerkas))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Berkas.findByPk(req.params.id)
      .then((resultBerkas) => {
        if (!resultBerkas) {
          return res.status(400).send({
            message: "Berkas Not Found",
          });
        }
        console.log(resultBerkas);

        return resultBerkas.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
