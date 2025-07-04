// const ItemBiaya = require('../models').ItemBiaya;

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
            item_name: {
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

    const count = await req.db.ItemBiaya.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.ItemBiaya.findAll(query)
      .then((ItemBiaya) => {
        res.status(200).send({
          totalrows: count,
          data: ItemBiaya,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.ItemBiaya.findByPk(req.params.id, {})
      .then((ItemBiaya) => {
        if (!ItemBiaya) {
          return res.status(404).send({
            message: "ItemBiaya Not Found",
          });
        }
        return res.status(200).send(ItemBiaya);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriode(req, res) {
    return req.db.ItemBiaya.findAll({
      where: { id_periode: req.params.periode },
      include: [
        {
          model: JenisBayar,
          as: "PayType",
          required: false,
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((ItemBiaya) => res.status(200).send(ItemBiaya))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getItemBiayaRegistrasiByPeriode(req, res) {
    return req.db.ItemBiaya.findOne({
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
      .then((ItemBiaya) => res.status(200).send(ItemBiaya))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getItemBiayaRegistrasiByAktivePeriode(req, res) {
    return req.db.ItemBiaya.findOne({
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
      .then((ItemBiaya) => res.status(200).send(ItemBiaya))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.ItemBiaya.create({
      item_name: req.body.item_name,
    })
      .then((ItemBiaya) => res.status(201).send(ItemBiaya))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.ItemBiaya.findByPk(req.params.id, {})
      .then((ItemBiaya) => {
        if (!ItemBiaya) {
          return res.status(404).send({
            message: "ItemBiaya Not Found",
          });
        }
        return ItemBiaya.update({
          item_name: req.body.item_name || ItemBiaya.item_name,
        })
          .then(() => res.status(200).send(ItemBiaya))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.ItemBiaya.findByPk(req.params.id)
      .then((ItemBiaya) => {
        if (!ItemBiaya) {
          return res.status(400).send({
            message: "ItemBiaya Not Found",
          });
        }
        return ItemBiaya.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
