module.exports = {
  list(req, res) {
    return req.db.LiburMengajar.findAll({
      include: [
        {
          model: req.db.LiburMengajarKelas,
          as: "Kelas",
          required: false,
          include: ["Jamke"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["tanggal", "DESC"],
      ],
    })
      .then((resultLiburMengajar) => res.status(200).send(resultLiburMengajar))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.LiburMengajar.findByPk(req.params.id, {})
      .then((resultLiburMengajar) => {
        if (!resultLiburMengajar) {
          return res.status(404).send({
            message: "LiburMengajar Not Found",
          });
        }
        return res.status(200).send(resultLiburMengajar);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {
    console.log("BODY", req.body);
    const kelas = req.body.kelas_id;
    const jamke = req.body.jamke;

    try {
      const libur = await req.db.LiburMengajar.create({
        tanggal: req.body.tanggal,
        id_penginput: req.body.id_penginput,
        keterangan: req.body.keterangan,
      });

      if (libur) {
        const idlibur = libur.id;
        // delet first
        const kelasData = await req.db.LiburMengajarKelas.findAll({
          where: { id_libur_mengajar: idlibur },
        });

        for (dt of kelasData) {
          await dt.destroy();
        }

        // save relasi kelas
        kelas.forEach(async (row) => {
          console.log("row", row);
          const svKelas = await req.db.LiburMengajarKelas.create({
            id_libur_mengajar: idlibur,
            id_kelas: row,
          });

          if (svKelas) {
            // simpan jamke
            const idkelas = svKelas.id;
            jamke.forEach(async (rowjamke) => {
              const svJamke = await req.db.LiburMengajarKelasJamke.create({
                id_libur_mengajar_kelas: idkelas,
                jamke: rowjamke,
              });
            });
          }
        });

        // for (let k=0; k < req.body.kelas_id.length; k++) {
        //   console.log("KELAS : ", req.body.kelas_id[k]);

        //   const saveKelas = await req.db.LiburMengajarKelas
        // }
      }

      res.status(201).send(libur);
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).send(error);
    }

    // return req.db.LiburMengajar
    //   .create({
    //     tanggal: req.body.tanggal,
    //     id_penginput: req.body.id_penginput,
    //     keterangan: req.body.keterangan
    //   })
    //   .then((resultLiburMengajar) => res.status(201).send(resultLiburMengajar))
    //   .catch((error) => res.status(400).send(error));
  },

  async update(req, res) {
    console.log("req.body", req.body);
    const kelas = req.body.kelas_id;
    const jamke = req.body.jamke;

    try {
      const libur = await req.db.LiburMengajar.findByPk(req.params.id, {});

      if (libur) {
        await libur.update({
          tanggal: req.body.tanggal || libur.tanggal,
          id_penginput:
            req.body.id_penginput || libur.id_penginput,
          keterangan: req.body.keterangan || libur.keterangan,
        });

        const idlibur = libur.id;
        // delet first
        const kelasData = await req.db.LiburMengajarKelas.findAll({
          where: { id_libur_mengajar: idlibur },
        });

        for (dt of kelasData) {
          await dt.destroy();
        }

        // save relasi kelas
        kelas.forEach(async (row) => {
          console.log("row", row);
          const svKelas = await req.db.LiburMengajarKelas.create({
            id_libur_mengajar: idlibur,
            id_kelas: row,
          });

          if (svKelas) {
            const idliburkelas = svKelas.id;
            // delet first
            const jamkeData = await req.db.LiburMengajarKelasJamke.findAll({
              where: { id_libur_mengajar_kelas: idliburkelas },
            });

            for (dtjmke of jamkeData) {
              await dtjmke.destroy();
            }
            // simpan jamke

            jamke.forEach(async (rowjamke) => {
              const svJamke = await req.db.LiburMengajarKelasJamke.create({
                id_libur_mengajar_kelas: idliburkelas,
                jamke: rowjamke,
              });
            });
          }
        });
      }

      res.status(200).send(libur);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  delete(req, res) {
    return req.db.LiburMengajar.findByPk(req.params.id)
      .then((resultLiburMengajar) => {
        if (!resultLiburMengajar) {
          return res.status(400).send({
            message: "LiburMengajar Not Found",
          });
        }
        return resultLiburMengajar.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
