const PaketPembayaran = require('../models').PaketPembayaran;
const NomorIndukSequence = require('../models').NomorIndukSequence;
const Bank = require('../models').Bank;
const Siswa = require('../models').Siswa;
const { QueryTypes } = require('sequelize');
const db  = require('../models');
const Helper = require('../utils/helper');

module.exports = {

  getItemTagihanByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res) {
    const queryStr = req.body.id_lembaga_biaya == 0 ? 'select d.id,d.name,sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY d.id,d.name' : 'select d.id,d.name,sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga=(:idlembaga) \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY d.id,d.name';

      return PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idlembaga: req.body.id_lembaga_biaya == 0 ? null : req.body.id_lembaga_biaya,
            idpaket: req.body.id_paket_biaya == 0 ? null : req.body.id_paket_biaya,
            idperiode: req.body.id_tahun_ajaran,
            idgroup: req.body.selectedPaketBiaya
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) =>  {
        return PaketPembayaran;
      })
      .catch((error) => {
        console.log(error); 
      });
  },

  getTotalAmountByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res) {
    const queryStr = req.body.id_lembaga_biaya == 0 ? 'select sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga IS NULL \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY a.id' : 'select sum(c.nilai_biaya) AS total_group_biaya from paket_pembayaran a \
    inner join biaya_tahunan b on a.id=b.id_paket_pembayaran inner join item_biaya_tahunan c \
    on b.id=c.id_biaya_tahunan inner join group_biaya d on c.id_group_biaya=d.id inner join item_biaya e \
    on c.id_item_biaya=e.id where b.id_periode=(:idperiode) AND a.id_lembaga=(:idlembaga) \
    AND a.id=(:idpaket) AND d.id IN(:idgroup) GROUP BY a.id';

      return PaketPembayaran.sequelize.query(
        queryStr,      
        {
          replacements: {            
            idlembaga: req.body.id_lembaga_biaya == 0 ? null : req.body.id_lembaga_biaya,
            idpaket: req.body.id_paket_biaya == 0 ? null : req.body.id_paket_biaya,
            idperiode: req.body.id_tahun_ajaran,
            idgroup: req.body.selectedPaketBiaya
          },
          type: QueryTypes.SELECT
        }
      )
      .then((PaketPembayaran) =>  {
        return PaketPembayaran[0].total_group_biaya;
      })
      .catch((error) => {
        console.log(error); 
      });
  },

  getBankByKode(kodeBank) {
    return Bank
      .findOne({
        where : { kode: kodeBank },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Bank) => {
        return Bank;
      })
      .catch((error) => {
        console.log(error); 
      });
  },

  async generateNoInduk(id_siswa) {

    
    return Siswa
    .findByPk(id_siswa, {})
    .then(async Siswa => {
      if (!Siswa) {
        return false;
      }
      
      var noInduk = Siswa.no_induk;

      if (noInduk === null) {
        // get last sequence
        const noIndukSeq = await NomorIndukSequence.findOne({
          where : { 
            angkatan: Siswa.angkatan,
            gender: Siswa.gender
          },
        });

        if (!noIndukSeq) {
          await NomorIndukSequence.create({
            angkatan: Siswa.angkatan,
            gender: Siswa.gender
          });
        }

        const trans = await NomorIndukSequence.sequelize.transaction(async(t) => {
          const noIndukSeq = await NomorIndukSequence.findOne({
            where : { 
              angkatan: Siswa.angkatan,
              gender: Siswa.gender
            },
            lock: true, transaction: t
          });
            
          noIndukSeq.sequence++
          await noIndukSeq.save({transaction:t})

          return noIndukSeq;
        })

        console.log("NO INDUK ", trans.dataValues);

        const nextSequence = trans.dataValues.sequence;
        console.log("NO INDUK SEQUENCE", Siswa.gender, Siswa.angkatan, nextSequence);

        noInduk = Helper.generateNoInduk(Siswa.gender, Siswa.angkatan, nextSequence);
      }
          
      return Siswa
          .update({
            no_induk: noInduk,
          })
          .then(() => {
            return Siswa;
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },

};