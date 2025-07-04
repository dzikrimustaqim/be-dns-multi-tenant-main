module.exports = {
  list(req, res) {
    return req.db.Permission.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultPermission) => res.status(200).send(resultPermission))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listPermissionAktif(req, res) {
    return req.db.Permission.findAll({
      where: { active: "t" },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultPermission) => res.status(200).send(resultPermission))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listRolePermission(req, res) {
    return req.db.Permission.findAll({
      include: [
        {
          model: req.db.RolePermission,
          as: "RolePermission",
          attributes: ["role_id", "permission_id"],
          required: false,
          where: { role_id: req.params.id },
        },
      ],
      where: { active: "t" },
      order: [
        ["module", "ASC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultPermission) => res.status(200).send(resultPermission))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Permission.findByPk(req.params.id, {})
      .then((resultPermission) => {
        if (!resultPermission) {
          return res.status(404).send({
            message: "Permission Not Found",
          });
        }
        return res.status(200).send(resultPermission);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Permission.create({
      Permission_name: req.body.Permission_name,
      editable: req.body.editable,
    })
      .then((resultPermission) => res.status(201).send(resultPermission))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Permission.findByPk(req.params.id, {})
      .then((resultPermission) => {
        if (!resultPermission) {
          return res.status(404).send({
            message: "Permission Not Found",
          });
        }
        return resultPermission.update({
          Permission_name:
            req.body.Permission_name || resultPermission.Permission_name,
          editable: req.body.editable || resultPermission.editable,
        })
          .then(() => res.status(200).send(resultPermission))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Permission.findByPk(req.params.id)
      .then((resultPermission) => {
        if (!resultPermission) {
          return res.status(400).send({
            message: "Permission Not Found",
          });
        }
        return resultPermission.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
