const BiayaTahunan = require("../models").BiayaTahunan;
const JenisBayar = require("../models").JenisBayar;
const TahunAjaran = require("../models").TahunAjaran;
const PaketPembayaran = require("../models").PaketPembayaran;
const Lembaga = require("../models").Lembaga;
const ItemBiayaTahunan = require("../models").ItemBiayaTahunan;

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
            nama_Biaya: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      include: [
        {
          model: PaketPembayaran,
          as: "TahunanPaketPembayaran",
          required: false,
        },
        "TahunanLembaga",
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await Biaya.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return BiayaTahunan.findAll(query)
      .then((BiayaTahunan) => {
        res.status(200).send({
          totalrows: count,
          data: BiayaTahunan,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return BiayaTahunan.findByPk(req.params.id, {
      include: [
        {
          model: ItemBiayaTahunan,
          as: "ItemBiayaTahunan",
          required: true,
          include: ["ItemsItemBiayaTahunan"],
        },
      ],
    })
      .then((BiayaTahunan) => {
        if (!BiayaTahunan) {
          return res.status(404).send({
            message: "Biaya Tahunan Not Found",
          });
        }
        return res.status(200).send(BiayaTahunan);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getBiayaTahunanByGroup(req, res) {
    return BiayaTahunan.findByPk(req.params.id, {
      include: [
        {
          model: ItemBiayaTahunan,
          as: "ItemBiayaTahunan",
          required: true,
          where: { id_group_biaya: req.params.groupid },
          include: ["ItemsItemBiayaTahunan"],
        },
      ],
    })
      .then((BiayaTahunan) => {
        if (!BiayaTahunan) {
          return res.status(404).send({
            message: "Biaya Tahunan Not Found",
          });
        }
        return res.status(200).send(BiayaTahunan);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getByLembagaAndPeriode(req, res) {
    return BiayaTahunan.findAll({
      where: {
        id_periode: req.params.periode,
        id_lembaga: req.params.id_lembaga,
      },
      include: [
        {
          model: PaketPembayaran,
          as: "TahunanPaketPembayaran",
          required: false,
        },
        {
          model: Lembaga,
          as: "TahunanLembaga",
          required: false,
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BiayaTahunan) => res.status(200).send(BiayaTahunan))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getBiayaRegistrasiByPeriode(req, res) {
    return Biaya.findOne({
      where: { id_periode: req.params.periode },
      include: [
        {
          model: JenisBayar,
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
      .then((Biaya) => res.status(200).send(Biaya))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getBiayaRegistrasiByAktivePeriode(req, res) {
    return Biaya.findOne({
      include: [
        {
          model: JenisBayar,
          as: "PayType",
          required: true,
          where: { kode_bayar: "REGISTRASI" },
        },
        {
          model: TahunAjaran,
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
      .then((Biaya) => res.status(200).send(Biaya))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return BiayaTahunan.create({
      id_periode: req.body.id_periode,
      id_paket_pembayaran: req.body.id_paket_pembayaran,
      id_lembaga: req.body.id_lembaga || null,
      total_biaya: req.body.total_biaya || 0,
    })
      .then((BiayaTahunan) => res.status(201).send(BiayaTahunan))
      .catch((error) => res.status(400).send(error));
  },

  addItem(req, res) {
    return ItemBiayaTahunan.create({
      id_biaya_tahunan: req.body.id_biaya_tahunan,
      id_group_biaya: req.body.id_group_biaya,
      id_item_biaya: req.body.id_item_biaya,
      nilai_biaya: req.body.nilai_biaya || 0,
    })
      .then((ItemBiayaTahunan) => res.status(201).send(ItemBiayaTahunan))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return Biaya.findByPk(req.params.id, {})
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(404).send({
            message: "Biaya Not Found",
          });
        }
        return Biaya.update({
          id_periode: req.body.id_periode || Biaya.id_periode,
          id_jenis_bayar: req.body.id_jenis_bayar || Biaya.id_jenis_bayar,
          description: req.body.description || Biaya.description,
          jumlah: req.body.jumlah || Biaya.jumlah,
        })
          .then(() => res.status(200).send(Biaya))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Biaya.findByPk(req.params.id)
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(400).send({
            message: "Biaya Not Found",
          });
        }
        return Biaya.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  deleteItemBiaya(req, res) {
    return ItemBiayaTahunan.findByPk(req.params.id)
      .then((ItemBiayaTahunan) => {
        if (!ItemBiayaTahunan) {
          return res.status(400).send({
            message: "Biaya Not Found",
          });
        }
        return ItemBiayaTahunan.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
