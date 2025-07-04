const Helper = require("../utils/helper");
const { Sequelize } = require("sequelize");

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
            title: {
              [Sequelize.Op.iLike]: "%" + searchTerm + "%",
            },
          },
        ],
      };
    }

    const query = {
      include: ["Siswa"],
      offset: offset,
      limit: limit,
      where: whereStatement,
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    const count = await req.db.Invoice.count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Invoice.findAll(query)
      .then((Invoice) => {
        res.status(200).send({
          totalrows: count,
          data: Invoice,
        });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Invoice.findByPk(req.params.id, {})
      .then((Invoice) => {
        if (!Invoice) {
          return res.status(404).send({
            message: "Invoice Not Found",
          });
        }
        return res.status(200).send(Invoice);
      })
      .catch((error) => res.status(400).send(error));
  },

  getExistingInvoice(req, res) {
    return req.db.Invoice.findOne({
      where: {
        akun: "PSB",
        siswa_id: req.body.siswa_id,
        status: {
          [Sequelize.Op.or]: ["PENDING", "SUCCESS"],
        },
      },
    })
      .then((Invoice) => {
        if (!Invoice) {
          return res.status(404).send({
            message: "Invoice Not Found",
          });
        }
        return res.status(200).send(Invoice);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    // check redundant PSB
    const psb = await req.db.Invoice.findOne({
      where: {
        akun: "PSB",
        siswa_id: req.body.siswa_id,
        status: {
          [Sequelize.Op.or]: ["PENDING", "SUCCESS"],
        },
      },
    });

    console.log(psb);

    if (psb) {
      return res.status(400).send("invoice already exist.");
    }

    const invoice = Helper.generateInvoiceNumber();
    // const nomor_va = req.body.nomor_va || Helper.generateVirtualAccount();
    const nomor_va = req.body.nomor_va;

    return req.db.Invoice.create({
      siswa_id: req.body.siswa_id,
      invoice: invoice,
      akun: req.body.akun,
      nomor_va: nomor_va,
      akun: req.body.akun,
      title: req.body.title,
      amount: req.body.amount,
      status: "PENDING",
    })
      .then((Invoice) => res.status(201).send(Invoice))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Invoice.findByPk(req.params.id, {})
      .then((Invoice) => {
        if (!Invoice) {
          return res.status(404).send({
            message: "Invoice Not Found",
          });
        }
        return Invoice.update({
          tingkat: req.body.tingkat || Invoice.tingkat,
          nama_Invoice: req.body.nama_Invoice || Invoice.nama_Invoice,
          nama_Invoice_ar: req.body.nama_Invoice_ar || Invoice.nama_Invoice_ar,
        })
          .then(() => res.status(200).send(Invoice))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  async updateInvoiceStatus(req, res) {
    // just for testing purpose
    const inv = await req.db.Invoice.findOne({
      where: {
        invoice: req.body.invoice,
      },
    });

    if (inv) {
      return inv
        .update({
          status: req.body.status || "SUCCESS",
        })
        .then((Invoice) => res.status(200).send(Invoice))
        .catch((error) => res.status(400).send(error));
    } else {
      return res.status(400).send("Invoice not found");
    }
  },

  delete(req, res) {
    return req.db.Invoice.findByPk(req.params.id)
      .then((Invoice) => {
        if (!Invoice) {
          return res.status(400).send({
            message: "Invoice Not Found",
          });
        }
        return Invoice.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
