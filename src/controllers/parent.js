const Helper = require('../utils/helper');


module.exports = {
  login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Some values are missing" });
    }
    // if (!Helper.isValidEmail(req.body.email)) {
    //   return res.status(400).send({ 'message': 'Please enter a valid email address' });
    // }

    return req.db.Parent.findOne({
      include: [
        {
          model: req.db.Role,
          as: "Role",
          attributes: ["role_name", "slug"],
          required: true,
          include: [
            {
              model: req.db.RolePermission,
              as: "RolePermission",
              attributes: ["role_id", "permission_id"],
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: "Permission",
                  attributes: ["module", "permission_name", "slug"],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      where: { username: req.body.username },
    })
      .then((resultParent) => {
        if (!resultParent) {
          return res
            .status(400)
            .send({ message: "The credentials you provided is incorrect" });
        }
        if (!Helper.comparePassword(resultParent.password, req.body.password)) {
          return res
            .status(400)
            .send({ message: "The credentials you provided is incorrect" });
        }

        const token = Helper.generateToken(resultParent.username, req.tenantId);

        const jsonUser = {
          iduser: resultParent.id,
          username: resultParent.username,
          grade: "ADMIN",
          nama: resultParent.nama,
          email: resultParent.email,
          parent: resultParent,
        };
        const user = Helper.strEncode(JSON.stringify(jsonUser));

        return res.status(200).send({ token, user });
      })
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return req.db.Parent.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultParent) => res.status(200).send(resultParent))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listParentAktif(req, res) {
    return req.db.Parent.findAll({
      where: { status: "t" },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultParent) => res.status(200).send(resultParent))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listParentByRole(req, res) {
    return req.db.Parent.findAll({
      include: [
        {
          model: req.db.Role,
          as: "Role",
          attributes: ["role_name", "slug"],
          required: true,
          where: { slug: req.body.role },
          include: [
            {
              model: req.db.RolePermission,
              as: "RolePermission",
              attributes: ["role_id", "permission_id"],
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: "Permission",
                  attributes: ["module", "permission_name", "slug"],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultParent) => res.status(200).send(resultParent))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Parent.findByPk(req.params.id, {})
      .then((resultParent) => {
        if (!resultParent) {
          return res.status(404).send({
            message: "Parent Not Found",
          });
        }
        return res.status(200).send(resultParent);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    if (
      !req.body.roleId ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email ||
      !req.body.nama
    ) {
      return res.status(400).send({ message: "Some values are missing" });
    }

    const hashPassword = Helper.hashPassword(req.body.password);

    return req.db.Parent.create({
      role_id: req.body.roleId,
      username: req.body.username,
      email: req.body.email,
      nama: req.body.nama,
      password: hashPassword,
    })
      .then((resultParent) => res.status(201).send(resultParent))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.Parent.findByPk(req.params.id, {})
      .then((resultParent) => {
        if (!resultParent) {
          return res.status(404).send({
            message: "Parent Not Found",
          });
        }
        return resultParent
          .update({
            role_id: req.body.role_id || resultParent.role_id,
            username: req.body.username || resultParent.username,
            password: req.body.password
              ? Helper.hashPassword(req.body.password)
              : resultParent.password,
            nama: req.body.nama || resultParent.nama,
            nama_ar: req.body.telepon || resultParent.nama_ar,
            email: req.body.email || resultParent.email,
            active: req.body.active || resultParent.active,
          })
          .then(() => res.status(200).send(resultParent))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Parent.findByPk(req.params.id)
      .then((resultParent) => {
        if (!resultParent) {
          return res.status(400).send({
            message: "Parent Not Found",
          });
        }
        return resultParent.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};