const { QueryTypes } = require('sequelize');

module.exports = {
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {};
    
    if(searchTerm) {
      whereStatement = {
        [Sequelize.Op.or]: [
          {
            nama_studi: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    }

    const query = {
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'ASC'],
      ],
    }

    console.log('QUERY ', query);
    const count = await req.db.StudentMark
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.StudentMark
    .findAll(query)
    .then((StudentMark) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': StudentMark
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getListInputNilaiRaportHarian(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,d.markvalue \
    FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
    LEFT JOIN student_mark d ON a.siswa_id=d.id_siswa AND d.id_tahun_ajaran=(:periode) AND d.semester=(:semester) \
    AND d.tipe=(:tipe) AND d.id_studi=(:id_studi) \
    WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.StudentMark.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          tipe: "HARIAN",
          id_studi: req.body.id_studi,
          kelas_id: req.body.kelas_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((StudentMark) =>  {
      return res.status(200).send(StudentMark);
    })
    .catch((error) => {
      return res.status(400).send(error)
      console.log(error); 
    });
  },

  getListInputNilaiRaportSemester(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,d.markvalue \
    FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
    LEFT JOIN student_mark d ON a.siswa_id=d.id_siswa AND d.id_tahun_ajaran=(:periode) AND d.semester=(:semester) \
    AND d.tipe=(:tipe) AND d.id_studi=(:id_studi) \
    WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.StudentMark.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          tipe: "AKHIR",
          id_studi: req.body.id_studi,
          kelas_id: req.body.kelas_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((StudentMark) =>  {
      return res.status(200).send(StudentMark);
    })
    .catch((error) => {
      return res.status(400).send(error)
      console.log(error); 
    });
  },

  getListInputNilaiRaportNonMark(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,d.* \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN report_nonmark d ON a.siswa_id=d.id_siswa AND d.id_tahun_ajaran=(:periode) AND d.semester=(:semester) \
      WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.ReportNonmark.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          kelas_id: req.body.kelas_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((ReportNonmark) =>  {
      return res.status(200).send(ReportNonmark);
    })
    .catch((error) => {
      return res.status(400).send(error)
      console.log(error); 
    });
  },

  async addNilaiRaportHarian(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    try {      
      const dataInputHarian = req.body.dataFormNilaiHarian; 

      // 2. simpan data nilai harian
      
      // console.log("data absensi", dataAbsensi);
      await dataInputHarian.forEach(async nilai => {
        console.log("row", nilai);
        const queryStr = "INSERT INTO student_mark (id_tahun_ajaran,semester,tipe,id_studi,id_siswa,markvalue) VALUES \
          ((:id_tahun_ajaran),(:semester),(:tipe),(:id_studi),(:id_siswa),(:markvalue)) \
          ON CONFLICT(id_tahun_ajaran, semester, tipe, id_studi, id_siswa) DO UPDATE SET markvalue = EXCLUDED.markvalue";  
        
        const nilaiHarian = await req.db.StudentMark.sequelize.query(
          queryStr,      
          {
            replacements: {            
              id_tahun_ajaran: req.body.id_tahun_ajaran,
              semester: req.body.semester,
              tipe: req.body.tipe,
              id_studi: req.body.id_studi,
              id_siswa: nilai.siswa_id,
              markvalue: nilai.nilai
            },
            type: QueryTypes.INSERT
          });

      });


      return res.status(200).send({
        message: 'success',
      });
    } catch (error) {
      res.status(400).send(error)
    }
  },

  async addNilaiRaportNonNilai(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    try {      
      const dataInputNilai = req.body.dataFormNilaiNonNilai; 

      // 2. simpan data nilai harian
      
      // console.log("data absensi", dataAbsensi);
      await dataInputNilai.forEach(async nilai => {
        console.log("row", nilai);
        const queryStr = "INSERT INTO report_nonmark (id_tahun_ajaran,semester,id_siswa,alpha,sakit,izin_pribadi,izin_tugas,keseriusan,kesehatan,ketekunan,perilaku,kebersihan,kehadiran) VALUES \
          ((:id_tahun_ajaran),(:semester),(:id_siswa),(:alpha),(:sakit),(:izin_pribadi),(:izin_tugas),(:keseriusan),(:kesehatan),(:ketekunan),(:perilaku),(:kebersihan),(:kehadiran)) \
          ON CONFLICT(id_tahun_ajaran, semester, id_siswa) DO UPDATE SET alpha = EXCLUDED.alpha, sakit=EXCLUDED.sakit,izin_pribadi=EXCLUDED.izin_pribadi,izin_tugas=EXCLUDED.izin_tugas,keseriusan=EXCLUDED.keseriusan,kesehatan=EXCLUDED.kesehatan,ketekunan=EXCLUDED.ketekunan,perilaku=EXCLUDED.perilaku,kebersihan=EXCLUDED.kebersihan,kehadiran=EXCLUDED.kehadiran";  
        
        const nilaiHarian = await req.db.StudentMark.sequelize.query(
          queryStr,      
          {
            replacements: {            
              id_tahun_ajaran: req.body.id_tahun_ajaran,
              semester: req.body.semester,
              id_siswa: nilai.siswa_id,
              alpha: nilai.alpha,
              sakit: nilai.sakit,
              izin_pribadi: nilai.izin_pribadi,
              izin_tugas: nilai.izin_tugas,
              keseriusan: nilai.keseriusan,
              kesehatan: nilai.kesehatan,
              ketekunan: nilai.ketekunan,
              perilaku: nilai.perilaku,
              kebersihan: nilai.kebersihan,
              kehadiran: nilai.kehadiran,
            },
            type: QueryTypes.INSERT
          });

      });


      return res.status(200).send({
        message: 'success',
      });
    } catch (error) {
      res.status(400).send(error)
    }
  },

  getById(req, res) {
    return req.db.StudentMark
      .findByPk(req.params.id, {})
      .then((StudentMark) => {
        if (!StudentMark) {
          return res.status(404).send({
            message: 'StudentMark Not Found',
          });
        }
        return res.status(200).send(StudentMark);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {

    return req.db.StudentMark
      .create({        
        nama_studi: req.body.nama_studi
      })
      .then((StudentMark) => res.status(201).send(StudentMark))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error)
      });
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.StudentMark
      .findByPk(req.params.id, {})
      .then(StudentMark => {
        if (!StudentMark) {
          return res.status(404).send({
            message: 'StudentMark Not Found',
          });
        }
        return StudentMark
          .update({
            nama_studi: req.body.nama_studi || StudentMark.nama_studi
          })
          .then(() => res.status(200).send(StudentMark))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.StudentMark
      .findByPk(req.params.id)
      .then(StudentMark => {
        if (!StudentMark) {
          return res.status(400).send({
            message: 'StudentMark Not Found',
          });
        }
        return StudentMark
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};