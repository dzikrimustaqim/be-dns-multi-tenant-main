module.exports = {
  list(req, res) {
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const module = req.query.module;
    const id_user = req.query.id_user;

    let whereStatement = {};

    if (module) {
      whereStatement["module"] = module;
    }

    if (id_user) {
      whereStatement["id_user"] = id_user;
    }

    return req.db.LogActivity.findAll({
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
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLogActivity) => res.status(200).send(resultLogActivity))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByInstansi(req, res) {
    return req.db.LogActivity.findAll({
      where: { id_instansi: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLogActivity) => res.status(200).send(resultLogActivity))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.LogActivity.findByPk(req.params.id, {})
      .then((resultLogActivity) => {
        if (!resultLogActivity) {
          return res.status(404).send({
            message: "LogActivity Not Found",
          });
        }
        return res.status(200).send(resultLogActivity);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByKode(req, res) {
    return req.db.LogActivity.findOne({
      where: { kode: req.body.kode },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultLogActivity) => res.status(200).send(resultLogActivity))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    console.log("BODY", req.body);
    const ip = req.ip;
    return req.db.LogActivity.create({
      log_level: req.body.log_level,
      module: req.body.module,
      message: req.body.message,
      id_user: req.body.id_user,
      ip_address: ip,
      user_agent: req.body.user_agent,
    })
      .then((resultLogActivity) => res.status(201).send(resultLogActivity))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.LogActivity.findByPk(req.params.id, {})
      .then((resultLogActivity) => {
        if (!resultLogActivity) {
          return res.status(404).send({
            message: "LogActivity Not Found",
          });
        }
        return resultLogActivity
          .update({
            nama_LogActivity:
              req.body.nama_LogActivity || resultLogActivity.nama_LogActivity,
            urut: req.body.urut || resultLogActivity.urut,
          })
          .then(() => res.status(200).send(resultLogActivity))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.LogActivity.findByPk(req.params.id)
      .then((resultLogActivity) => {
        if (!resultLogActivity) {
          return res.status(400).send({
            message: "LogActivity Not Found",
          });
        }
        return resultLogActivity.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
