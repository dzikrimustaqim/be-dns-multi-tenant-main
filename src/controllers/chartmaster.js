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
            account_name: {
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

    const count = await req.db.ChartMaster.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.ChartMaster.findAll(query)
      .then((resultChartMaster) => {
        res.status(200).send({
          totalrows: count,
          data: resultChartMaster,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.ChartMaster.findByPk(req.params.id, {})
      .then((resultChartMaster) => {
        if (!resultChartMaster) {
          return res.status(404).send({
            message: "ChartMaster Not Found",
          });
        }
        return res.status(200).send(resultChartMaster);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriode(req, res) {
    return req.db.ChartMaster.findAll({
      where: { id_periode: req.params.periode },
      include: [
        {
          model: req.db.JenisBayar,
          as: "PayType",
          required: false,
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultChartMaster) => res.status(200).send(resultChartMaster))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getChartMasterRegistrasiByPeriode(req, res) {
    return req.db.ChartMaster.findOne({
      where: { id_periode: req.params.periode },
      include: [
        {
          model: req.db.JenisBayar,
          as: "PayType",
          required: true,
          where: { kode_bayar: "REGISTRASI" },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultChartMaster) => res.status(200).send(resultChartMaster))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getChartMasterRegistrasiByAktivePeriode(req, res) {
    return req.db.ChartMaster.findOne({
      include: [
        {
          model: req.db.JenisBayar,
          as: "PayType",
          required: true,
          where: { kode_bayar: "REGISTRASI" },
        },
        {
          model: req.db.TahunAjaran,
          as: "periode",
          required: true,
          where: { ppsb: true },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultChartMaster) => res.status(200).send(resultChartMaster))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.ChartMaster.create({
      id_periode: req.body.id_periode,
      id_jenis_bayar: req.body.id_jenis_bayar,
      description: req.body.description,
      jumlah: req.body.jumlah,
    })
      .then((resultChartMaster) => res.status(201).send(resultChartMaster))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.ChartMaster.findByPk(req.params.id, {})
      .then((resultChartMaster) => {
        if (!resultChartMaster) {
          return res.status(404).send({
            message: "ChartMaster Not Found",
          });
        }
        return resultChartMaster
          .update({
            id_periode: req.body.id_periode || resultChartMaster.id_periode,
            id_jenis_bayar:
              req.body.id_jenis_bayar || resultChartMaster.id_jenis_bayar,
            description: req.body.description || resultChartMaster.description,
            jumlah: req.body.jumlah || resultChartMaster.jumlah,
          })
          .then(() => res.status(200).send(resultChartMaster))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.ChartMaster.findByPk(req.params.id)
      .then((resultChartMaster) => {
        if (!resultChartMaster) {
          return res.status(400).send({
            message: "ChartMaster Not Found",
          });
        }
        return resultChartMaster.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
