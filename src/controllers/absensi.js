const JadwalPelajaran = require('../models').JadwalPelajaran;
const AscPeriods = require('../models').AscPeriods;
const AbsensiGuruInput = require('../models').AbsensiGuruInput;
const AbsensiHarianSiswa = require('../models').AbsensiHarianSiswa;
const AbsensiKamar = require('../models').AbsensiKamar;
const AbsensiKamarSiswa = require('../models').AbsensiKamarSiswa;
const CatatanSiswa = require('../models').CatatanSiswa;
const { QueryTypes } = require('sequelize');
const { parseString } = require("xml2js");
const Helper = require('../utils/helper');
const absensi = require('./absensi');
const TahunAjaran = require('../models').TahunAjaran;

module.exports = {
  list(req, res) {
    return JadwalPelajaran
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
    return AscPeriods
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

  getAbsensiHarianByAbsen(req, res) {
    console.log("PAYLOAD", req.body);
    return req.db.AbsensiHarianSiswa
      .findAll({
        where: { 
          absensi_guru_input_id: req.body.absensi_guru_input_id,
          absen: req.body.absen
        },
        include: [
          'Siswa'
        ],
        order : [
          ['createdat', 'ASC'],
        ],
      })
      .then((AscPeriods) => res.status(200).send(AscPeriods))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getAbsensiKamarByAbsen(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.id_kamar,a.nomor_urut,b.no_induk,b.status,b.id AS siswa_id, \
    b.nama_lengkap,c.absen,c.siswa_status \
    FROM siswa_kamar a INNER JOIN siswa b ON a.id_siswa=b.id \
    INNER JOIN absensi_kamar_siswa c ON a.id_siswa=c.siswa_id \
    WHERE  c.absensi_kamar_id=(:absensi) AND c.absen=(:absen) ";

    return req.db.AbsensiKamarSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {          
          absensi: req.body.absensi_guru_input_id,
          absen: req.body.absen
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiKamarSiswa) =>  {
      return res.status(200).send(AbsensiKamarSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getAbsensiHarianSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.kelas_id,b.id,b.no_induk,b.status,b.id AS siswa_id, \
      b.nama_lengkap,c.absen,c.catatan_positif,c.catatan_negatif,c.siswa_status,cs.id AS id_catatan_siswa \
      FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
      LEFT JOIN absensi_harian_siswa c ON a.siswa_id=c.siswa_id AND absensi_guru_input_id=(:absensi) \
      LEFT JOIN catatan_siswa cs ON c.id=cs.absensi_id \
      WHERE a.periode_id=(:periode) AND a.kelas_id=(:kelas) ORDER BY b.nama_lengkap";      

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas: req.body.kelas_id,
          absensi: req.body.absensi_guru_input_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getAbsensiHarianKamar(req, res) {
    console.log("PAYLOAD", req.body);
    
    const queryStr = "SELECT a.id_kamar,a.nomor_urut,b.no_induk,b.status,b.id AS siswa_id, \
    b.nama_lengkap,c.absen,c.siswa_status \
    FROM siswa_kamar a INNER JOIN siswa b ON a.id_siswa=b.id \
    LEFT JOIN absensi_kamar_siswa c ON a.id_siswa=c.siswa_id AND absensi_kamar_id=(:absensi) \
    WHERE a.id_tahun_ajaran=(:periode) AND a.id_kamar=(:kamar)";

    return req.db.AbsensiKamarSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kamar: req.body.id_kamar,
          absensi: req.body.absensi_guru_input_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiKamarSiswa) =>  {
      return res.status(200).send(AbsensiKamarSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getMonitoringAbsensiHarianSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.day,a.jamke,b.nama_kelas,c.completed,c.tanggal,c.is_replacement, \
    sp.real_name AS guru_pengajar, \
    j.real_name AS guru_pengganti,f.kategori AS izin  \
    FROM kelas b  \
    LEFT JOIN jadwal_pelajaran a ON a.kelas_id=b.id AND  a.day=(:day)  \
    LEFT JOIN proguser pu ON a.guru_id=pu.id \
    LEFT JOIN staff_profile sp ON pu.id=sp.id_user \
    LEFT JOIN absensi_guru_input c ON a.id=c.jadwal_pelajaran_id  AND c.tanggal=(:tanggal) \
    LEFT JOIN proguser d ON c.guru_penginput_id=d.id \
    LEFT JOIN staff_profile e ON d.id=e.id_user \
    LEFT JOIN izin_mengajar f ON a.guru_id=f.guru_id \
    LEFT JOIN proguser g ON f.guru_id=g.id \
    LEFT JOIN staff_profile h ON g.id=h.id_user \
    LEFT JOIN proguser i ON f.guru_pengganti_id=i.id \
    LEFT JOIN staff_profile j ON i.id=j.id_user \
    WHERE b.id_tingkat=(:tingkat) ORDER BY a.jamke";      

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          day: req.body.day,
          tanggal: req.body.tanggal,
          tingkat: req.body.id_tingkat
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getListInputAbsensiHarianSiswa(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.id,a.tanggal,a.materi,a.total_h,a.total_a,a.total_s,a.total_ip,a.total_it, \
      (total_h+total_a+total_s+total_ip+total_it) AS total_absen,a.jumlah_siswa_aktif,a.total_siswa,a.createdat,b.jamke,c.nama_kelas, \
      e.real_name FROM absensi_guru_input a INNER JOIN jadwal_pelajaran b ON a.jadwal_pelajaran_id=b.id \
      INNER JOIN kelas c ON b.kelas_id=c.id INNER JOIN proguser d ON b.guru_id=d.id \
      INNER JOIN staff_profile e ON d.id=e.id_user ORDER BY a.tanggal DESC";

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          // periode: req.body.periode_id,
          // kelas: req.body.kelas_id,
          // absensi: req.body.absensi_guru_input_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getListInputAbsensiHarianKamar(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT a.id,a.id_kamar,a.id_tahun_ajaran,a.tanggal,a.total_h,a.total_a,a.total_s,a.total_ip,a.total_it, \
    (total_h+total_a+total_s+total_ip+total_it) AS total_absen,a.jumlah_siswa_aktif,a.total_siswa,a.createdat,\
    g.nama_gedung,r.nama_rayon,k.nama_kamar,e.real_name \
    FROM absensi_kamar a INNER JOIN kamar k ON a.id_kamar=k.id \
    INNER JOIN rayon r ON k.id_rayon=r.id INNER JOIN gedung g ON r.id_gedung=g.id \
    INNER JOIN proguser d ON a.guru_penginput_id=d.id \
    INNER JOIN staff_profile e ON d.id=e.id_user ORDER BY a.tanggal DESC";

    return req.db.AbsensiKamar.sequelize.query(
      queryStr,      
      {
        replacements: {
          // periode: req.body.periode_id,
          // kelas: req.body.kelas_id,
          // absensi: req.body.absensi_guru_input_id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiKamar) =>  {
      return res.status(200).send(AbsensiKamar);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getAbsensiHarianSiswaByDateRange(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT b.id,b.no_induk,b.status,b.id AS siswa_id,b.nama_lengkap, \
    count(c.id) filter (where c.absen IN ('H','A','S','IP','IT')) as total, \
    count(c.id) filter (where c.absen='H') as H, count(c.id) filter (where c.absen='A') as A, \
    count(c.id) filter (where c.absen='S') as S, count(c.id) filter (where c.absen='IP') as IP, \
    count(c.id) filter (where c.absen='IT') as IT, \
    count(c.id) filter (where c.absen='H') / count(c.id) filter (where absen IN ('H','A','S','IP','IT'))::float * 100 AS persentase \
    FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
    LEFT JOIN absensi_harian_siswa c ON a.siswa_id=c.siswa_id \
    INNER JOIN absensi_guru_input d ON c.absensi_guru_input_id=d.id \
    INNER JOIN jadwal_pelajaran e ON d.jadwal_pelajaran_id=e.id \
    WHERE a.periode_id=(:periode) AND a.kelas_id=(:kelas) \
    AND d.tanggal>=(:start_date) AND d.tanggal<=(:end_date) \
    GROUP BY b.id ORDER BY b.nama_lengkap ;";      

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          kelas: req.body.kelas_id,
          start_date: req.body.start_date,
          end_date: req.body.end_date
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getAbsensiHarianKamarByDateRange(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "WITH absensi_kamar AS ( \
      SELECT  c.siswa_id,d.id_kamar,\
      count(c.id) filter (where c.absen IN ('H','A','S','IP','IT')) as total, \
        count(c.id) filter (where c.absen='H') as H, count(c.id) filter (where c.absen='A') as A, \
        count(c.id) filter (where c.absen='S') as S, count(c.id) filter (where c.absen='IP') as IP, \
        count(c.id) filter (where c.absen='IT') as IT, \
        count(c.id) filter (where c.absen='H') / count(c.id) filter (where absen IN ('H','A','S','IP','IT'))::float * 100 AS persentase \
  FROM absensi_kamar_siswa c INNER JOIN absensi_kamar d ON c.absensi_kamar_id=d.id \
  WHERE d.id_tahun_ajaran=(:periode)  AND d.id_kamar IN(:kamar) \
  AND d.tanggal>=(:start_date) AND d.tanggal<=(:end_date) \
  GROUP BY c.siswa_id,d.id_kamar \
  ) \
  SELECT ak.*,b.no_induk,b.status,b.nama_lengkap, \
  k.nama_kamar,r.nama_rayon,kls.nama_kelas \
  FROM absensi_kamar ak INNER JOIN siswa b ON ak.siswa_id=b.id \
  INNER JOIN kamar k ON ak.id_kamar=k.id INNER JOIN rayon r ON k.id_rayon=r.id \
  LEFT JOIN siswakelas sk ON sk.siswa_id=ak.siswa_id AND sk.periode_id=(:periode) \
  LEFT JOIN kelas kls ON kls.id=sk.kelas_id";      

    return req.db.AbsensiKamarSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {      
          periode: req.body.id_periode,    
          kamar: req.body.kamar,
          start_date: req.body.start_date,
          end_date: req.body.end_date
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiKamarSiswa) =>  {
      return res.status(200).send(AbsensiKamarSiswa);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  async getAbsensiHarianKamarByMonth(req, res) {
    console.log("PAYLOAD", req.body);

    // get date range
    const periode = await req.db.TahunAjaran
      .findByPk(req.body.id_periode, {});

    const tahunAjaran = periode.name;
    const splTahun = tahunAjaran.split("-");
    const thAwal = splTahun[0];
    const thAkhir = splTahun[1];
    const tahun = parseInt(req.body.bulan) > 6 ? thAwal : thAkhir;

    console.log("TAHUN", tahunAjaran);

    const firstDate = Helper.getFirstDateBulanan(req.body.bulan, tahun);
    console.log('FIRST DATE', req.body.bulan, tahun, firstDate);
    const endDate = Helper.getLastDateBulanan(req.body.bulan, tahun);
    const numOfDays = Helper.getNumOfDaysInMonth(req.body.bulan, tahun);

    console.log("NUM OF DAYS", numOfDays);

    const queryStr = "SELECT ak.*,k.nama_kamar,r.nama_rayon,sf.real_name \
    FROM absensi_kamar ak \
    INNER JOIN kamar k ON ak.id_kamar=k.id INNER JOIN rayon r ON k.id_rayon=r.id \
    INNER JOIN periode_kamar pk ON ak.id_kamar=pk.id_kamar \
    INNER JOIN proguser pu ON pk.id_musyrifah=pu.id INNER JOIN staff_profile sf ON pu.id=sf.id_user \
    WHERE id_tahun_ajaran=(:periode) AND pk.id_periode=(:periode) AND ak.id_kamar IN(:kamar) \
    AND ak.tanggal>=(:start_date) AND ak.tanggal<=(:end_date) \
    ORDER BY ak.id_kamar,ak.tanggal";      

    const absensiKamar = await req.db.AbsensiKamarSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {      
          periode: req.body.id_periode,    
          kamar: req.body.kamar,
          start_date: firstDate,
          end_date: endDate
        },
        type: QueryTypes.SELECT
      }
    );

    // Parsing the data
    const absensiKamarMap = {};
    const listAbsensi = [];
    let idxAbsensi = 0;

    for (let absen of absensiKamar) {
      const { id_kamar, tanggal, completed, nama_kamar, nama_rayon, real_name } = absen;

      console.log("id_kamar", absen, id_kamar, tanggal);
      console.log("MAP",id_kamar, absensiKamarMap[id_kamar]);
      if (absensiKamarMap[id_kamar] === undefined) {
        absensiKamarMap[id_kamar] = idxAbsensi;

        listAbsensi[idxAbsensi] = {
          tanggal, completed, nama_kamar, nama_rayon, real_name,
          absensi: []
        }

        for (let n=1; n<= numOfDays; n++) {
          listAbsensi[idxAbsensi].absensi.push(false);
        }

        idxAbsensi++;
        console.log("idx", idxAbsensi);
      }
      
      const prevIdx = absensiKamarMap[id_kamar];
      const curDate = Helper.getDayDate(tanggal) - 1;
      listAbsensi[prevIdx].absensi[curDate] = true;

      console.log("CURDATE", prevIdx, id_kamar, curDate);
    }

    return res.status(200).send({
      message: 'success',
      data: listAbsensi
    });
  },

  async getAbsensiHarianKamarPenginput(req, res) {
    console.log("PAYLOAD", req.body);

    const orderBy = req.body.urutan_persentase == "Terkecil" ? "ASC" : "DESC";

    // get date range
    const periode = await req.db.TahunAjaran
      .findByPk(req.body.id_periode, {});

    const tahunAjaran = periode.name;
    const splTahun = tahunAjaran.split("-");
    const thAwal = splTahun[0];
    const thAkhir = splTahun[1];
    const tahun = parseInt(req.body.bulan) > 6 ? thAwal : thAkhir;

    console.log("TAHUN", tahunAjaran);

    const firstDate = Helper.getFirstDateBulanan(req.body.bulan, tahun);
    console.log('FIRST DATE', req.body.bulan, tahun, firstDate);
    const endDate = Helper.getLastDateBulanan(req.body.bulan, tahun);
    const numOfDays = Helper.getNumOfDaysInMonth(req.body.bulan, tahun);

    console.log("NUM OF DAYS", numOfDays);

    const queryStr = "WITH data_kamar AS ( \
      SELECT count(*) AS jumlah_kamar, count(*) * (:day_absensi) AS jumlah_harus_input,id_musyrifah \
      FROM periode_kamar WHERE id_periode=9 GROUP BY id_musyrifah \
  ) \
  SELECT dk.jumlah_kamar,dk.jumlah_harus_input,guru_penginput_id,count(*) AS total_input, \
  count(*)/dk.jumlah_harus_input::float * 100 AS presentase, 1 * (:jumlah_hari) AS jumlah_hari, \
  sp.real_name \
  FROM absensi_kamar ak INNER JOIN data_kamar dk ON ak.guru_penginput_id=dk.id_musyrifah \
  INNER JOIN proguser pu ON pu.id=ak.guru_penginput_id \
  INNER JOIN staff_profile sp ON pu.id=sp.id_user \
  WHERE ak.id_tahun_ajaran=(:periode) AND ak.completed='t' \
  AND ak.tanggal>=(:start_date) AND ak.tanggal<=(:end_date) \
  GROUP BY ak.guru_penginput_id,dk.jumlah_kamar,dk.jumlah_harus_input,sp.real_name \
  ORDER BY presentase " + orderBy;      

    const absensiKamar = await req.db.AbsensiKamarSiswa.sequelize.query(
      queryStr,      
      {
        replacements: {      
          periode: req.body.id_periode,
          jumlah_hari: numOfDays,          
          day_absensi: numOfDays,
          start_date: firstDate,
          end_date: endDate
        },
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).send({
      message: 'success',
      data: absensiKamar
    });
  },

  getAbsensiHarianSiswaPerKategori(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT b.id,b.no_induk,b.status,b.id AS siswa_id, \
    b.nama_lengkap,k.nama_kelas, \
    count(c.id) filter (where c.absen IN ('H','A','S','IP','IT')) as total \
    FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
    INNER JOIN kelas k ON a.kelas_id=k.id \
    LEFT JOIN absensi_harian_siswa c ON a.siswa_id=c.siswa_id \
    INNER JOIN absensi_guru_input d ON c.absensi_guru_input_id=d.id \
    INNER JOIN jadwal_pelajaran e ON d.jadwal_pelajaran_id=e.id \
    WHERE a.periode_id=(:periode)  AND c.absen=(:absen) \
    AND d.tanggal>=(:start_date) AND d.tanggal<=(:end_date) \
    GROUP BY b.id,k.nama_kelas ORDER BY b.nama_lengkap"; 

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          absen: req.body.kategori,
          start_date: req.body.start_date,
          end_date: req.body.end_date
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
    })
    .catch((error) => {
      console.log(error); 
    });
  },

  getAbsensiHarianSiswaPerKategoriJamke(req, res) {
    console.log("PAYLOAD", req.body);
    const queryStr = "SELECT b.id,d.tanggal,e.jamke \
    FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
    INNER JOIN kelas k ON a.kelas_id=k.id \
    LEFT JOIN absensi_harian_siswa c ON a.siswa_id=c.siswa_id \
    INNER JOIN absensi_guru_input d ON c.absensi_guru_input_id=d.id \
    INNER JOIN jadwal_pelajaran e ON d.jadwal_pelajaran_id=e.id \
    WHERE a.periode_id=(:periode)  AND c.absen=(:absen) \
    AND d.tanggal>=(:start_date) AND d.tanggal<=(:end_date) \
    GROUP BY b.id,d.tanggal,e.jamke ORDER BY b.nama_lengkap"; 

    return req.db.AbsensiGuruInput.sequelize.query(
      queryStr,      
      {
        replacements: {
          periode: req.body.periode_id,
          absen: req.body.kategori,
          start_date: req.body.start_date,
          end_date: req.body.end_date
        },
        type: QueryTypes.SELECT
      }
    )
    .then((AbsensiGuruInput) =>  {
      return res.status(200).send(AbsensiGuruInput);
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

    return JadwalPelajaran.sequelize.query(
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
    return JadwalPelajaran
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
    const tanggal = Helper.convertDateWothoutTz(req.body.tanggal);
    return req.db.AbsensiGuruInput
      .findOne({
        where : { 
          jadwal_pelajaran_id: req.body.jadwal_pelajaran_id,
          tanggal: tanggal
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

  getGuruInputKamar(req, res) {
    const tanggal = Helper.convertDateWothoutTz(req.body.tanggal);
    console.log(req.body);
    return req.db.AbsensiKamar
      .findOne({
        where : { 
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          id_kamar: req.body.id_kamar,
          guru_penginput_id: req.body.guru_penginput_id,
          tanggal: tanggal
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((AbsensiKamar) => res.status(200).send(AbsensiKamar))
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

  addGuruInputKamar(req, res) {
    return req.db.AbsensiKamar
      .create({
        id_tahun_ajaran: req.body.id_tahun_ajaran,
        id_kamar: req.body.id_kamar,
        guru_penginput_id: req.body.guru_penginput_id,
        tanggal: req.body.tanggal,
      })
      .then((AbsensiKamar) => res.status(201).send(AbsensiKamar))
      .catch((error) => res.status(400).send(error));
  },

  async addAbsensiHarianSiswa(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    try {      
      const dataAbsensi = req.body.dataFormAbsensiSiswaNya;
      // 0. hitung jumlah hadir, alpa, sakit, ip, it
      let numOfHadir = 0;
      let numOfAlpa = 0;
      let numOfSakit = 0;
      let numOfIp = 0;
      let numOfIt = 0;
      dataAbsensi.forEach(async absensi => {
        console.log("absensi", absensi);
        if (absensi.absen === "H") numOfHadir++;
        if (absensi.absen === "A") numOfAlpa++;
        if (absensi.absen === "S") numOfSakit++;
        if (absensi.absen === "IP") numOfIp++;
        if (absensi.absen === "IT") numOfIt++;
      });   

      console.log("TOTAL ", numOfHadir, numOfAlpa, numOfSakit, numOfIp, numOfIt);



      // 1. update guru input
      const guruInput = await req.db.AbsensiGuruInput.findByPk(req.body.absensi_guru_input_id, {});
      await guruInput.update({
        materi: req.body.materi || guruInput.materi,
        completed: req.body.completed ? 't' : 'f' || guruInput.completed,
        is_replacement: req.body.is_replacement || guruInput.is_replacement,
        guru_penginput_id: req.body.guru_penginput_id || guruInput.guru_penginput_id,
        total_siswa: req.body.total_siswa || guruInput.total_siswa,
        jumlah_siswa_aktif: req.body.jumlah_siswa_aktif || guruInput.jumlah_siswa_aktif,
        total_h: numOfHadir,
        total_a: numOfAlpa,
        total_s: numOfSakit,
        total_ip: numOfIp,
        total_it: numOfIt
      })

      // console.log(req.body.absensi_guru_input_id, guruInput);

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataAbsensi.forEach(async absensi => {
        console.log("row", absensi);
        const queryStr = "INSERT INTO absensi_harian_siswa (absensi_guru_input_id,siswa_id,absen,catatan_positif,catatan_negatif,siswa_status) VALUES \
            ((:absensi_guru_input_id),(:siswa_id),(:absen),(:catatan_positif),(:catatan_negatif),(:siswa_status)) \
            ON CONFLICT(absensi_guru_input_id, siswa_id) DO UPDATE SET absen = EXCLUDED.absen, catatan_positif = EXCLUDED.catatan_positif, \
            catatan_negatif = EXCLUDED.catatan_negatif, siswa_status = EXCLUDED.siswa_status";  
        
        const absensiHarian = await req.db.AbsensiHarianSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              absensi_guru_input_id: absensi.absensi_guru_input_id,
              siswa_id: absensi.siswa_id,
              absen: absensi.absen !== '' ? absensi.absen : null,
              catatan_positif: absensi.catatan_positif,
              catatan_negatif: absensi.catatan_negatif,
              siswa_status: absensi.siswa_status
            },
            type: QueryTypes.INSERT
          });

          const idAbsensiHarian = absensiHarian[1];

          // 3. simpan ke catatan siswa
          if (absensi.id_catatan_siswa !== '') {
            const catSiswa = await req.db.CatatanSiswa.findByPk(absensi.id_catatan_siswa, {});
            console.log("CAT SISWA", catSiswa.catatan_positif);
            if (absensi.catatan_positif === '' && absensi.catatan_negatif === '') {
              // delete catatan siswa
              await catSiswa.destroy();
    
            } else {
              // update
              console.log("start update");
              await catSiswa.update({
                catatan_positif: absensi.catatan_positif || catSiswa.catatan_positif,
                catatan_negatif: absensi.catatan_negatif || catSiswa.catatan_negatif
              });
            }
          } else if (absensi.catatan_positif !== '' || absensi.catatan_negatif !== '') {
            // get id first
            const currentAbsensiSiswa = await req.db.AbsensiHarianSiswa.findOne({
              where : { 
                absensi_guru_input_id: absensi.absensi_guru_input_id,
                siswa_id: absensi.siswa_id
              }
            });
            
            const payload = {
              siswa_id: absensi.siswa_id,
              guru_id: guruInput.guru_penginput_id,
              tanggal: guruInput.tanggal,
              catatan_positif: absensi.catatan_positif,
              catatan_negatif: absensi.catatan_negatif,
              absensi_id: currentAbsensiSiswa.id
            }
            
            const save = await CatatanSiswa
              .create(payload);


          }

      });


      return res.status(200).send({
        message: 'success',
        data: guruInput
      });
    } catch (error) {
      res.status(400).send(error)
    }
  },

  async addAbsensiHarianKamar(req, res) {
    // const {data} = req.body
    console.log("DATA", req.body);

    try {      
      const dataAbsensi = req.body.dataFormAbsensiSiswaNya;
      // 0. hitung jumlah hadir, alpa, sakit, ip, it
      let numOfHadir = 0;
      let numOfAlpa = 0;
      let numOfSakit = 0;
      let numOfIp = 0;
      let numOfIt = 0;
      dataAbsensi.forEach(async absensi => {
        console.log("absensi", absensi);
        if (absensi.absen === "H") numOfHadir++;
        if (absensi.absen === "A") numOfAlpa++;
        if (absensi.absen === "S") numOfSakit++;
        if (absensi.absen === "IP") numOfIp++;
        if (absensi.absen === "IT") numOfIt++;
      });   

      console.log("TOTAL ", numOfHadir, numOfAlpa, numOfSakit, numOfIp, numOfIt);



      // 1. update guru input
      const guruInput = await req.db.AbsensiKamar.findByPk(req.body.absensi_guru_input_id, {});
      await guruInput.update({        
        completed: req.body.completed ? 't' : 'f' || guruInput.completed,
        is_replacement: req.body.is_replacement || guruInput.is_replacement,
        guru_penginput_id: req.body.guru_penginput_id || guruInput.guru_penginput_id,
        total_siswa: req.body.total_siswa || guruInput.total_siswa,
        jumlah_siswa_aktif: req.body.jumlah_siswa_aktif || guruInput.jumlah_siswa_aktif,
        total_h: numOfHadir,
        total_a: numOfAlpa,
        total_s: numOfSakit,
        total_ip: numOfIp,
        total_it: numOfIt
      })

      // console.log(req.body.absensi_guru_input_id, guruInput);

      // 2. simpan data absensi siswa
      
      // console.log("data absensi", dataAbsensi);
      await dataAbsensi.forEach(async absensi => {
        console.log("row", absensi);
        const queryStr = "INSERT INTO absensi_kamar_siswa (absensi_kamar_id,siswa_id,absen,siswa_status) VALUES \
        ((:absensi_kamar_id),(:siswa_id),(:absen),(:siswa_status)) \
        ON CONFLICT(absensi_kamar_id, siswa_id) DO UPDATE SET absen = EXCLUDED.absen, \
        siswa_status = EXCLUDED.siswa_status";  
        
        const absensiHarian = await req.db.AbsensiKamarSiswa.sequelize.query(
          queryStr,      
          {
            replacements: {            
              absensi_kamar_id: absensi.absensi_guru_input_id,
              siswa_id: absensi.siswa_id,
              absen: absensi.absen !== '' ? absensi.absen : null,
              catatan_positif: absensi.catatan_positif,
              catatan_negatif: absensi.catatan_negatif,
              siswa_status: absensi.siswa_status
            },
            type: QueryTypes.INSERT
          });

      });


      return res.status(200).send({
        message: 'success',
        data: guruInput
      });
    } catch (error) {
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
          await AscPeriods.sequelize.query(
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
          const guru = await AscPeriods.sequelize.query(
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
          const kelas = await AscPeriods.sequelize.query(
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
          const pelajaran = await AscPeriods.sequelize.query(
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
          await JadwalPelajaran.sequelize.query(
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