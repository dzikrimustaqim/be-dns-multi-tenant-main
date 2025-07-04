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
            nama_lokasi: {
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
        ["urut", "ASC"],
        ["createdAt", "DESC"],
      ],
    };

    console.log("QUERY ", query);
    const count = await req.db.LokasiUjian.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.LokasiUjian.findAll(query)
      .then((resultLokasiUjian) => {
        res.status(200).send({
          totalrows: count,
          data: resultLokasiUjian,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.LokasiUjian.findByPk(req.params.id, {})
      .then((resultLokasiUjian) => {
        if (!resultLokasiUjian) {
          return res.status(404).send({
            message: "LokasiUjian Not Found",
          });
        }
        return res.status(200).send(resultLokasiUjian);
      })
      .catch((error) => res.status(400).send(error));
  },

  getLokasiUjianAktif(req, res) {
    return req.db.LokasiUjian.findAll({
      where: { active: "t" },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLokasiUjian) => res.status(200).send(resultLokasiUjian))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  add(req, res) {
    const isActive = req.body.active === true ? true : false;

    return req.db.LokasiUjian.create({
      nama_lokasi: req.body.nama_lokasi,
      urut: req.body.urut,
      active: isActive,
    })
      .then((resultLokasiUjian) => res.status(201).send(resultLokasiUjian))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  update(req, res) {
    console.log("req.body", req.body);
    const isActive = req.body.active === true ? true : false;
    return req.db.LokasiUjian.findByPk(req.params.id, {})
      .then((resultLokasiUjian) => {
        if (!resultLokasiUjian) {
          return res.status(404).send({
            message: "LokasiUjian Not Found",
          });
        }
        return resultLokasiUjian
          .update({
            nama_lokasi: req.body.nama_lokasi || resultLokasiUjian.nama_lokasi,
            urut: req.body.urut || resultLokasiUjian.urut,
            active: isActive,
          })
          .then(() => res.status(200).send(resultLokasiUjian))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.LokasiUjian.findByPk(req.params.id)
      .then((resultLokasiUjian) => {
        if (!resultLokasiUjian) {
          return res.status(400).send({
            message: "LokasiUjian Not Found",
          });
        }
        return resultLokasiUjian.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
