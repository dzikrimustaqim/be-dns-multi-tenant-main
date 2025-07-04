const { Sequelize, QueryTypes } = require('sequelize');

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
            nama_kamar: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    }

    const query = {
      include:[
        'RayonKamar',
        { 
          model: req.db.Proguser, 
          as: 'ProguserKamar',            
          required:false,            
          include: [
            {
              model: req.db.StaffProfile, 
              as: 'userProfile',            
              required:true,
            }
          ],            
        },
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.Kamar
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Kamar
    .findAll(query)
    .then((Kamar) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': Kamar
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  async getByRayon(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {
      id_rayon: req.query.id_rayon
    };

    const query = {
      include:[
        'RayonKamar',
        { 
          model: req.db.Proguser, 
          as: 'ProguserKamar',            
          required:false,            
          include: [
            {
              model: req.db.StaffProfile, 
              as: 'userProfile',            
              required:true,
            }
          ],            
        },
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.Kamar
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Kamar
    .findAll(query)
    .then((Kamar) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': Kamar
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getByKategori(req, res) {
    return req.db.Kamar
    .findAll({
      where : { kategori: req.query.kategori },
      include:[
        'RayonKamar'
      ],
      order : [
        ['id_rayon', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    })
    .then((Kamar) => res.status(200).send(Kamar))
    .catch((error) => {
      console.log(error); 
      res.status(400).send(error); });
    
  },

  getById(req, res) {
    return req.db.Kamar
      .findByPk(req.params.id, {})
      .then((Kamar) => {
        if (!Kamar) {
          return res.status(404).send({
            message: 'Kamar Not Found',
          });
        }
        return res.status(200).send(Kamar);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    if (!req.body.id_rayon || !req.body.nama_kamar || !req.body.id_musyrifah) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    return req.db.Kamar
      .create({
        id_rayon: req.body.id_rayon,
        nama_kamar: req.body.nama_kamar,
        kuota: req.body.kuota,
        id_musyrifah: req.body.id_musyrifah,
        kategori: req.body.kategori,
        tempat_tidur: req.body.tempat_tidur,
        active: req.body.active
      })
      .then((Kamar) => res.status(201).send(Kamar))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log(req.body);
    if (!req.body.nama_kamar) {
      return res.status(400).send({ 'message': 'Some values are missingXXX' });
    }
  
    return req.db.Kamar
      .findByPk(req.params.id, {})
      .then(Kamar => {
        if (!Kamar) {
          return res.status(404).send({
            message: 'Kamar Not Found',
          });
        }
        return Kamar
          .update({
            id_rayon: req.body.id_rayon || Kamar.id_rayon,
            nama_kamar: req.body.nama_kamar || Kamar.nama_kamar,            
            kuota: req.body.kuota || Kamar.kuota,
            id_musyrifah: req.body.id_musyrifah || Kamar.id_musyrifah,
            kategori: req.body.kategori || Kamar.kategori,
            tempat_tidur: req.body.tempat_tidur || Kamar.tempat_tidur,
            active: req.body.active || Kamar.active
          })
          .then(() => res.status(200).send(Kamar))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Kamar
      .findByPk(req.params.id)
      .then(Kamar => {
        if (!Kamar) {
          return res.status(400).send({
            message: 'Kamar Not Found',
          });
        }
        return Kamar
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  getPeriodeKamarByKamar(req, res) {
    return req.db.PeriodeKamar
      .findOne({
        where : { 
          id_kamar: req.body.id_kamar,
          id_periode: req.body.id_periode
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((PeriodeKamar) => res.status(200).send(PeriodeKamar))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  async getPeriodeKamar(req, res) {
    console.log(req.params);
    console.log(req.body);
    const id_periode = req.params.id;
    const id_gedung = req.body.id_gedung;
    const id_rayon = req.body.id_rayon;

    // init periode kamar
    const qryKamar = "SELECT a.id AS idkamar,a.kuota,a.id_musyrifah FROM kamar a \
        LEFT JOIN periode_kamar b ON a.id=b.id_kamar \
        AND b.id_periode=(:periode) WHERE a.active='t' AND b.id IS NULL"

    const kamar = await req.db.Kamar.sequelize.query(
      qryKamar,      
      {
        replacements: {          
          periode: id_periode,          
        },
        type: QueryTypes.SELECT
      }
    );

    for (dt of kamar) {
      await req.db.PeriodeKamar
        .create({
          id_kamar: dt.idkamar,
          id_periode: id_periode,
          kuota: dt.kuota,
          id_musyrifah: dt.id_musyrifah
        });
    }

    let inClause = [];
    let addWhereClause = "";
    
    if (id_rayon != '') {
      const kamarByRayon = await req.db.Kamar.findAll({
        where: {
          id_rayon: id_rayon
        }
      });
      
      console.log("idrayon", kamarByRayon);

      if (kamarByRayon.length > 0) {
        for (dt of kamarByRayon) {
          inClause.push(dt.id);
        }
      } else {
        inClause = [0];
      }
    } else if (id_gedung != '') {
      const qryKamarGedung = "SELECT a.id FROM kamar a INNER JOIN rayon b \
        ON a.id_rayon=b.id WHERE b.id_gedung=(:gedung)";
      const kamarGedung = await req.db.Kamar.sequelize.query(
        qryKamarGedung,      
        {
          replacements: {          
            gedung: id_gedung,          
          },
          type: QueryTypes.SELECT
        }
      );

      if (kamarGedung.length > 0) {
        console.log(kamarGedung);
        for (dt of kamarGedung) {
          inClause.push(dt.id);
        }
      } else {
        inClause = [0];
      }
    }

    if (inClause.length > 0) {      
      addWhereClause = " AND pk.id_kamar IN(:listIdKamar) ";
    }

    const qryPeriodeKamar = "SELECT pk.id_kamar,pk.kuota,pk.id_periode,km.nama_kamar, \
      sf.real_name AS musyrifah,sf.no_hp1, \
      r.nama_rayon,g.nama_gedung,COUNT(sk.id) AS total_isi,pk.kuota-COUNT(sk.id) AS sisa \
      FROM periode_kamar pk \
      INNER JOIN proguser pu ON pk.id_musyrifah=pu.id \
      INNER JOIN staff_profile sf ON pu.id=sf.id_user \
      INNER JOIN kamar km ON pk.id_kamar=km.id \
      INNER JOIN rayon r ON km.id_rayon=r.id \
      INNER JOIN gedung g ON r.id_gedung=g.id \
      LEFT JOIN siswa_kamar sk ON pk.id_kamar=sk.id_kamar AND sk.id_tahun_ajaran=9 \
      WHERE pk.id_periode=(:periode) "+ addWhereClause + " \
      GROUP BY pk.id_kamar,pk.kuota,pk.id_periode,km.nama_kamar,r.nama_rayon,g.nama_gedung,sf.real_name,sf.no_hp1";

    const periodeKamar = await req.db.PeriodeKamar.sequelize.query(
      qryPeriodeKamar,      
      {
        replacements: {          
          periode: id_periode,
          listIdKamar: inClause
        },
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).send(
      {
        "status":"200",
        "data": periodeKamar
      }
    );

  },
};