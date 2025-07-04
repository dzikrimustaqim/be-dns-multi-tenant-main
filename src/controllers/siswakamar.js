const { QueryTypes, Sequelize } = require('sequelize');

module.exports = {
  list(req, res) {
    return req.db.SiswaKamar
      .findAll({       
        include:[ 
          'Siswa',
          {
            model: req.db.Walikelas,
            as: 'Walikelas',
            attributes: ['id'], 
            required: false,
            include:['User', 'TahunAjaran', 'Semester', 'Kelas'],
          },
        ], 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => { res.status(400).send(error); });
  },

  getSiswaKamarBySemester(req, res) {
    return req.db.SiswaKamar
      .findAll({       
        include:[
          {
            model: req.db.Walikelas,
            as: 'Walikelas',
            attributes: ['id'], 
            required: false,
            include:['User', 'TahunAjaran', 'Semester', 'Kelas'],            
          },
        ],
        where : { semester_id: req.body.semester_id }, 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => { res.status(400).send(error); });
  },

  getSiswaKamarByKelas(req, res) {
    return req.db.SiswaKamar
      .findAll({       
        include:[
          'Siswa',
        ],
        where : { periode_id: req.body.periode_id, kelas_id: req.body.kelas_id }, 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => { res.status(400).send(error); });
  },

  getSiswaKamarByPeriodAndSiswa(req, res) {
    return req.db.SiswaKamar
      .findOne({       
        include:[
          'Siswa','Kelas'
        ],
        where : { periode_id: req.body.periode_id, siswa_id: req.body.siswa_id }, 
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => { res.status(400).send(error); });
  },

  getPeringkatKelas(req, res) {
    // select a.siswa_id,b.nama_lengkap,b.no_induk,c.semester,c.sequence from SiswaKamar a inner join siswa b on a.siswa_id=b.id LEFT JOIN peringkat_kelas c ON a.id=c.siswa_kelas_id AND c.semester='MS1' where a.periode_id=9
    console.log("REQ", req.body);
    const queryStr = "SELECT a.siswa_id,b.nama_lengkap,b.no_induk,c.semester,c.sequence \
      from SiswaKamar a inner join siswa b on a.siswa_id=b.id \
      LEFT JOIN peringkat_kelas c ON a.id=c.siswa_kelas_id AND c.semester=(:semester) \
      where a.periode_id=(:idperiode) AND a.kelas_id=(:idkelas) ORDER BY c.sequence";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {            
            semester: req.body.semester,
            idperiode: req.body.id_tahun_ajaran,
            idkelas: req.body.id_kelas
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getSiswaKamarByPeriode(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr = "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from SiswaKamar a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          where a.periode_id=(:idperiode) group by a.kelas_id,c.nama_kelas";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idperiode: req.params.periode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getTotalSiswaKamarByPeriode(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr = "select a.kelas_id,c.nama_kelas,s.real_name, count(b.id) as total_siswa from SiswaKamar a \
      INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id LEFT JOIN walikelas w ON a.kelas_id=w.kelas_id \
      AND w.periode_id=(:idperiode) INNER JOIN proguser p ON w.proguser_id=p.id INNER JOIN staff_profile s ON p.id=s.id_user  \
      where a.periode_id=(:idperiode) group by a.kelas_id,c.nama_kelas,s.real_name";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idperiode: req.params.periode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getSiswaKamarByPeriodeAndLembaga(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr = "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from SiswaKamar a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          inner join tingkat d on c.id_tingkat=d.id \
          inner join lembaga e on d.id_lembaga=e.id \
          where a.periode_id=(:idperiode) AND e.id=(:idlembaga) group by a.kelas_id,c.nama_kelas";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idperiode: req.params.periode,
            idlembaga: req.params.lembaga
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getSiswaKamarByPeriodeAndTingkat(req, res) {
    // Aktif	Keluar	Alumni	Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil	Dikeluarkan	Unclear Status
    // belum ada Keluar Tafawwuq	Suluk	Tahfidz	Bimbel	Tahwil
    const queryStr = "select a.kelas_id,c.nama_kelas, \
          count(b.id) filter (where status='ACTIVE') as aktif, \
          count(b.id) filter (where status='ALUMNI') as alumni, \
          count(b.id) filter (where status='DO') as do, \
          count(b.id) filter (where status='OTHER') as other, \
          count(b.id) filter (where daftar_ulang='t') as du \
          from SiswaKamar a INNER JOIN siswa b on a.siswa_id=b.id INNER JOIN kelas c on a.kelas_id=c.id \
          inner join tingkat d on c.id_tingkat=d.id \
          where a.periode_id=(:idperiode) AND d.id=(:idtingkat) group by a.kelas_id,c.nama_kelas";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idperiode: req.params.periode,
            idtingkat: req.params.tingkat
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.SiswaKamar
      .findByPk(req.params.id, {})
      .then((SiswaKamar) => {
        if (!SiswaKamar) {
          return res.status(404).send({
            message: 'SiswaKamar Not Found',
          });
        }
        return res.status(200).send(SiswaKamar);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.SiswaKamar
      .findOne({where: { slug: req.body.slug }})
      .then((SiswaKamar) => {
        if (!SiswaKamar) {
          return res.status(404).send({
            message: 'SiswaKamar Not Found',
          });
        }
        return res.status(200).send(SiswaKamar);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriodAndKamar(req, res) {
    return req.db.SiswaKamar
      .findAll({
        where : { 
          id_tahun_ajaran: req.params.idperiod,
          id_kamar: req.params.id
        },
        include: [
          { 
            model: req.db.Siswa, 
            as: 'Siswa', 
            attributes: ['id','no_induk','nama_lengkap','kota_kab','telp_ayah','telp_ibu'],            
            required:true,            
            include: [
              { 
                model: req.db.Siswakelas, 
                as: 'siswaKelas',            
                required:false,
                where: {
                  periode_id: req.params.idperiod
                },
                include: [
                  'Kelas'
                ],
              },   
            ],            
          },
          { 
            model: req.db.Kamar, 
            as: 'Kamar',                      
            required:true,            
            include: [
              'RayonKamar'  
            ],            
          },          
        ],
        order : [
          ['nomor_urut', 'ASC'],
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((lembaga) => res.status(200).send(lembaga))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); 
      });
  },

  getByGedungAsranmaKamar(req, res) {
    console.log(req.body);
    let whereStatement = {
      id_tahun_ajaran: req.body.id_period
    }

    let whereRayonStatement = {};

    if (req.body.id_gedung != '') {
      whereRayonStatement['id_gedung'] = req.body.id_gedung;
    }

    if (req.body.id_rayon != '') {
      whereRayonStatement['id'] = req.body.id_rayon;
    }

    if (req.body.id_kamar != '') {
      whereStatement['id_kamar'] = req.body.id_kamar;
    }

    return req.db.SiswaKamar
      .findAll({
        where: whereStatement,
        include: [
          { 
            model: req.db.Siswa, 
            as: 'Siswa', 
            attributes: ['id','no_induk','nama_lengkap','status'],            
            required:true,            
            include: [
              { 
                model: req.db.Siswakelas, 
                as: 'siswaKelas',            
                required:false,
                where: {
                  periode_id: req.body.id_period
                },
                include: [
                  'Kelas'
                ],
              },   
            ],            
          },
          { 
            model: req.db.Kamar, 
            as: 'Kamar',                      
            required:true,            
            include: [
              {
                model: req.db.Rayon, 
                as: 'RayonKamar',                      
                required:true,
                where: whereRayonStatement, 
                include: [
                  'Gedung'  
                ]
              },
              {
                model: req.db.PeriodeKamar,
                as: 'PeriodeKamar',                      
                required:true,
                where: {
                  id_periode: req.body.id_period
                }, 
              }              
            ],            
          },          
        ],
        order : [
          ['nomor_urut', 'ASC'],
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((lembaga) => res.status(200).send(lembaga))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); 
      });
  },

  add(req, res) {
    console.log(req.body);
    return req.db.SiswaKamar
      .create({
        id_tahun_ajaran: req.body.id_tahun_ajaran,
        id_siswa: req.body.id_siswa,
        id_kamar: req.body.id_kamar,
        nomor_urut: req.body.nomor_urut
      })
      .then((SiswaKamar) => res.status(201).send(SiswaKamar))
      .catch((error) => res.status(400).send(error));
  },

  uploadDataKelas(req, res) {
    console.log(req.body.data);
    const queryStr = "SELECT insert_or_update_SiswaKamar((:arraydata),(:idperiode))";

      console.log("QUERY", queryStr);

      return req.db.SiswaKamar.sequelize.query(
        queryStr,      
        {
          replacements: {
            arraydata: req.body.data,
            idperiode: req.body.idperiode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((SiswaKamar) => res.status(200).send(SiswaKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  updateBulkData(req, res) {
    const {data} = req.body

    console.log("DATA", data.length, data);
    
    try {
      data.forEach(element => {
        console.log("ELEMENT", element)
        
        req.db.SiswaKamar.update({ 
          periode_id : element.periode_id,
          kelas_id: element.kelas_id,
          siswa_id: element.siswa_id 
        },{ where : { id : element.id }});
      });
      res.status(201).send('success')
    } catch (error) {
      res.status(400).send(error)
    }    
  },

  addBulkData(req, res) {
    const {data} = req.body

    console.log("DATA", data);

    if (data.length) {
      return req.db.SiswaKamar
        .bulkCreate(data, { 
          fields: ["periode_id","kelas_id", "siswa_id"], 
          returning: true, 
          ignoreDuplicates: true })
        .then((SiswaKamar) => {
          if (SiswaKamar) {
            res.status(201).send('success')
          } else {
            res.status(400).send('error bulk upload')
          }          
        })
        .catch(error => {
          res.status(400).send(error)
        })
    } else {
      res.status(400).send({ 'message': 'Some values are missing' });
    }    
  },

  insertOrUpdate(req, res) {
    const {data} = req.body
    console.log("DATA", data);

    try {
      data.forEach(element => {
        console.log("ELEMENT", element[2], element[0])

        const queryStr = "insert into SiswaKamar (periode_id,siswa_id,kelas_id) VALUES \
            ((SELECT id FROM tahun_ajaran WHERE name=(:periode)), \
            (select id from siswa where no_induk=(:no_induk)),(select id from kelas where kode_kelas=CAST((:kelas_id) AS VARCHAR))) \
            ON CONFLICT(periode_id, siswa_id) DO UPDATE SET kelas_id = EXCLUDED.kelas_id";  
        
        req.db.SiswaKamar.sequelize.query(
          queryStr,      
          {
            replacements: {            
              periode: element[2],
              no_induk: element[1],
              kelas_id: element[0]
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

  insertOrUpdatePeringkat(req, res) {
    const {data} = req.body
    console.log("DATA", data);

    try {
      data.forEach(element => {
        console.log("ELEMENT", element[2])

        const queryStr = "INSERT INTO peringkat_kelas (siswa_kelas_id,semester,sequence) VALUES \
          ((SELECT id FROM SiswaKamar WHERE periode_id=(SELECT id FROM tahun_ajaran WHERE name=(:periode)) \
          AND siswa_id=(SELECT id FROM siswa WHERE no_induk=(:no_induk)) \
          AND kelas_id=(select id from kelas where kode_kelas=CAST((:kelas_id) AS VARCHAR))),(:semester),(:sequence)) \
          ON CONFLICT(siswa_kelas_id, semester) DO UPDATE SET sequence = EXCLUDED.sequence";  
        
        req.db.SiswaKamar.sequelize.query(
          queryStr,      
          {
            replacements: {            
              periode: element[2],
              no_induk: element[0],
              kelas_id: element[1],
              semester: element[3],
              sequence: element[4]
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

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.SiswaKamar
      .findByPk(req.params.id, {})
      .then(SiswaKamar => {
        if (!SiswaKamar) {
          return res.status(404).send({
            message: 'SiswaKamar Not Found',
          });
        }
        return SiswaKamar
          .update({
            id_tahun_ajaran: req.body.id_tahun_ajaran || SiswaKamar.id_tahun_ajaran,
            id_siswa: req.body.id_siswa || SiswaKamar.id_siswa,
            id_kamar: req.body.id_kamar || SiswaKamar.id_kamar,
            nomor_urut: req.body.nomor_urut || SiswaKamar.nomor_urut
          })
          .then(() => res.status(200).send(SiswaKamar))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.SiswaKamar
      .findByPk(req.params.id)
      .then(SiswaKamar => {
        if (!SiswaKamar) {
          return res.status(400).send({
            message: 'SiswaKamar Not Found',
          });
        }
        return SiswaKamar
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};