const { QueryTypes } = require("sequelize");
const { parseString } = require("xml2js");

module.exports = {
  list(req, res) {
    return req.db.JadwalPelajaran.findAll({
      order: [
        ["urut", "ASC"],
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((JadwalPelajaran) => res.status(200).send(JadwalPelajaran))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getDayPeriod(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.AscPeriods.findAll({
      where: {
        id_tahun_ajaran: req.body.periode_id,
        semester: req.body.semester,
      },
      order: [["period", "ASC"]],
    })
      .then((AscPeriods) => res.status(200).send(AscPeriods))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  getSingleDataByPeriodOfLesson(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr =
      "SELECT a.*,d.kode_studi,d.nama_studi,c.real_name,c.kode_guru_nip from jadwal_pelajaran a \
      LEFT JOIN studi d ON a.studi_id=d.id \
      INNER JOIN proguser b ON a.guru_id=b.id INNER JOIN staff_profile c ON b.id=c.id_user \
      WHERE a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) \
      AND a.kelas_id=(:kelas) AND a.day=(:day) AND a.jamke=(:period) AND a.guru_id=(:guru) LIMIT 1";

    return req.db.JadwalPelajaran.sequelize
      .query(queryStr, {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          kelas: req.body.kelas_id,
          day: req.body.day,
          period: req.body.jam_pelajaran,
          guru: req.body.guru_id,
        },
        type: QueryTypes.SELECT,
      })
      .then((JadwalPelajaran) => {
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getByPeriodeSemester(req, res) {
    const queryStr =
      "SELECT DISTINCT(a.guru_id),a.asc_guru_id,a.id_tahun_ajaran,a.semester, c.kode_guru_nip,c.real_name from jadwal_pelajaran a \
      INNER JOIN proguser b ON a.guru_id=b.id INNER JOIN staff_profile c ON b.id=c.id_user \
      WHERE id_tahun_ajaran=(:periode) AND semester=(:semester)";

    return req.db.JadwalPelajaran.sequelize
      .query(queryStr, {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
        },
        type: QueryTypes.SELECT,
      })
      .then((JadwalPelajaran) => {
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getByPeriodeSemesterAndGuru(req, res) {
    const queryStr =
      "SELECT a.*, c.kode_guru_nip,c.real_name,d.nama_studi,e.nama_kelas from jadwal_pelajaran a \
      INNER JOIN proguser b ON a.guru_id=b.id INNER JOIN staff_profile c ON b.id=c.id_user \
      INNER JOIN studi d ON a.studi_id=d.id INNER JOIN kelas e ON a.kelas_id=e.id \
      WHERE id_tahun_ajaran=(:periode) AND semester=(:semester) AND a.guru_id=(:guru)";

    return req.db.JadwalPelajaran.sequelize
      .query(queryStr, {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          guru: req.body.guru_id,
        },
        type: QueryTypes.SELECT,
      })
      .then((JadwalPelajaran) => {
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getListMatapelajaranByPeriodeSemesterAndGuru(req, res) {
    console.log("PAYLOAD MTPLJ", req.body);
    let queryStr =
      "SELECT DISTINCT(a.studi_id), c.kode_guru_nip,c.real_name,d.nama_studi,e.nama_kelas from jadwal_pelajaran a \
      INNER JOIN proguser b ON a.guru_id=b.id INNER JOIN staff_profile c ON b.id=c.id_user \
      INNER JOIN studi d ON a.studi_id=d.id INNER JOIN kelas e ON a.kelas_id=e.id \
      WHERE id_tahun_ajaran=(:periode) AND semester=(:semester) AND a.guru_id=(:guru)";

    let addQuery = "";
    if (req.body.semester === "S1" || req.body.semester === "S2") {
      addQuery = " AND d.is_nilai_semester='t'";
    } else if (req.body.semester === "MS1" || req.body.semester === "MS2") {
      addQuery = " AND d.is_nilai_mid='t'";
    }

    queryStr = queryStr + addQuery;

    return req.db.JadwalPelajaran.sequelize
      .query(queryStr, {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          guru: req.body.guru_id,
        },
        type: QueryTypes.SELECT,
      })
      .then((JadwalPelajaran) => {
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getByPeriodeSemesterAndDay(req, res) {
    const queryStr =
      "select a.nama_kelas,b.day,b.jamke,c.nama_studi,e.real_name from kelas a \
      left join jadwal_pelajaran b on a.id=b.kelas_id AND b.id_tahun_ajaran=(:periode) AND b.semester=(:semester) AND b.day=(:day) \
      left join studi c on b.studi_id=c.id left join proguser d on b.guru_id=d.id \
      left join staff_profile e on d.id=e.id_user";

    return req.db.JadwalPelajaran.sequelize
      .query(queryStr, {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          day: req.body.day,
        },
        type: QueryTypes.SELECT,
      })
      .then((JadwalPelajaran) => {
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  getById(req, res) {
    return req.db.JadwalPelajaran.findByPk(req.params.id, {})
      .then((JadwalPelajaran) => {
        if (!JadwalPelajaran) {
          return res.status(404).send({
            message: "JadwalPelajaran Not Found",
          });
        }
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByKode(req, res) {
    return req.db.JadwalPelajaran.findOne({
      where: { kode: req.body.kode },
      order: [
        ["createdAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    })
      .then((JadwalPelajaran) => res.status(200).send(JadwalPelajaran))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return req.db.JadwalPelajaran.create({
      nama_JadwalPelajaran: req.body.nama_JadwalPelajaran,
      urut: req.body.urut,
    })
      .then((JadwalPelajaran) => res.status(201).send(JadwalPelajaran))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log("req.body", req.body);

    return req.db.JadwalPelajaran.findByPk(req.params.id, {})
      .then((JadwalPelajaran) => {
        if (!JadwalPelajaran) {
          return res.status(404).send({
            message: "JadwalPelajaran Not Found",
          });
        }
        return req.db.JadwalPelajaran.update({
          nama_JadwalPelajaran:
            req.body.nama_JadwalPelajaran ||
            req.db.JadwalPelajaran.nama_JadwalPelajaran,
          urut: req.body.urut || req.db.JadwalPelajaran.urut,
        })
          .then(() => res.status(200).send(JadwalPelajaran))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.JadwalPelajaran.findByPk(req.params.id)
      .then((JadwalPelajaran) => {
        if (!JadwalPelajaran) {
          return res.status(400).send({
            message: "JadwalPelajaran Not Found",
          });
        }
        return req.db.JadwalPelajaran.destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  async upload(req, res) {
    // console.log(req.query) // it'll return file uploaded from client side
    // console.log(req.file.buffer);
    const buffer = req.file.buffer;

    const xml = buffer.toString("utf8");

    // console.log(xml);

    // parsing xml data
    return parseString(xml, async function (err, results) {
      // parsing to json
      const jsonData = JSON.parse(JSON.stringify(results));

      try {
        // display the json data
        // console.log("results",req.query);

        // simpan variable hari
        // console.log(jsonData.timetable.daysdefs[0].daysdef);
        const dayDefs = jsonData.timetable.daysdefs[0].daysdef;
        const dayLists = [];
        for (let d = 0; d < dayDefs.length; d++) {
          // avoid abnormal value of key object for number
          const dayKode = dayDefs[d].$.days + "XX";
          const dayName = dayDefs[d].$.name;
          if (dayDefs[d].$.short !== "X" && dayDefs[d].$.short !== "E") {
            console.log("Day", dayKode, dayName);
            dayLists[dayKode] = dayName;
          }
        }

        // cards
        const cards = jsonData.timetable.cards[0].card;
        const cardLists = [];
        const cardJamKeLists = [];
        for (let c = 0; c < cards.length; c++) {
          const cardKode = cards[c].$.lessonid;
          const cardDayKode = cards[c].$.days;
          const cardJamKe = cards[c].$.period;
          cardLists[cardKode] = cardDayKode;
          cardJamKeLists[cardKode] = cardJamKe;
        }

        console.log("dayLists", dayLists);
        console.log("carLists", cardLists);

        console.log(
          "HARI",
          cardLists["6415147A39C14748"],
          dayLists[cardLists["6415147A39C14748"] + "XX"]
        );

        // teachers
        const teachers = jsonData.timetable.teachers[0].teacher;
        console.log(teachers);
        const teacherLists = [];
        for (let t = 0; t < teachers.length; t++) {
          const teachersId = teachers[t].$.id;
          const teachersKode = teachers[t].$.short;
          teacherLists[teachersId] = teachersKode;
        }

        console.log("teacher kode", teacherLists);

        // kelass
        const classes = jsonData.timetable.classes[0].class;
        console.log(classes);
        const classLists = [];
        for (let m = 0; m < classes.length; m++) {
          const classId = classes[m].$.id;
          const classKode = classes[m].$.short;
          classLists[classId] = classKode;
        }

        console.log("class kode", classLists);

        // studi
        const subjects = jsonData.timetable.subjects[0].subject;
        console.log(subjects);
        const subjectLists = [];
        for (let s = 0; s < subjects.length; s++) {
          const subjectId = subjects[s].$.id;
          const subjectKode = subjects[s].$.short;
          subjectLists[subjectId] = subjectKode;
        }

        console.log("subjectlist", subjectLists);

        // 1. sync jam pelajaran
        const jamPelajaran = jsonData.timetable.periods[0].period;
        for (let i = 0; i < jamPelajaran.length; i++) {
          // console.log(i, jamPelajaran[i].$.name);

          const queryStr =
            "insert into asc_periods (id_tahun_ajaran,semester,period,name,short,starttime,endtime) VALUES \
            ((:periode),(:semester),(:period),(:name),(:short),(:starttime),(:endtime)) \
            ON CONFLICT(id_tahun_ajaran, semester, period) DO UPDATE SET name = EXCLUDED.name, short = EXCLUDED.short \
            , starttime = EXCLUDED.starttime, endtime = EXCLUDED.endtime";

          // console.log(queryStr);
          await req.db.AscPeriods.sequelize.query(queryStr, {
            replacements: {
              periode: req.query.tahun,
              semester: req.query.semester,
              period: jamPelajaran[i].$.period,
              name: jamPelajaran[i].$.name,
              short: jamPelajaran[i].$.short,
              starttime: jamPelajaran[i].$.starttime,
              endtime: jamPelajaran[i].$.endtime,
            },
            type: QueryTypes.INSERT,
          });
        }

        // 2. sync guru, kelas, mata pelajaran
        // ada guru, ada kelas, ada pelajaran then go otherwise skip

        const lessons = jsonData.timetable.lessons[0].lesson;
        for (l = 0; l < lessons.length; l++) {
          // guru
          const ascGuruId = lessons[l].$.teacherids;
          const kodeGuru = teacherLists[ascGuruId];
          console.log("KD GURU", kodeGuru);
          const queryStrGuru =
            "SELECT * FROM staff_profile WHERE kode_guru_nip=(:kodeguru)";

          // console.log(queryStr);
          const guru = await req.db.AscPeriods.sequelize.query(queryStrGuru, {
            replacements: {
              kodeguru: kodeGuru,
            },
            type: QueryTypes.SELECT,
          });

          console.log("GURU", guru);

          if (guru.length === 0) {
            continue;
          }
          const coreKodeGuruId = guru[0].id_user;

          // kelas
          const kodeKelas = classLists[lessons[l].$.classids];
          const queryStrKelas =
            "SELECT * FROM kelas WHERE kode_kelas=(:kodekelas)";

          // console.log(queryStr);
          const kelas = await req.db.AscPeriods.sequelize.query(queryStrKelas, {
            replacements: {
              kodekelas: kodeKelas,
            },
            type: QueryTypes.SELECT,
          });

          console.log("KELAS", kelas);

          if (kelas.length === 0) {
            continue;
          }

          const coreKelasId = kelas[0].id;

          // pelajaran
          const kodePelajaran = subjectLists[lessons[l].$.subjectid];
          console.log("KD PELAJARAN", kodePelajaran);
          const queryStrPelajaran =
            "SELECT * FROM studi WHERE kode_studi=(:kodestudi)";

          // console.log(queryStr);
          const pelajaran = await req.db.AscPeriods.sequelize.query(
            queryStrPelajaran,
            {
              replacements: {
                kodestudi: kodePelajaran,
              },
              type: QueryTypes.SELECT,
            }
          );

          console.log("PELAJARAN", pelajaran);

          if (pelajaran.length === 0) {
            continue;
          }

          const coreStudiId = pelajaran[0].id;

          // get day
          const hari = dayLists[cardLists[lessons[l].$.id] + "XX"];

          console.log("HARINYA", hari);

          // get jam ke
          const jamKe = cardJamKeLists[lessons[l].$.id];
          console.log("JAMKE", jamKe);

          // main function
          const queryJadwalStr =
            "insert into jadwal_pelajaran (id_tahun_ajaran,semester,kelas_id,day,jamke,studi_id,guru_id,asc_guru_id) VALUES \
            ((:periode),(:semester),(:kelas),(:day),(:jamke),(:studi),(:guru),(:ascguru)) \
            ON CONFLICT(id_tahun_ajaran, semester, kelas_id, studi_id, day, jamke) DO UPDATE SET guru_id = EXCLUDED.guru_id";

          // console.log(queryStr);
          await req.db.JadwalPelajaran.sequelize.query(queryJadwalStr, {
            replacements: {
              periode: req.query.tahun,
              semester: req.query.semester,
              kelas: coreKelasId,
              day: hari,
              jamke: jamKe,
              studi: coreStudiId,
              guru: coreKodeGuruId,
              ascguru: ascGuruId,
            },
            type: QueryTypes.INSERT,
          });
        }

        return res.status(200).send({
          message: "success",
        });
      } catch (error) {
        // console.log(error);
        return res.status(400).send(error);
      }
    });
    // console.log(saveData);
  },
};
