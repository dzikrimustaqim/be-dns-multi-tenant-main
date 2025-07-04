const { QueryTypes, Sequelize } = require("sequelize");

module.exports = {
  list(req, res) {
    return req.db.Siswakelas.findAll({
      include: [
        "Siswa",
        {
          model: req.db.Walikelas,
          as: "Walikelas",
          attributes: ["id"],
          required: false,
          include: ["User", "TahunAjaran", "Semester", "Kelas"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Siswakelas) => res.status(200).send(Siswakelas))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getSiswakelasBySemester(req, res) {
    return req.db.Siswakelas.findAll({
      include: [
        {
          model: req.db.Walikelas,
          as: "Walikelas",
          attributes: ["id"],
          required: false,
          include: ["User", "TahunAjaran", "Semester", "Kelas"],
        },
      ],
      where: { semester_id: req.body.semester_id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Siswakelas) => res.status(200).send(Siswakelas))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getSiswakelasByKelas(req, res) {
    return req.db.Siswakelas.findAll({
      include: ["Siswa"],
      where: { periode_id: req.body.periode_id, kelas_id: req.body.kelas_id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Siswakelas) => res.status(200).send(Siswakelas))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getSiswakelasByPeriodAndSiswa(req, res) {
    return req.db.Siswakelas.findOne({
      include: ["Siswa", "Kelas"],
      where: { periode_id: req.body.periode_id, siswa_id: req.body.siswa_id },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((Siswakelas) => res.status(200).send(Siswakelas))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getPeringkatKelas(req, res) {
    // select a.siswa_id,b.nama_lengkap,b.no_induk,c.semester,c.sequence from siswakelas a inner join siswa b on a.siswa_id=b.id LEFT JOIN peringkat_kelas c ON a.id=c.siswa_kelas_id AND c.semester='MS1' where a.periode_id=9
    console.log("REQ", req.body);
    const queryStr =
      "SELECT a.siswa_id,b.nama_lengkap,b.no_induk,c.semester,c.sequence \
      from siswakelas a inner join siswa b on a.siswa_id=b.id \
      LEFT JOIN peringkat_kelas c ON a.id=c.siswa_kelas_id AND c.semester=(:semester) \
      where a.periode_id=(:idperiode) AND a.kelas_id=(:idkelas) ORDER BY c.sequence";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          semester: req.body.semester,
          idperiode: req.body.id_tahun_ajaran,
          idkelas: req.body.id_kelas,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getSiswakelasByPeriode(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr =
      "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from siswakelas a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          where a.periode_id=(:idperiode) group by a.kelas_id,c.nama_kelas";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          idperiode: req.params.periode,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getTotalSiswakelasByPeriode(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr =
      "select a.kelas_id,c.nama_kelas,s.real_name, count(b.id) as total_siswa from siswakelas a \
      INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id LEFT JOIN walikelas w ON a.kelas_id=w.kelas_id \
      AND w.periode_id=(:idperiode) INNER JOIN proguser p ON w.proguser_id=p.id INNER JOIN staff_profile s ON p.id=s.id_user  \
      where a.periode_id=(:idperiode) group by a.kelas_id,c.nama_kelas,s.real_name";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          idperiode: req.params.periode,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getSiswakelasByPeriodeAndLembaga(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr =
      "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from siswakelas a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          inner join tingkat d on c.id_tingkat=d.id \
          inner join lembaga e on d.id_lembaga=e.id \
          where a.periode_id=(:idperiode) AND e.id=(:idlembaga) group by a.kelas_id,c.nama_kelas";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          idperiode: req.params.periode,
          idlembaga: req.params.lembaga,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getSiswakelasByPeriodeAndTingkat(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr =
      "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from siswakelas a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          inner join tingkat d on c.id_tingkat=d.id \
          where a.periode_id=(:idperiode) AND d.id=(:idtingkat) group by a.kelas_id,c.nama_kelas";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          idperiode: req.params.periode,
          idtingkat: req.params.tingkat,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Siswakelas.findByPk(req.params.id, {})
      .then((Siswakelas) => {
        if (!Siswakelas) {
          return res.status(404).send({
            message: "Siswakelas Not Found",
          });
        }
        return res.status(200).send(Siswakelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.Siswakelas.findOne({ where: { slug: req.body.slug } })
      .then((Siswakelas) => {
        if (!Siswakelas) {
          return res.status(404).send({
            message: "Siswakelas Not Found",
          });
        }
        return res.status(200).send(Siswakelas);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    console.log(req.body);
    return req.db.Siswakelas.create({
      periode_id: req.body.periode_id,
      siswa_id: req.body.siswa_id,
      kelas_id: req.body.kelas_id,
    })
      .then((Siswakelas) => res.status(201).send(Siswakelas))
      .catch((error) => res.status(400).send(error));
  },

  uploadDataKelas(req, res) {
    console.log(req.body.data);
    const queryStr =
      "SELECT insert_or_update_siswakelas((:arraydata),(:idperiode))";

    console.log("QUERY", queryStr);

    return req.db.Siswakelas.sequelize
      .query(queryStr, {
        replacements: {
          arraydata: req.body.data,
          idperiode: req.body.idperiode,
        },
        type: QueryTypes.SELECT,
      })
      .then((SiswaKelas) => res.status(200).send(SiswaKelas))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  updateBulkData(req, res) {
    const { data } = req.body;

    console.log("DATA", data.length, data);

    try {
      data.forEach((element) => {
        console.log("ELEMENT", element);

        req.db.Siswakelas.update(
          {
            periode_id: element.periode_id,
            kelas_id: element.kelas_id,
            siswa_id: element.siswa_id,
          },
          { where: { id: element.id } }
        );
      });
      res.status(201).send("success");
    } catch (error) {
      res.status(400).send(error);
    }
  },

  addBulkData(req, res) {
    const { data } = req.body;

    console.log("DATA", data);

    if (data.length) {
      return req.db.Siswakelas.bulkCreate(data, {
        fields: ["periode_id", "kelas_id", "siswa_id"],
        returning: true,
        ignoreDuplicates: true,
      })
        .then((Siswakelas) => {
          if (Siswakelas) {
            res.status(201).send("success");
          } else {
            res.status(400).send("error bulk upload");
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } else {
      res.status(400).send({ message: "Some values are missing" });
    }
  },

  insertOrUpdate(req, res) {
    const { data } = req.body;
    console.log("DATA", data);

    try {
      data.forEach((element) => {
        console.log("ELEMENT", element[2], element[0]);

        const queryStr =
          "insert into siswakelas (periode_id,siswa_id,kelas_id) VALUES \
            ((SELECT id FROM tahun_ajaran WHERE name=(:periode)), \
            (select id from siswa where no_induk=(:no_induk)),(:kelas_id)) \
            ON CONFLICT(periode_id, siswa_id) DO UPDATE SET kelas_id = EXCLUDED.kelas_id";

        req.db.Siswakelas.sequelize.query(queryStr, {
          replacements: {
            periode: element[2],
            no_induk: element[1],
            kelas_id: element[0],
          },
          type: QueryTypes.INSERT,
        });
      });

      return res.status(200).send({
        message: "success",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  insertOrUpdatePeringkat(req, res) {
    const { data } = req.body;
    console.log("DATA", data);

    try {
      data.forEach((element) => {
        console.log("ELEMENT", element[2]);

        const queryStr =
          "INSERT INTO peringkat_kelas (siswa_kelas_id,semester,sequence) VALUES \
          ((SELECT id FROM siswakelas WHERE periode_id=(SELECT id FROM tahun_ajaran WHERE name=(:periode)) \
          AND siswa_id=(SELECT id FROM siswa WHERE no_induk=(:no_induk)) \
          AND kelas_id=(:kelas_id)),(:semester),(:sequence)) \
          ON CONFLICT(siswa_kelas_id, semester) DO UPDATE SET sequence = EXCLUDED.sequence";

        req.db.Siswakelas.sequelize.query(queryStr, {
          replacements: {
            periode: element[2],
            no_induk: element[0],
            kelas_id: element[1],
            semester: element[3],
            sequence: element[4],
          },
          type: QueryTypes.INSERT,
        });
      });

      return res.status(200).send({
        message: "success",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  update(req, res) {
    console.log("req.body", req.body);
    return req.db.Siswakelas.findByPk(req.params.id, {})
      .then((Siswakelas) => {
        if (!Siswakelas) {
          return res.status(404).send({
            message: "Siswakelas Not Found",
          });
        }
        return Siswakelas.update({
          periode_id: req.body.periode_id || Siswakelas.periode_id,
          kelas_id: req.body.kelas_id || Siswakelas.kelas_id,
          siswa_id: req.body.siswa_id || Siswakelas.siswa_id,
        })
          .then(() => res.status(200).send(Siswakelas))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Siswakelas.findByPk(req.params.id)
      .then((Siswakelas) => {
        if (!Siswakelas) {
          return res.status(400).send({
            message: "Siswakelas Not Found",
          });
        }
        return Siswakelas.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
