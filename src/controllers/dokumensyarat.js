module.exports = {
  list(req, res) {
    return req.db.DokumenSyarat.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultDokumen_syarat) => res.status(200).send(resultDokumen_syarat))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getByDokumenSyarat(req, res) {
    return req.db.DokumenSyarat.findOne({
      where: { dokumen_syarat: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultDokumen_syarat) => res.status(200).send(resultDokumen_syarat))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getBySiswa(req, res) {
    return req.db.DokumenSyarat.findAll({
      where: { id_siswa: req.params.id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultDokumen_syarat) => {
        if (resultDokumen_syarat.length) {
          return res.status(200).send(resultDokumen_syarat);
        }
        return res.status(230).send({ message: "dokumen not found" });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.DokumenSyarat.findByPk(req.params.id, {})
      .then((resultDokumen_syarat) => {
        if (!resultDokumen_syarat) {
          return res.status(404).send({
            message: "dokumen_syarat Not Found",
          });
        }
        return res.status(200).send(resultDokumen_syarat);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    console.log(req.body);
    const docExist = await req.db.DokumenSyarat.findOne({
      where: {
        id_siswa: req.body.id_siswa,
        berkas_id: req.body.berkas_id,
      },
    });

    if (docExist) {
      return docExist
        .update({
          id_siswa: req.body.id_siswa || docExist.id_siswa,
          berkas_id: req.body.berkas_id || docExist.berkas_id,
          urut: req.body.urut || docExist.urut,
          nama_dokumen:
            req.body.nama_dokumen || docExist.nama_dokumen,
          file_url: req.body.file_url || docExist.file_url,
        })
        .then(() => res.status(200).send(docExist))
        .catch((error) => res.status(400).send(error));
    } else {
      console.log("BARU");
      return req.db.DokumenSyarat.create({
        id_siswa: req.body.id_siswa,
        berkas_id: req.body.berkas_id,
        urut: req.body.urut,
        nama_dokumen: req.body.nama_dokumen,
        file_url: req.body.file_url,
      })
        .then((resultDokumen_syarat) => res.status(201).send(resultDokumen_syarat))
        .catch((error) => res.status(400).send(error));
    }
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.DokumenSyarat.findByPk(req.params.id, {})
      .then((resultDokumen_syarat) => {
        if (!resultDokumen_syarat) {
          return res.status(404).send({
            message: "DokumenSyarat Not Found",
          });
        }
        return resultDokumen_syarat
          .update({
            id_siswa: req.body.id_siswa || resultDokumen_syarat.id_siswa,
            id_dokumen: req.body.id_dokumen || resultDokumen_syarat.id_dokumen,
            file_url: req.body.file_url || resultDokumen_syarat.file_url,
          })
          .then(() => res.status(200).send(resultDokumen_syarat))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.DokumenSyarat.findByPk(req.params.id)
      .then((resultDokumen_syarat) => {
        if (!resultDokumen_syarat) {
          return res.status(400).send({
            message: "DokumenSyarat Not Found",
          });
        }
        return resultDokumen_syarat.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
