const JadwalPelajaran = require('../models').JadwalPelajaran;
const AscPeriods = require('../models').AscPeriods;
const AbsensiGuruInput = require('../models').AbsensiGuruInput;
const NilaiQuran = require('../models').NilaiQuran;
const NilaiQuranSiswa = require('../models').NilaiQuranSiswa;
const NilaiInsyaYaumi = require('../models').NilaiInsyaYaumi;
const NilaiInsyaYaumiSiswa = require('../models').NilaiInsyaYaumiSiswa;
const NilaiDailyComposition = require('../models').NilaiDailyComposition;
const NilaiDailyCompositionSiswa = require('../models').NilaiDailyCompositionSiswa;
const NilaiIbadahAmaliah = require('../models').NilaiIbadahAmaliah;
const NilaiIbadahAmaliahSiswa = require('../models').NilaiIbadahAmaliahSiswa;
const { QueryTypes } = require('sequelize');
const { parseString } = require("xml2js"); 

module.exports = {
  list(req, res) {
    return req.db.JadwalPelajaran
      .findAll({        
        order: [
          ['urut', 'ASC'],
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((JadwalPelajaran) => res.status(200).send(JadwalPelajaran))
      .catch((error) => { res.status(400).send(error); });
  },

  getDayPeriod(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.AscPeriods
      .findAll({
        where: { 
          id_tahun_ajaran: req.body.periode_id,
          semester: req.body.semester
        },
        order : [
          ['period', 'ASC'],
        ],
      })
      .then((AscPeriods) => res.status(200).send(AscPeriods))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getNilaiQuran(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiQuran
      .findOne({
        where: { 
          id_tahun_ajaran: req.body.periode_id,
          bulan: req.body.bulan,
          id_kelas: req.body.id_kelas
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiQuran) => res.status(200).send(NilaiQuran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getLaporanNilaiQuran(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiQuran
      .findAll({       
        where: { 
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          id_kelas: req.body.id_kelas
        },
        include:[          
          {
            model: req.db.NilaiQuranSiswa,
            as: 'NilaiQuranSiswa',
            // attributes: ['subject','bulan'], 
            required: false,
            include:['Siswa'],
          },
        ], 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiQuran) => res.status(200).send(NilaiQuran))
      .catch((error) => { res.status(400).send(error); });
  },

  getLaporanNilaiInsya(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiInsyaYaumi
      .findAll({       
        where: { 
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          semester: req.body.id_semester,
          id_kelas: req.body.id_kelas
        },
        include:[          
          {
            model: req.db.NilaiInsyaYaumiSiswa,
            as: 'NilaiInsyaYaumiSiswa',
            // attributes: ['subject','bulan'], 
            required: false,
            include:['Siswa'],
          },
        ], 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiQuran) => res.status(200).send(NilaiQuran))
      .catch((error) => { res.status(400).send(error); });
  },

  getNilaiInsya(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiInsyaYaumi
      .findOne({
        where: { 
          id_tahun_ajaran: req.body.periode_id,
          semester: req.body.semester,
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiInsyaYaumi) => res.status(200).send(NilaiInsyaYaumi))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getNilaiDailyComposition(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiDailyComposition
      .findOne({
        where: { 
          id_tahun_ajaran: req.body.periode_id,
          semester: req.body.semester,
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiDailyComposition) => res.status(200).send(NilaiDailyComposition))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getNilaiIbadahAmaliah(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.NilaiIbadahAmaliah
      .findOne({
        where: { 
          id_tahun_ajaran: req.body.periode_id,
          semester: req.body.semester,
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((NilaiIbadahAmaliah) => res.status(200).send(NilaiIbadahAmaliah))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getListInputNilaiQuranSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,c.id,c.nilai,c.keterangan \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN nilai_quran d ON a.kelas_id=d.id_kelas AND d.id_tahun_ajaran=(:periode) AND d.id=(:nilai_quran_id) \
      LEFT JOIN nilai_quran_siswa c ON a.siswa_id=c.siswa_id \
      AND c.nilai_quran_id=(:nilai_quran_id)  WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.NilaiQuran.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas_id: req.body.id_kelas,
          nilai_quran_id: req.body.nilai_quran_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((NilaiQuran) =>  {
      return res.status(200).send(NilaiQuran);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  async getListLaporanNilaiQuranSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    
    try {
      const queryStrNotNull = "select count(*), a.id_kelas, s.real_name, k.nama_kelas from nilai_quran a INNER JOIN kelas k \
        ON a.id_kelas=k.id INNER JOIN walikelas w ON a.id_kelas=w.kelas_id AND w.periode_id=9 INNER JOIN proguser p \
        ON w.proguser_id=p.id INNER JOIN staff_profile s ON p.id=s.id_user LEFT JOIN nilai_quran_siswa b \
        ON a.id=b.nilai_quran_id WHERE a.id_tahun_ajaran=(:periode) AND a.bulan=(:bulan) AND b.nilai > 0 \
        OR (a.id_tahun_ajaran=(:periode) AND a.bulan=(:bulan) AND b.nilai = 0 AND b.keterangan != '') \
        GROUP BY a.id_kelas,s.real_name,k.nama_kelas";

      const notNull = await req.db.NilaiQuran.sequelize.query(
        queryStrNotNull,      
        {
          replacements: {
            periode: req.body.periode_id,
            bulan: req.body.bulan
          },
          type: QueryTypes.SELECT
        }
      );      

      const queryStrNull = "select count(*), a.id_kelas, s.real_name, k.nama_kelas from nilai_quran a INNER JOIN kelas k \
        ON a.id_kelas=k.id INNER JOIN walikelas w ON a.id_kelas=w.kelas_id AND w.periode_id=9 INNER JOIN proguser p \
        ON w.proguser_id=p.id INNER JOIN staff_profile s ON p.id=s.id_user LEFT JOIN nilai_quran_siswa b \
        ON a.id=b.nilai_quran_id WHERE a.id_tahun_ajaran=(:periode) AND a.bulan=(:bulan) AND b.nilai = 0 AND b.keterangan='' GROUP BY a.id_kelas,s.real_name,k.nama_kelas";

      const nullWithKeterangan = await req.db.NilaiQuran.sequelize.query(
        queryStrNull,      
        {
          replacements: {
            periode: req.body.periode_id,
            bulan: req.body.bulan
          },
          type: QueryTypes.SELECT
        }
      );

      return res.status(200).send({
        fullFill: notNull,
        nullFill: nullWithKeterangan
      });

    } catch (error) {
      console.log(error);
    }    
  },

  async getListLaporanNilaiInysaYaumiSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    
    try {
      const queryStrNotNull = "SELECT count(*), a.id_kelas FROM nilai_insya_yaumi a LEFT JOIN nilai_insya_yaumi_siswa b \
        ON a.id=b.nilai_insya_yaumi_id WHERE a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) \
        AND a.tugas_ke IN(:tugas) AND b.nilai > 0 OR (a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) AND a.tugas_ke IN(:tugas) \
        AND b.nilai = 0 AND b.keterangan != '') GROUP BY a.id_kelas";

      const notNull = await req.db.NilaiQuran.sequelize.query(
        queryStrNotNull,      
        {
          replacements: {
            periode: req.body.periode_id,
            semester: req.body.semester,
            tugas: req.body.tugas
          },
          type: QueryTypes.SELECT
        }
      );      

      // const queryStrNull = "SELECT count(*), a.id_kelas FROM nilai_insya_yaumi a LEFT JOIN nilai_insya_yaumi_siswa b \
      //   ON a.id=b.nilai_insya_yaumi_id WHERE a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) \
      //   AND a.tugas_ke IN(:tugas) AND b.nilai = 0  \
      //   AND a.semester=(:semester) AND b.nilai = 0 AND b.keterangan != '' GROUP BY a.id_kelas";

      // const nullWithKeterangan = await NilaiQuran.sequelize.query(
      //   queryStrNull,      
      //   {
      //     replacements: {
      //       periode: req.body.periode_id,
      //       semester: req.body.semester,
      //       tugas: req.body.tugas
      //     },
      //     type: QueryTypes.SELECT
      //   }
      // );

      return res.status(200).send({
        fullFill: notNull,
        // nullFill: nullWithKeterangan
      });

    } catch (error) {
      console.log(error);
    }    
  },

  async getListLaporanNilaiDailyCompositionSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    
    try {
      const queryStrNotNull = "SELECT count(*), a.id_kelas FROM nilai_daily_composition a LEFT JOIN nilai_daily_composition_siswa b \
        ON a.id=b.nilai_daily_composition_id WHERE a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) \
        AND a.tugas_ke IN(:tugas) AND b.nilai > 0 OR (a.id_tahun_ajaran=(:periode) AND a.semester=(:semester) AND a.tugas_ke IN(:tugas) \
        AND b.nilai = 0 AND b.keterangan != '') GROUP BY a.id_kelas";

      const notNull = await req.db.NilaiQuran.sequelize.query(
        queryStrNotNull,      
        {
          replacements: {
            periode: req.body.periode_id,
            semester: req.body.semester,
            tugas: req.body.tugas
          },
          type: QueryTypes.SELECT
        }
      );      

      return res.status(200).send({
        fullFill: notNull,
        // nullFill: nullWithKeterangan
      });

    } catch (error) {
      console.log(error);
    }    
  },

  getListInputNilaiInsyaSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,c.id,c.nilai,c.keterangan \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN nilai_insya_yaumi d ON a.kelas_id=d.id_kelas AND d.id=(:nilai_insya_yaumi_id) \
      LEFT JOIN nilai_insya_yaumi_siswa c ON a.siswa_id=c.siswa_id \
      AND c.nilai_insya_yaumi_id=(:nilai_insya_yaumi_id)  WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.NilaiInsyaYaumiSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas_id: req.body.id_kelas,
          nilai_insya_yaumi_id: req.body.nilai_insya_yaumi_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((NilaiInsyaYaumiSiswa) =>  {
      return res.status(200).send(NilaiInsyaYaumiSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getListInputNilaiDailyCompositionSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,c.id,c.nilai,c.keterangan \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN nilai_daily_composition d ON a.kelas_id=d.id_kelas AND d.id=(:nilai_daily_composition_id) \
      LEFT JOIN nilai_daily_composition_siswa c ON a.siswa_id=c.siswa_id \
      AND c.nilai_daily_composition_id=(:nilai_daily_composition_id)  WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.NilaiDailyCompositionSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas_id: req.body.id_kelas,
          nilai_daily_composition_id: req.body.nilai_daily_composition_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((NilaiDailyCompositionSiswa) =>  {
      return res.status(200).send(NilaiDailyCompositionSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getListInputNilaiIbadahAmaliahSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id AS siswa_id,b.no_induk,b.nama_lengkap,b.status,c.id,c.nilai,c.keterangan \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN nilai_ibadah_amaliah d ON a.kelas_id=d.id_kelas AND d.id=(:nilai_ibadah_amaliah_id) \
      LEFT JOIN nilai_ibadah_amaliah_siswa c ON a.siswa_id=c.siswa_id \
      AND c.nilai_ibadah_amaliah_id=(:nilai_ibadah_amaliah_id)  WHERE a.kelas_id=(:kelas_id) AND a.periode_id=(:periode)";

    return req.db.NilaiIbadahAmaliahSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas_id: req.body.id_kelas,
          nilai_ibadah_amaliah_id: req.body.nilai_ibadah_amaliah_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((NilaiIbadahAmaliahSiswa) =>  {
      return res.status(200).send(NilaiIbadahAmaliahSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getByPeriodeSemesterAndDay(req, res) {
    const queryStr = "select a.nama_kelas,b.day,b.jamke,c.nama_studi,e.real_name from kelas a \
      left join jadwal_pelajaran b on a.id=b.kelas_id AND b.id_tahun_ajaran=(:periode) AND b.semester=(:semester) AND b.day=(:day) \
      left join studi c on b.studi_id=c.id left join proguser d on b.guru_id=d.id \
      left join staff_profile e on d.id=e.id_user";

    return req.db.JadwalPelajaran.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          semester: req.body.semester,
          day: req.body.day
        },
        type: QueryTypes.SELECT
      }
    )
    .then((JadwalPelajaran) =>  {
      return res.status(200).send(JadwalPelajaran);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getById(req, res) {
    return req.db.JadwalPelajaran
      .findByPk(req.params.id, {})
      .then((JadwalPelajaran) => {
        if (!JadwalPelajaran) {
          return res.status(404).send({
            message: 'JadwalPelajaran Not Found',
          });
        }
        return res.status(200).send(JadwalPelajaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getGuruInput(req, res) {
    return req.db.AbsensiGuruInput
      .findOne({
        where : { 
          jadwal_pelajaran_id: req.body.jadwal_pelajaran_id,
          tanggal: req.body.tanggal
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((AbsensiGuruInput) => res.status(200).send(AbsensiGuruInput))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },
  
  add(req, res) {
    return req.db.JadwalPelajaran
      .create({
        nama_JadwalPelajaran: req.body.nama_JadwalPelajaran,
        urut: req.body.urut
      })
      .then((JadwalPelajaran) => res.status(201).send(JadwalPelajaran))
      .catch((error) => res.status(400).send(error));
  },

  addGuruInput(req, res) {
    return req.db.AbsensiGuruInput
      .create({
        jadwal_pelajaran_id: req.body.jadwal_pelajaran_id,
        tanggal: req.body.tanggal,
        materi: req.body.materi,
        guru_penginput_id: req.body.guru_penginput_id
      })
      .then((AbsensiGuruInput) => res.status(201).send(AbsensiGuruInput))
      .catch((error) => res.status(400).send(error));
  },

  async addOrUpdateNilaiQuran(req, res) {
    // const {data} = req.body
    // console.log("DATA", req.body);

    let nilai_quran_id = req.body.nilai_quran_id;
    try {      
      const dataNilai = req.body.dataFormNilaiQuran;
         
      // console.log("dataNilai", dataNilai);

      // 1. insert or update guru input

      if (req.body.nilai_quran_id !== "") {
        const guruInput = await req.db.NilaiQuran.findByPk(req.body.nilai_quran_id, {});
        
        await guruInput.update({
          id_tahun_ajaran: req.body.id_tahun_ajaran || guruInput.id_tahun_ajaran,
          subject: req.body.subject || guruInput.subject,
          bulan: req.body.bulan || guruInput.bulan,
          id_kelas: req.body.id_kelas || guruInput.id_kelas,
          id_penginput: req.body.id_penginput || guruInput.id_penginput,          
        });

        
      } else {
        const guruInput = await req.db.NilaiQuran
        .create({
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          subject: req.body.subject,
          bulan: req.body.bulan,
          id_kelas: req.body.id_kelas,
          id_penginput: req.body.id_penginput,
        });
        
        nilai_quran_id = guruInput.id;

      }

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataNilai.forEach(async nilaiQuran => {
        // console.log("row", nilaiQuran);
        const queryStr = "INSERT INTO nilai_quran_siswa (nilai_quran_id,siswa_id,nilai,keterangan) VALUES \
            ((:nilai_quran_id),(:siswa_id),(:nilai),(:keterangan)) \
            ON CONFLICT(nilai_quran_id, siswa_id) DO UPDATE SET nilai = EXCLUDED.nilai, keterangan = EXCLUDED.keterangan";  
        
        await req.db.NilaiQuranSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              nilai_quran_id: nilai_quran_id,
              siswa_id: nilaiQuran.siswa_id,
              nilai: nilaiQuran.nilai !== '' ? nilaiQuran.nilai : 0,
              keterangan: nilaiQuran.keterangan,
            },
            type: QueryTypes.INSERT
          });
      });


      return res.status(200).send({
        message: 'success',
        data: dataNilai
      });
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).send(error)
    }
  },

  async addOrUpdateNilaiInsya(req, res) {
    // const {data} = req.body
    // console.log("DATA", req.body);

    let nilai_insya_yaumi_id = req.body.nilai_insya_yaumi_id;
    try {      
      const dataNilai = req.body.dataFormNilaiInsyaYaumi;
         
      // console.log("dataNilai", dataNilai);

      // 1. insert or update guru input

      if (nilai_insya_yaumi_id !== "") {
        const guruInput = await req.db.NilaiInsyaYaumi.findByPk(nilai_insya_yaumi_id, {});
        
        await guruInput.update({
          id_tahun_ajaran: req.body.id_tahun_ajaran || guruInput.id_tahun_ajaran,
          semester: req.body.id_semester || guruInput.semester,
          id_kelas: req.body.id_kelas || guruInput.id_kelas,
          tugas_ke: req.body.tugas_ke || guruInput.tugas_ke,
          id_penginput: req.body.id_penginput || guruInput.id_penginput,          
        });

        
      } else {
        const guruInput = await req.db.NilaiInsyaYaumi
        .create({
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          semester: req.body.id_semester,          
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke,
          id_penginput: req.body.id_penginput,
        });
        
        nilai_insya_yaumi_id = guruInput.id;

      }

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataNilai.forEach(async nilaiInsya => {
        // console.log("row", nilaiQuran);
        const queryStr = "INSERT INTO nilai_insya_yaumi_siswa (nilai_insya_yaumi_id,siswa_id,nilai,keterangan) VALUES \
            ((:nilai_insya_yaumi_id),(:siswa_id),(:nilai),(:keterangan)) \
            ON CONFLICT(nilai_insya_yaumi_id, siswa_id) DO UPDATE SET nilai = EXCLUDED.nilai, keterangan = EXCLUDED.keterangan";  
        
        await req.db.NilaiInsyaYaumiSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              nilai_insya_yaumi_id: nilai_insya_yaumi_id,
              siswa_id: nilaiInsya.siswa_id,
              nilai: nilaiInsya.nilai !== '' ? nilaiInsya.nilai : 0,
              keterangan: nilaiInsya.keterangan,
            },
            type: QueryTypes.INSERT
          });
      });


      return res.status(200).send({
        message: 'success',
        data: dataNilai
      });
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).send(error)
    }
  },

  async addOrUpdateNilaiDailyComposition(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    let nilai_daily_composition_id = req.body.nilai_daily_composition_id;
    try {      
      const dataNilai = req.body.dataFormnilaiDailyComposition;
         
      console.log("dataNilai", dataNilai);

      // 1. insert or update guru input

      if (nilai_daily_composition_id !== "") {
        const guruInput = await req.db.NilaiDailyComposition.findByPk(nilai_daily_composition_id, {});
        
        await guruInput.update({
          id_tahun_ajaran: req.body.id_tahun_ajaran || guruInput.id_tahun_ajaran,
          semester: req.body.id_semester || guruInput.semester,
          id_kelas: req.body.id_kelas || guruInput.id_kelas,
          tugas_ke: req.body.tugas_ke || guruInput.tugas_ke,
          id_penginput: req.body.id_penginput || guruInput.id_penginput,          
        });

        
      } else {
        const guruInput = await req.db.NilaiDailyComposition
        .create({
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          semester: req.body.id_semester,          
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke,
          id_penginput: req.body.id_penginput,
        });
        
        nilai_daily_composition_id = guruInput.id;

      }

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataNilai.forEach(async nilaiDailyComposition => {
        // console.log("row", nilaiQuran);
        const queryStr = "INSERT INTO nilai_daily_composition_siswa (nilai_daily_composition_id,siswa_id,nilai,keterangan) VALUES \
            ((:nilai_daily_composition_id),(:siswa_id),(:nilai),(:keterangan)) \
            ON CONFLICT(nilai_daily_composition_id, siswa_id) DO UPDATE SET nilai = EXCLUDED.nilai, keterangan = EXCLUDED.keterangan";  
        
        await req.db.NilaiDailyCompositionSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              nilai_daily_composition_id: nilai_daily_composition_id,
              siswa_id: nilaiDailyComposition.siswa_id,
              nilai: nilaiDailyComposition.nilai !== '' ? nilaiDailyComposition.nilai : 0,
              keterangan: nilaiDailyComposition.keterangan,
            },
            type: QueryTypes.INSERT
          });
      });


      return res.status(200).send({
        message: 'success',
        data: dataNilai
      });
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).send(error)
    }
  },

  async addOrUpdateNilaiDailyIbadahAmaliah(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    let nilai_ibadah_amaliah_id = req.body.nilai_ibadah_amaliah_id;
    try {      
      const dataNilai = req.body.dataFormnilaiIbadahAmaliah;
         
      console.log("dataNilai", dataNilai);

      // 1. insert or update guru input

      if (nilai_ibadah_amaliah_id !== "") {
        const guruInput = await req.db.NilaiIbadahAmaliah.findByPk(nilai_ibadah_amaliah_id, {});
        
        await guruInput.update({
          id_tahun_ajaran: req.body.id_tahun_ajaran || guruInput.id_tahun_ajaran,
          semester: req.body.id_semester || guruInput.semester,
          id_kelas: req.body.id_kelas || guruInput.id_kelas,
          tugas_ke: req.body.tugas_ke || guruInput.tugas_ke,
          id_penginput: req.body.id_penginput || guruInput.id_penginput,          
        });

        
      } else {
        const guruInput = await req.db.NilaiIbadahAmaliah
        .create({
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          semester: req.body.id_semester,          
          id_kelas: req.body.id_kelas,
          tugas_ke: req.body.tugas_ke,
          id_penginput: req.body.id_penginput,
        });
        
        nilai_ibadah_amaliah_id = guruInput.id;

      }

      console.log("PLOAD", nilai_ibadah_amaliah_id, );

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataNilai.forEach(async nilaiIbadahAmaliah => {
        console.log("row", nilaiIbadahAmaliah);
        const queryStr = "INSERT INTO nilai_ibadah_amaliah_siswa (nilai_ibadah_amaliah_id,siswa_id,nilai,keterangan) VALUES \
            ((:nilai_ibadah_amaliah_id),(:siswa_id),(:nilai),(:keterangan)) \
            ON CONFLICT(nilai_ibadah_amaliah_id, siswa_id) DO UPDATE SET nilai = EXCLUDED.nilai, keterangan = EXCLUDED.keterangan";  
        
        await req.db.NilaiIbadahAmaliahSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              nilai_ibadah_amaliah_id: nilai_ibadah_amaliah_id,
              siswa_id: nilaiIbadahAmaliah.siswa_id,
              nilai: nilaiIbadahAmaliah.nilai !== '' ? nilaiIbadahAmaliah.nilai : 0,
              keterangan: nilaiIbadahAmaliah.keterangan,
            },
            type: QueryTypes.INSERT
          });
      });


      return res.status(200).send({
        message: 'success',
        data: dataNilai
      });
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).send(error)
    }
  },

  update(req, res) {
    console.log('req.body', req.body)
  
    return req.db.JadwalPelajaran
      .findByPk(req.params.id, {})
      .then(JadwalPelajaran => {
        if (!JadwalPelajaran) {
          return res.status(404).send({
            message: 'JadwalPelajaran Not Found',
          });
        }
        return JadwalPelajaran
          .update({
            nama_JadwalPelajaran: req.body.nama_JadwalPelajaran || JadwalPelajaran.nama_JadwalPelajaran,
            urut: req.body.urut || JadwalPelajaran.urut
          })
          .then(() => res.status(200).send(JadwalPelajaran))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.JadwalPelajaran
      .findByPk(req.params.id)
      .then(JadwalPelajaran => {
        if (!JadwalPelajaran) {
          return res.status(400).send({
            message: 'JadwalPelajaran Not Found',
          });
        }
        return JadwalPelajaran
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  async upload(req, res) {
    // console.log(req.query) // it'll return file uploaded from client side
    // console.log(req.file.buffer);
    const buffer = req.file.buffer;

    const xml = buffer.toString('utf8');

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
        for (let d=0;d<dayDefs.length;d++) {
          // avoid abnormal value of key object for number
          const dayKode = dayDefs[d].$.days + "XX";
          const dayName = dayDefs[d].$.name;
          if (dayDefs[d].$.short !== "X" && dayDefs[d].$.short !== "E") {
            console.log("Day", dayKode, dayName)
            dayLists[dayKode] = dayName;
          }
        }

        // cards
        const cards = jsonData.timetable.cards[0].card;
        const cardLists = [];
        const cardJamKeLists = [];
        for (let c=0;c<cards.length;c++) {
          const cardKode = cards[c].$.lessonid;
          const cardDayKode = cards[c].$.days;
          const cardJamKe = cards[c].$.period;
          cardLists[cardKode] = cardDayKode;
          cardJamKeLists[cardKode] = cardJamKe;
        }

        console.log('dayLists', dayLists);
        console.log('carLists', cardLists);

        console.log("HARI", cardLists['6415147A39C14748'], dayLists[cardLists['6415147A39C14748']+'XX']);

        // teachers
        const teachers = jsonData.timetable.teachers[0].teacher;
        console.log(teachers);
        const teacherLists = [];
        for (let t=0;t<teachers.length;t++) {
          const teachersId = teachers[t].$.id;
          const teachersKode = teachers[t].$.short;
          teacherLists[teachersId] = teachersKode;
        }

        console.log("teacher kode", teacherLists);

        // kelass
        const classes = jsonData.timetable.classes[0].class;
        console.log(classes);
        const classLists = [];
        for (let m=0;m<classes.length;m++) {
          const classId = classes[m].$.id;
          const classKode = classes[m].$.short;
          classLists[classId] = classKode;
        }

        console.log("class kode", classLists);

        // studi
        const subjects = jsonData.timetable.subjects[0].subject;
        console.log(subjects);
        const subjectLists = [];
        for (let s=0;s<subjects.length;s++) {
          const subjectId = subjects[s].$.id;
          const subjectKode = subjects[s].$.short;
          subjectLists[subjectId] = subjectKode;
        }

        console.log("subjectlist", subjectLists);

        // 1. sync jam pelajaran
        const jamPelajaran = jsonData.timetable.periods[0].period;
        for (let i=0; i<jamPelajaran.length; i++) {
          // console.log(i, jamPelajaran[i].$.name);

          const queryStr = "insert into asc_periods (id_tahun_ajaran,semester,period,name,short,starttime,endtime) VALUES \
            ((:periode),(:semester),(:period),(:name),(:short),(:starttime),(:endtime)) \
            ON CONFLICT(id_tahun_ajaran, semester, period) DO UPDATE SET name = EXCLUDED.name, short = EXCLUDED.short \
            , starttime = EXCLUDED.starttime, endtime = EXCLUDED.endtime";  
        
          // console.log(queryStr);
          await req.db.AscPeriods.sequelize.query(
          queryStr,      
          {
            replacements: {            
              periode: req.query.tahun,
              semester: req.query.semester,
              period: jamPelajaran[i].$.period,
              name: jamPelajaran[i].$.name,
              short: jamPelajaran[i].$.short,
              starttime: jamPelajaran[i].$.starttime,
              endtime: jamPelajaran[i].$.endtime
            },
            type: QueryTypes.INSERT
          });
        }

        // 2. sync guru, kelas, mata pelajaran
        // ada guru, ada kelas, ada pelajaran then go otherwise skip

        const lessons = jsonData.timetable.lessons[0].lesson;
        for (l=0;l<lessons.length;l++) {
          // guru
          const kodeGuru = teacherLists[lessons[l].$.teacherids];
          console.log("KD GURU", kodeGuru);
          const queryStrGuru = "SELECT * FROM staff_profile WHERE kode_guru_nip=(:kodeguru)";  
          
          // console.log(queryStr);
          const guru = await req.db.AscPeriods.sequelize.query(
          queryStrGuru,      
          {
            replacements: {            
              kodeguru: kodeGuru,
            },
            type: QueryTypes.SELECT
          });
  
          console.log("GURU", guru);
  
          if (guru.length === 0) {
            continue;
          }
          const coreKodeGuruId = guru[0].id_user;

          // kelas
          const kodeKelas = classLists[lessons[l].$.classids];
          const queryStrKelas = "SELECT * FROM kelas WHERE kode_kelas=(:kodekelas)";  
          
          // console.log(queryStr);
          const kelas = await req.db.AscPeriods.sequelize.query(
          queryStrKelas,      
          {
            replacements: {            
              kodekelas: kodeKelas,
            },
            type: QueryTypes.SELECT
          });
  
          console.log("KELAS", kelas);
  
          if (kelas.length === 0) {
            continue;
          }

          const coreKelasId = kelas[0].id;

          // pelajaran
          const kodePelajaran = subjectLists[lessons[l].$.subjectid];
          console.log("KD PELAJARAN", kodePelajaran);
          const queryStrPelajaran = "SELECT * FROM studi WHERE kode_studi=(:kodestudi)";  
          
          // console.log(queryStr);
          const pelajaran = await req.db.AscPeriods.sequelize.query(
          queryStrPelajaran,      
          {
            replacements: {            
              kodestudi: kodePelajaran,
            },
            type: QueryTypes.SELECT
          });
  
          console.log("PELAJARAN", pelajaran);
  
          if (pelajaran.length === 0) {
            continue;
          }

          const coreStudiId = pelajaran[0].id;

          // get day
          const hari = dayLists[cardLists[lessons[l].$.id]+'XX'];

          console.log("HARINYA", hari);

          // get jam ke
          const jamKe = cardJamKeLists[lessons[l].$.id];
          console.log("JAMKE", jamKe);

          // main function
          const queryJadwalStr = "insert into jadwal_pelajaran (id_tahun_ajaran,semester,kelas_id,day,jamke,studi_id,guru_id) VALUES \
            ((:periode),(:semester),(:kelas),(:day),(:jamke),(:studi),(:guru)) \
            ON CONFLICT(id_tahun_ajaran, semester, kelas_id, studi_id, day, jamke) DO UPDATE SET guru_id = EXCLUDED.guru_id";  
        
          // console.log(queryStr);
          await req.db.JadwalPelajaran.sequelize.query(
          queryJadwalStr,      
          {
            replacements: {            
              periode: req.query.tahun,
              semester: req.query.semester,
              kelas: coreKelasId,
              day: hari,
              jamke: jamKe,
              studi: coreStudiId,
              guru: coreKodeGuruId
            },
            type: QueryTypes.INSERT
          });


        }      

        return res.status(200).send({
          message: 'success',
        });
      } catch (error) {
        // console.log(error);
        return res.status(400).send(error)
      }    
      
    });
    // console.log(saveData);
  },
};