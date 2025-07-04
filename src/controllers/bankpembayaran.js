// const BankPembayaran = require('../models').BankPembayaran;

module.exports = {
  list(req, res) {
    return req.db.BankPembayaran.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BankPembayaran) => res.status(200).send(BankPembayaran))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByInstansi(req, res) {
    return req.db.BankPembayaran.findAll({
      where: { id_instansi: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BankPembayaran) => res.status(200).send(BankPembayaran))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.BankPembayaran.findByPk(req.params.id, {})
      .then((BankPembayaran) => {
        if (!BankPembayaran) {
          return res.status(404).send({
            message: "BankPembayaran Not Found",
          });
        }
        return res.status(200).send(BankPembayaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByKode(req, res) {
    return req.db.BankPembayaran.findOne({
      where: { kode: req.body.kode },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((BankPembayaran) => res.status(200).send(BankPembayaran))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.BankPembayaran.create({
      kode: req.body.kode,
      nama: req.body.nama,
      cabang: req.body.cabang,
      nomor_rekening: req.body.nomor_rekening,
      atas_nama: req.body.atas_nama,
    })
      .then((BankPembayaran) => res.status(201).send(BankPembayaran))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.BankPembayaran.findByPk(req.params.id, {})
      .then((BankPembayaran) => {
        if (!BankPembayaran) {
          return res.status(404).send({
            message: "BankPembayaran Not Found",
          });
        }
        return BankPembayaran.update({
          kode: req.body.kode || BankPembayaran.kode,
          nama: req.body.nama || BankPembayaran.nama,
          cabang: req.body.cabang,
          nomor_rekening:
            req.body.nomor_rekening || BankPembayaran.nomor_rekening,
          atas_nama: req.body.atas_nama || BankPembayaran.atas_nama,
        })
          .then(() => res.status(200).send(BankPembayaran))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.BankPembayaran.findByPk(req.params.id)
      .then((BankPembayaran) => {
        if (!BankPembayaran) {
          return res.status(400).send({
            message: "BankPembayaran Not Found",
          });
        }
        return BankPembayaran.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
