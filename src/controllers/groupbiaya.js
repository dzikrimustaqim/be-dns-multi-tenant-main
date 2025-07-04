const Helper = require('../utils/helper');

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
            name: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    }

    const query = {
      include:[
        'akun',        
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.GroupBiaya
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.GroupBiaya
    .findAll(query)
    .then((GroupBiaya) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': GroupBiaya
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.GroupBiaya
      .findByPk(req.params.id, {
        include: [
          'akun',
          'biayaitems'          
        ]
      })
      .then((GroupBiaya) => {
        if (!GroupBiaya) {
          return res.status(404).send({
            message: 'GroupBiaya Not Found',
          });
        }
        return res.status(200).send(GroupBiaya);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByLembagaAndPeriode(req, res) {
    return req.db.GroupBiaya
      .findAll({
        include:[
          { 
            model: req.db.BiayaTahunan, 
            as: 'groupbiayatahunan',            
            required:false,
            where: {
              id_periode: req.params.periode,
              id_lembaga: req.params.id_lembaga == 0 ? null : req.params.id_lembaga
            }        
          },

        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((GroupBiaya) => res.status(200).send(GroupBiaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getGroupBiayaRegistrasiByPeriode(req, res) {
    return req.db.GroupBiaya
      .findOne({
        where: { id_periode: req.params.periode },
        include:[
          { 
            model: req.db.JenisBayar,
            as: 'PayType', 
            required: true,
            where: { kode_bayar: 'REGISTRASI' },
          },
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((GroupBiaya) => res.status(200).send(GroupBiaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getGroupBiayaRegistrasiByAktivePeriode(req, res) {
    return req.db.GroupBiaya
      .findOne({
        include:[
          { 
            model: req.db.JenisBayar,
            as: 'PayType', 
            required: true,
            where: { kode_bayar: 'REGISTRASI' },
          },
          { 
            model: req.db.TahunAjaran,
            as: 'periode', 
            required: true,
            where: { ppsb: true },
          },
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((GroupBiaya) => res.status(200).send(GroupBiaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  add(req, res) {
    console.log(req.body);
    const kodegroup = Helper.slugify(req.body.name);
    console.log("KODE", kodegroup);
    return req.db.GroupBiaya
      .create({        
        name: req.body.name,
        kode: kodegroup,
        id_akun: req.body.id_akun
      })
      .then((GroupBiaya) => res.status(201).send(GroupBiaya))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.GroupBiaya
      .findByPk(req.params.id, {})
      .then(GroupBiaya => {
        if (!GroupBiaya) {
          return res.status(404).send({
            message: 'GroupBiaya Not Found',
          });
        }
        return GroupBiaya
          .update({
            name: req.body.name || GroupBiaya.name,
            id_akun: req.body.id_akun || GroupBiaya.id_akun
          })
          .then(() => res.status(200).send(GroupBiaya))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.GroupBiaya
      .findByPk(req.params.id)
      .then(GroupBiaya => {
        if (!GroupBiaya) {
          return res.status(400).send({
            message: 'GroupBiaya Not Found',
          });
        }
        return GroupBiaya
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};