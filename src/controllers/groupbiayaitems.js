const GroupBiayaItem = require('../models').GroupBiayaItem;

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
        'akun'
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.GroupBiayaItem
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.GroupBiayaItem
    .findAll(query)
    .then((GroupBiayaItem) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': GroupBiayaItem
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.GroupBiayaItem
      .findByPk(req.params.id, {})
      .then((GroupBiayaItem) => {
        if (!GroupBiayaItem) {
          return res.status(404).send({
            message: 'GroupBiayaItem Not Found',
          });
        }
        return res.status(200).send(GroupBiayaItem);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriode(req, res) {
    return req.db.GroupBiayaItem
      .findAll({
        where: { id_periode: req.params.periode },
        include:[
          { 
            model: req.db.JenisBayar,
            as: 'PayType', 
            required: false,        
          },
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((GroupBiayaItem) => res.status(200).send(GroupBiayaItem))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getGroupBiayaItemRegistrasiByPeriode(req, res) {
    return req.db.GroupBiayaItem
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
      .then((GroupBiayaItem) => res.status(200).send(GroupBiayaItem))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getGroupBiayaItemRegistrasiByAktivePeriode(req, res) {
    return req.db.GroupBiayaItem
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
      .then((GroupBiayaItem) => res.status(200).send(GroupBiayaItem))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  add(req, res) {
    console.log(req.body);
    return req.db.GroupBiayaItem
      .create({        
        id_item_biaya: req.body.id_item_biaya,
        id_group_biaya: req.body.id_group_biaya
      })
      .then((GroupBiayaItem) => res.status(201).send(GroupBiayaItem))
      .catch((error) => {
        console.log("ERR", error);
        res.status(400).send(error)
      });
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.GroupBiayaItem
      .findByPk(req.params.id, {})
      .then(GroupBiayaItem => {
        if (!GroupBiayaItem) {
          return res.status(404).send({
            message: 'GroupBiayaItem Not Found',
          });
        }
        return GroupBiayaItem
          .update({
            id_periode: req.body.id_periode || GroupBiayaItem.id_periode,
            id_jenis_bayar: req.body.id_jenis_bayar || GroupBiayaItem.id_jenis_bayar,
            description: req.body.description || GroupBiayaItem.description,
            jumlah: req.body.jumlah || GroupBiayaItem.jumlah
          })
          .then(() => res.status(200).send(GroupBiayaItem))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.GroupBiayaItem
      .findByPk(req.params.id)
      .then(GroupBiayaItem => {
        if (!GroupBiayaItem) {
          return res.status(400).send({
            message: 'GroupBiayaItem Not Found',
          });
        }
        return GroupBiayaItem
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};