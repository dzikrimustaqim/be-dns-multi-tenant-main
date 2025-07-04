module.exports = {
  list(req, res) {
    return req.db.Semester.findAll({
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultSemester) => res.status(200).send(resultSemester))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  listSemesterByPeriode(req, res) {
    return req.db.Semester.findAll({
      include: ["Periode"],
      where: { periode_id: req.body.periode_id },
      order: [
        ["weight", "ASC"],
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((resultSemester) => res.status(200).send(resultSemester))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getSemesterAktif(req, res) {
    return req.db.Semester.findOne({
      where: { periode_id: req.body.periode_id, active: "t" },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((TahunAjaran) => res.status(200).send(TahunAjaran))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return req.db.Semester.findByPk(req.params.id, {})
      .then((resultSemester) => {
        if (!resultSemester) {
          return res.status(404).send({
            message: "Semester Not Found",
          });
        }
        return res.status(200).send(resultSemester);
      })
      .catch((error) => res.status(400).send(error));
  },

  addInitSemester(req, res) {
    return req.db.Semester.findAll({
      where: { periode_id: req.body.periode_id },
    })
      .then((ResSemester) => {
        if (ResSemester.length === 0) {
          // const allSemester = [
          //   {
          //     periode_id: req.body.periode_id,
          //     semester: 'MS1',
          //     weight: 1,
          //     nilai_harian: 'f',
          //     nilai_akhir: 't'
          //   },
          //   {
          //     periode_id: req.body.periode_id,
          //     semester: 'S1',
          //     weight: 2,
          //     nilai_harian: 't',
          //     nilai_akhir: 't'
          //   },
          //   {
          //     periode_id: req.body.periode_id,
          //     semester: 'MS2',
          //     weight: 3,
          //     nilai_harian: 'f',
          //     nilai_akhir: 't'
          //   },
          //   {
          //     periode_id: req.body.periode_id,
          //     semester: 'S2',
          //     weight: 4,
          //     nilai_harian: 't',
          //     nilai_akhir: 't'
          //   }
          // ]

          // just ganjil dan genap
          const allSemester = [
            {
              periode_id: req.body.periode_id,
              semester: "MS1",
              weight: 1,
            },
            {
              periode_id: req.body.periode_id,
              semester: "S1",
              weight: 2,
            },
            {
              periode_id: req.body.periode_id,
              semester: "MS2",
              weight: 3,
            },
            {
              periode_id: req.body.periode_id,
              semester: "S2",
              weight: 4,
            },
          ];

          return (
            req.db.Semester
              // .bulkCreate(req.body)
              // .bulkCreate(allSemester, { fields: ['periode_id','semester', 'weight', 'nilai_harian', 'nilai_akhir'], returning : true })
              .bulkCreate(allSemester, {
                fields: ["periode_id", "semester", "weight"],
                returning: true,
              })
              // .bulkCreate([...req.body], { returning : true })
              .then((resultSemester) => {
                // console.log(cbtsiswa)
                if (resultSemester) {
                  res.status(200).send(resultSemester);
                }
                res.status(400).send("error init semester");
              })
              .catch((errors) => {
                // console.log(errors)
                res.status(400).send(errors);
              })
          );
        }
        res.status(200).send(ResSemester);
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.Semester.create({
      periode_id: req.body.periode_id,
      semester: req.body.semester,
    })
      .then((resultSemester) => res.status(201).send(resultSemester))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);
    console.log("req.params", req.params);
    const status =
      req.body.status === false
        ? "f"
        : req.body.status === true
        ? "t"
        : req.body.status;
    console.log("ACTIVE", status);
    // cek if other is active
    return req.db.Semester.findOne({
      where: { active: "t", periode_id: req.body.periode_id },
    })
      .then((ResSemester) => {
        if (
          !ResSemester ||
          ResSemester.id == req.params.id ||
          status === "f" ||
          !req.body.active
        ) {
          return req.db.Semester.findByPk(req.params.id, {})
            .then((resultSemester) => {
              if (!resultSemester) {
                return res.status(404).send({
                  message: "Semester Not Found",
                });
              }
              return resultSemester
                .update({
                  semester_name: req.body.semester_name,
                  start_date: req.body.start_date,
                  end_date: req.body.end_date,
                  masehi_report_date: req.body.masehi_report_date,
                  hijriah_report_date: req.body.hijriah_report_date,
                  start_input_nilai_date: req.body.start_input_nilai_date,
                  end_input_nilai_date: req.body.end_input_nilai_date,
                  active: status || resultSemester.active,
                })
                .then(() => res.status(200).send(resultSemester))
                .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
        }
        return res.status(400).send({
          message: "Masih ada semester aktif",
        });
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(400).send(error);
      });
  },

  delete(req, res) {
    return req.db.Semester.findByPk(req.params.id)
      .then((resultSemester) => {
        if (!resultSemester) {
          return res.status(400).send({
            message: "Semester Not Found",
          });
        }
        return resultSemester.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
