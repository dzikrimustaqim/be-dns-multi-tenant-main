// const GelombangPendaftaran = require("../models").GelombangPendaftaran;
// const TahunAjaran = require("../models").TahunAjaran;

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
      order: [["name", "ASC"]],
    };

    const count = await req.db.GelombangPendaftaran.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.GelombangPendaftaran.findAll(query)
      .then((GelombangPendaftaran) => {
        res.status(200).send({
          totalrows: count,
          data: GelombangPendaftaran,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getGelombangPendaftaranAktif(req, res) {
    return req.db.GelombangPendaftaran.findOne({
      include: [
        {
          model: req.db.TahunAjaran,
          as: "Periode",
          attributes: ["name"],
          required: true,
          where: { ppsb: true },
        },
      ],
      where: { active: true },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((GelombangPendaftaran) =>
        res.status(200).send(GelombangPendaftaran)
      )
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getGelombangPendaftaranByTahunAjaran(req, res) {
    return req.db.GelombangPendaftaran.findAll({
      include: [
        {
          model: req.db.TahunAjaran,
          as: "Periode",
          attributes: ["name"],
          required: true,
          where: { name: req.params.tahun },
        },
      ],
      where: {},
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((GelombangPendaftaran) =>
        res.status(200).send(GelombangPendaftaran)
      )
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getAllGelombangPendaftaranCurrentPeriod(req, res) {
    return req.db.GelombangPendaftaran.findAll({
      include: [
        {
          model: req.db.TahunAjaran,
          as: "Periode",
          attributes: ["name"],
          required: true,
          where: { ppsb: true },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((GelombangPendaftaran) =>
        res.status(200).send(GelombangPendaftaran)
      )
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.GelombangPendaftaran.findByPk(req.params.id, {})
      .then((GelombangPendaftaran) => {
        if (!GelombangPendaftaran) {
          return res.status(404).send({
            message: "GelombangPendaftaran Not Found",
          });
        }
        return res.status(200).send(GelombangPendaftaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    console.log(req.body);
    if (
      !req.body.id_periode ||
      !req.body.title ||
      !req.body.start_date ||
      !req.body.end_date ||
      !req.body.ujian_tulis_date ||
      !req.body.ujian_lisan_date ||
      !req.body.pengumuman_kelulusan_date
    ) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    const isReqActive = req.body.active === true ? true : false;

    if (isReqActive) {
      const activeExist = await req.db.GelombangPendaftaran.findOne({
        where: {
          active: true,
        },
      });

      if (activeExist) {
        // auto unactivate periode
        const unActive = await activeExist.update({
          active: false,
        });
      }
    }

    return req.db.GelombangPendaftaran.create({
      id_tahun_ajaran: req.body.id_periode,
      title: req.body.title,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      ujian_tulis_date: req.body.ujian_tulis_date,
      ujian_lisan_date: req.body.ujian_lisan_date,
      pengumuman_kelulusan_date: req.body.pengumuman_kelulusan_date,
      active: req.body.active,
    })
      .then((GelombangPendaftaran) =>
        res.status(201).send(GelombangPendaftaran)
      )
      .catch((error) => res.status(400).send(error));
  },

  async update(req, res) {
    console.log(req.body);
    if (
      !req.body.id_periode ||
      !req.body.title ||
      !req.body.start_date ||
      !req.body.end_date ||
      !req.body.ujian_tulis_date ||
      !req.body.ujian_lisan_date ||
      !req.body.pengumuman_kelulusan_date
    ) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    const isReqActive = req.body.active === true ? true : false;

    if (isReqActive) {
      const activeExist = await req.db.GelombangPendaftaran.findOne({
        where: {
          active: true,
        },
      });

      if (activeExist) {
        // auto unactivate periode
        const unActive = await activeExist.update({
          active: false,
        });
      }
    }

    return req.db.GelombangPendaftaran.findByPk(req.params.id)
      .then((GelombangPendaftaran) => {
        if (!GelombangPendaftaran) {
          return res.status(400).send({
            message: "GelombangPendaftaran Not Found",
          });
        }
        console.log(GelombangPendaftaran);

        return GelombangPendaftaran.update({
          id_tahun_ajaran: req.body.id_periode,
          title: req.body.title,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          ujian_tulis_date: req.body.ujian_tulis_date,
          ujian_lisan_date: req.body.ujian_lisan_date,
          pengumuman_kelulusan_date: req.body.pengumuman_kelulusan_date,
          active: req.body.active,
        })
          .then((GelombangPendaftaran) =>
            res.status(201).send(GelombangPendaftaran)
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  __update(req, res) {
    console.log("req.body", req.body);
    const status =
      req.body.active === false
        ? "f"
        : req.body.active === true
        ? "t"
        : req.body.active;
    // cek if other is active
    return req.db.GelombangPendaftaran.findOne({ where: { active: "t" } })
      .then((ResGelombangPendaftaran) => {
        if (
          !ResGelombangPendaftaran ||
          ResGelombangPendaftaran.id == req.params.id ||
          status === "f" ||
          !req.body.active
        ) {
          return GelombangPendaftaran.findByPk(req.params.id, {})
            .then((GelombangPendaftaran) => {
              if (!GelombangPendaftaran) {
                return res.status(404).send({
                  message: "GelombangPendaftaran Not Found",
                });
              }
              return GelombangPendaftaran.update({
                name: req.body.name || GelombangPendaftaran.name,
                active: status || GelombangPendaftaran.active,
              })
                .then(() => res.status(200).send(GelombangPendaftaran))
                .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
        }
        return res.status(400).send({
          message: "Masih ada tahun ajaran aktif",
        });
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(400).send(error);
      });
  },

  delete(req, res) {
    return req.db.GelombangPendaftaran.findByPk(req.params.id)
      .then((GelombangPendaftaran) => {
        if (!GelombangPendaftaran) {
          return res.status(400).send({
            message: "GelombangPendaftaran Not Found",
          });
        }
        console.log(GelombangPendaftaran);
        if (GelombangPendaftaran.active === true) {
          return res.status(400).send({
            message: "Cannot delete active GelombangPendaftaran",
          });
        }
        return GelombangPendaftaran.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
