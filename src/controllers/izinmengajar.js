module.exports = {
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;

    let whereStatement = {};

    if (searchTerm) {
      whereStatement = {};
    }

    const query = {
      include: [
        {
          model: req.db.Proguser,
          as: "Guru",
          required: false,
          include: [
            {
              model: req.db.StaffProfile,
              as: "userProfile",
              required: true,
            },
          ],
        },
        {
          model: req.db.Proguser,
          as: "GuruPengganti",
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
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.IzinMengajar.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.IzinMengajar.findAll(query)
      .then((resultIzinMengajar) => {
        res.status(200).send({
          totalrows: count,
          data: resultIzinMengajar,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getByInstansi(req, res) {
    return req.db.IzinMengajar.findAll({
      where: { id_instansi: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultIzinMengajar) => res.status(200).send(resultIzinMengajar))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.IzinMengajar.findByPk(req.params.id, {})
      .then((resultIzinMengajar) => {
        if (!resultIzinMengajar) {
          return res.status(404).send({
            message: "IzinMengajar Not Found",
          });
        }
        return res.status(200).send(resultIzinMengajar);
      })
      .catch((error) => res.status(400).send(error));
  },

  getGuruPengganti(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr =
      "SELECT * from izin_mengajar a INNER JOIN proguser b ON \
      a.guru_id=b.id INNER JOIN staff_profile c ON b.id=c.id_user \
      WHERE a.guru_pengganti_id=(:guru_pengganti_id) \
      AND a.start_date <= (:current_date) AND a.end_date >= (:current_date) AND a.status='PERMITTED';";

    return req.db.IzinMengajar.sequelize
      .query(queryStr, {
        replacements: {
          guru_pengganti_id: req.body.guru_pengganti_id,
          current_date: req.body.current_date,
        },
        type: QueryTypes.SELECT,
      })
      .then((resultIzinMengajar) => {
        return res.status(200).send(resultIzinMengajar);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  add(req, res) {
    console.log(req.body);
    return req.db.IzinMengajar.create({
      kategori: req.body.kategori,
      guru_id: req.body.guru_id,
      // guru_pengganti_id:req.body.guru_pengganti_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      keterangan: req.body.keterangan,
    })
      .then((resultIzinMengajar) => res.status(201).send(resultIzinMengajar))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.IzinMengajar.findByPk(req.params.id, {})
      .then((resultIzinMengajar) => {
        if (!resultIzinMengajar) {
          return res.status(404).send({
            message: "IzinMengajar Not Found",
          });
        }
        if (
          resultIzinMengajar.status !== null &&
          req.db.IzinMengajar.status != "P"
        ) {
          return res.status(404).send({
            message: "Cannot update Izin Mengajar",
          });
        }
        return resultIzinMengajar
          .update({
            kategori: req.body.kategori || resultIzinMengajar.kategori,
            guru_id: req.body.guru_id || resultIzinMengajar.guru_id,
            guru_pengganti_id:
              req.body.guru_pengganti_id ||
              resultIzinMengajar.guru_pengganti_id,
            start_date: req.body.start_date || resultIzinMengajar.start_date,
            end_date: req.body.end_date || resultIzinMengajar.end_date,
            keterangan: req.body.keterangan || resultIzinMengajar.keterangan,
          })
          .then(() => res.status(200).send(resultIzinMengajar))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  updateApproval(req, res) {
    console.log("req.body", req.body);

    return req.db.IzinMengajar.findByPk(req.params.id, {})
      .then((resultIzinMengajar) => {
        if (!resultIzinMengajar) {
          return res.status(404).send({
            message: "IzinMengajar Not Found",
          });
        }

        return resultIzinMengajar.update({
          status: req.body.status || resultIzinMengajar.status,
        })
          .then(() => res.status(200).send(resultIzinMengajar))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  updateGuruPengganti(req, res) {
    console.log("req.body", req.body);

    return req.db.IzinMengajar.findByPk(req.params.id, {})
      .then((resultIzinMengajar) => {
        if (!resultIzinMengajar) {
          return res.status(404).send({
            message: "IzinMengajar Not Found",
          });
        }

        return resultIzinMengajar
          .update({
            guru_pengganti_id:
              req.body.guru_pengganti_id ||
              resultIzinMengajar.guru_pengganti_id,
          })
          .then(() => res.status(200).send(resultIzinMengajar))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.IzinMengajar.findByPk(req.params.id)
      .then((resultIzinMengajar) => {
        if (!resultIzinMengajar) {
          return res.status(400).send({
            message: "IzinMengajar Not Found",
          });
        }
        return resultIzinMengajar.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
