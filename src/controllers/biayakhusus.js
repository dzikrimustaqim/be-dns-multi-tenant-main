// const BiayaKhusus = require('../models').BiayaKhusus;
// const BiayaKhususItem = require('../models').BiayaKhususItem;
const { Sequelize, QueryTypes } = require("sequelize");

module.exports = {
  list(req, res) {
    return req.db.BiayaKhusus.findAll({
      order: [
        ["urut", "ASC"],
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BiayaKhusus) => res.status(200).send(BiayaKhusus))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByInstansi(req, res) {
    return req.db.BiayaKhusus.findAll({
      where: { id_instansi: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BiayaKhusus) => res.status(200).send(BiayaKhusus))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.BiayaKhusus.findByPk(req.params.id, {})
      .then((BiayaKhusus) => {
        if (!BiayaKhusus) {
          return res.status(404).send({
            message: "BiayaKhusus Not Found",
          });
        }
        return res.status(200).send(BiayaKhusus);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySiswaId(req, res) {
    return req.db.BiayaKhusus.findAll({
      where: { id_siswa: req.params.id },
      include: ["GroupBiaya"],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BiayaKhusus) => res.status(200).send(BiayaKhusus))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.BiayaKhusus.create({
      id_siswa: req.body.id_siswa,
      id_group_biaya: req.body.id_group_biaya,
    })
      .then((BiayaKhusus) => res.status(201).send(BiayaKhusus))
      .catch((error) => res.status(400).send(error));
  },

  async addItemBiaya(req, res) {
    const item = await req.db.BiayaKhususItem.create({
      id_biaya_khusus: req.body.id_biaya_khusus,
      id_item_biaya: req.body.id_item_biaya,
      jumlah: req.body.jumlah,
    });

    const qryTotalJumlahBiaya =
      "UPDATE biaya_khusus SET jumlah=(SELECT SUM(b.jumlah) \
      FROM biaya_khusus_item b \
      WHERE b.id_biaya_khusus=(:biaya_khusus)) WHERE id=(:biaya_khusus)";

    const totalTagihanBulan = await req.db.BiayaKhususItem.sequelize.query(
      qryTotalJumlahBiaya,
      {
        replacements: {
          biaya_khusus: req.body.id_biaya_khusus,
        },
        type: QueryTypes.UPDATE,
      }
    );

    return res.status(200).send({
      data: item,
    });
  },

  listItemBiaya(req, res) {
    return req.db.iayaKhususItem
      .findAll({
        where: { id_biaya_khusus: req.params.id },
        include: ["ItemBiaya"],
        order: [
          ["createdAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      })
      .then((BiayaKhususItem) => res.status(200).send(BiayaKhususItem))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  async deleteItemBiaya(req, res) {
    const item = await req.db.BiayaKhususItem.findByPk(req.params.id);

    if (item) {
      const id_biaya_khusus = item.id_biaya_khusus;
      console.log("id_biaya_khusus", id_biaya_khusus);
      await item.destroy();

      const qryTotalJumlahBiaya =
        "UPDATE biaya_khusus SET jumlah=(SELECT SUM(b.jumlah) \
        FROM biaya_khusus_item b \
        WHERE b.id_biaya_khusus=(:biaya_khusus)) WHERE id=(:biaya_khusus)";

      const totalTagihanBulan = await req.db.BiayaKhususItem.sequelize.query(
        qryTotalJumlahBiaya,
        {
          replacements: {
            biaya_khusus: id_biaya_khusus,
          },
          type: QueryTypes.UPDATE,
        }
      );
    }

    return res.status(200).send({
      data: item,
    });
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.BiayaKhusus.findByPk(req.params.id, {})
      .then((BiayaKhusus) => {
        if (!BiayaKhusus) {
          return res.status(404).send({
            message: "BiayaKhusus Not Found",
          });
        }
        return BiayaKhusus.update({
          nama_BiayaKhusus:
            req.body.nama_BiayaKhusus || BiayaKhusus.nama_BiayaKhusus,
          urut: req.body.urut || BiayaKhusus.urut,
        })
          .then(() => res.status(200).send(BiayaKhusus))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  setActive(req, res) {
    console.log("req.body", req.body);

    return req.db.BiayaKhusus.findByPk(req.params.id, {})
      .then((BiayaKhusus) => {
        if (!BiayaKhusus) {
          return res.status(404).send({
            message: "BiayaKhusus Not Found",
          });
        }
        return BiayaKhusus.update({
          active: req.body.active == "Y" ? true : false,
        })
          .then(() => res.status(200).send(BiayaKhusus))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.BiayaKhusus.findByPk(req.params.id)
      .then((BiayaKhusus) => {
        if (!BiayaKhusus) {
          return res.status(400).send({
            message: "BiayaKhusus Not Found",
          });
        }
        return BiayaKhusus.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
