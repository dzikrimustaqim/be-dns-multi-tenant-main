const PaketPembayaran = require('../models').PaketPembayaran;
const JenisBayar = require('../models').JenisBayar;
const TahunAjaran = require('../models').TahunAjaran;
const BiayaTahunan = require('../models').BiayaTahunan;
const ItemBiaya = require('../models').ItemBiaya;
const ItemBiayaTahunan = require('../models').ItemBiayaTahunan;
const GroupBiaya = require('../models').GroupBiaya;
const { Sequelize } = require('sequelize');
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
            nama_paket: {
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
      include: [
        'PaketPembayaranLembaga'
      ],       
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.PaketPembayaran
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.PaketPembayaran
    .findAll(query)
    .then((PaketPembayaran) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': PaketPembayaran
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.PaketPembayaran
      .findByPk(req.params.id, {
        include: [
          'PaketBiayaTahunan'
        ]
      })
      .then((PaketPembayaran) => {
        if (!PaketPembayaran) {
          return res.status(404).send({
            message: 'PaketPembayaran Not Found',
          });
        }
        return res.status(200).send(PaketPembayaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByIdLembagaAndPeriod(req, res) {
    return req.db.PaketPembayaran
      .findByPk(req.params.id, {
        include: [
          {
            model: req.db.BiayaTahunan,
            as: 'PaketBiayaTahunan',
            where: { 
              id_periode: req.params.periode,
              // id_lembaga: req.params.id_lembaga == 0 ? null : req.params.id_lembaga, 
            },
          }
        ],
        where: {
          id_lembaga: req.params.id_lembaga == 0 ? null : req.params.id_lembaga, 
        }
      })
      .then((PaketPembayaran) => {
        if (!PaketPembayaran) {
          return res.status(404).send({
            message: 'PaketPembayaran Not Found',
          });
        }
        return res.status(200).send(PaketPembayaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBiayaRegistrasi(req, res) {
    const queryStr = 'select a.nama_paket,b.id as id_biaya_tahunan,sum(c.nilai_biaya) AS total_group_biaya,b.total_biaya,d.id AS group_biaya_id,d.name from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c on b.id=c.id_biaya_tahunan \
    inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e on c.id_item_biaya=e.id \
    where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL AND d.kode=(:kodeBiaya)  GROUP BY d.id,a.nama_paket,b.total_biaya,b.id';

    console.log('queryStr', queryStr);
      return req.db.PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            kodeBiaya: 'BIAYA_PENDAFTARAN',
            idperiode: req.params.periode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getByLembagaAndPeriode(req, res) {
    const queryStr = req.params.id_lembaga == 0 ? 'select a.nama_paket,b.id as id_biaya_tahunan,sum(c.nilai_biaya) AS total_group_biaya,b.total_biaya,d.name from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c on b.id=c.id_biaya_tahunan \
    inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e on c.id_item_biaya=e.id \
    where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL GROUP BY d.id,a.nama_paket,b.total_biaya,b.id' : 'select a.nama_paket,b.id as id_biaya_tahunan,sum(c.nilai_biaya) AS total_group_biaya,b.total_biaya,d.name from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c on b.id=c.id_biaya_tahunan \
    inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e on c.id_item_biaya=e.id \
    where b.id_periode=(:idperiode) AND a.id_lembaga=(:idlembaga) GROUP BY d.id,a.nama_paket,b.total_biaya,b.id';

      return req.db.PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idlembaga: req.params.id_lembaga == 0 ? null : req.params.id_lembaga,
            idperiode: req.params.periode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getByLembagaAndPaketPembayaranAndPeriode(req, res) {
    const queryStr = req.params.id_lembaga == 0 ? 'select a.nama_paket,b.id as id_biaya_tahunan,sum(c.nilai_biaya) AS total_group_biaya,b.total_biaya,d.id AS group_biaya_id,d.name from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c on b.id=c.id_biaya_tahunan \
    inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e on c.id_item_biaya=e.id \
    where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL AND a.id=(:idpaket) GROUP BY d.id,a.nama_paket,b.total_biaya,b.id' : 'select a.nama_paket,b.id as id_biaya_tahunan,sum(c.nilai_biaya) AS total_group_biaya,b.total_biaya,d.id AS group_biaya_id,d.name from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c on b.id=c.id_biaya_tahunan \
    inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e on c.id_item_biaya=e.id \
    where b.id_periode=(:idperiode) AND a.id_lembaga=(:idlembaga) AND a.id=(:idpaket) GROUP BY d.id,a.nama_paket,b.total_biaya,b.id';

      return req.db.PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idlembaga: req.params.id_lembaga == 0 ? null : req.params.id_lembaga,
            idpaket: req.params.id_paket == 0 ? null : req.params.id_paket,
            idperiode: req.params.periode
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getTotalAmountByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res) {
    const queryStr = req.body.id_lembaga == 0 ? 'select sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY a.id' : 'select sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga=(:idlembaga) \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY a.id';

      return req.db.PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idlembaga: req.body.id_lembaga == 0 ? null : req.body.id_lembaga,
            idpaket: req.body.id_paket == 0 ? null : req.body.id_paket,
            idperiode: req.body.periode,
            idgroup: req.body.group_biaya
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getPaketPembayaranRegistrasiByPeriode(req, res) {
    return req.db.PaketPembayaran
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
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  async getPaketPembayaranByLembaga(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    console.log("ID LEMBAGA", req.params.id_lembaga);

    let whereStatement = {
      id_lembaga: req.params.id_lembaga !== '0' ? req.params.id_lembaga : null 
    };
    
    if(searchTerm) {
      whereStatement = {
        [Sequelize.Op.or]: [
          {
            nama_paket: {
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
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.PaketPembayaran
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.PaketPembayaran
    .findAll(query)
    .then((PaketPembayaran) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': PaketPembayaran
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getPaketPembayaranRegistrasiByAktivePeriode(req, res) {
    return req.db.PaketPembayaran
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
      .then((PaketPembayaran) => res.status(200).send(PaketPembayaran))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  add(req, res) {
    console.log(req.body);
    return req.db.PaketPembayaran
      .create({        
        nama_paket: req.body.nama_paket,
        id_lembaga: req.body.id_lembaga === '0' ? null : req.body.id_lembaga,
      })
      .then((PaketPembayaran) => res.status(201).send(PaketPembayaran))
      .catch((error) => {
        console.log("ERR", error);
        res.status(400).send(error)
      });
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.PaketPembayaran
      .findByPk(req.params.id, {})
      .then(PaketPembayaran => {
        if (!PaketPembayaran) {
          return res.status(404).send({
            message: 'PaketPembayaran Not Found',
          });
        }
        return PaketPembayaran
          .update({
            nama_paket: req.body.nama_paket || PaketPembayaran.nama_paket,
            id_lembaga: req.body.id_lembaga === '0' ? null : req.body.id_lembaga,
          })
          .then(() => res.status(200).send(PaketPembayaran))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.PaketPembayaran
      .findByPk(req.params.id)
      .then(PaketPembayaran => {
        if (!PaketPembayaran) {
          return res.status(400).send({
            message: 'PaketPembayaran Not Found',
          });
        }
        return PaketPembayaran
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};