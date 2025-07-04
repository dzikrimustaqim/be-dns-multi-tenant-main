const HasilPpsb = require('../models').HasilPpsb;
const Proguser = require('../models').Proguser;
const StaffProfile = require('../models').StaffProfile;
const JenisBayar = require('../models').JenisBayar;
const TahunAjaran = require('../models').TahunAjaran;
const Money = require('../repositories/money');
const db  = require('../models');
const Helper = require('../utils/helper');
const Tagihan = require('../models').Tagihan;
const VirtualAccount = require('../models').VirtualAccount;
const TagihanItem = require('../models').TagihanItem;
const NilaiUjianPpsb = require('../models').NilaiUjianPpsb;
const Siswa = require('../models').Siswa;
const { QueryTypes } = require('sequelize');

module.exports = {
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {
      id_tahun_ajaran: req.params.idperiode,
    };
    
    // if(searchTerm) {
    //   whereStatement = {
    //     [Sequelize.Op.or]: [
    //       {
    //         nama_Biaya: {
    //           [Sequelize.Op.iLike]: '%' + searchTerm + '%'
    //         }
    //       },
    //     ]
    //   }
    // }

    const query = {
      include:[
        'SiswaHasilPpsb','PaketPembayaranHasilPpsb','Tingkat',
        { 
          model: req.db.Tagihan, 
          as: 'TagihanHasilPpsb',            
          required:false,            
          include: [
            {
              model: req.db.VirtualAccount, 
              as: 'vatagihan',            
              required:false,
              include: [ 'vaBank' ]
            }
          ],            
        },
        { 
          model: req.db.Proguser, 
          as: 'PengujiHasilPpsb',            
          required:true,            
          include: [
            {
              model: req.db.StaffProfile, 
              as: 'userProfile',            
              required:true,
            }
          ],            
        },
        { 
          model: req.db.Proguser, 
          as: 'UserInputHasilPpsb',            
          required:true,            
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

    const count = await req.db.HasilPpsb
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.HasilPpsb
    .findAll(query)
    .then((Biaya) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': Biaya
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  async listNilaiPpsb(req, res) {
    console.log(req.query);
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const idperiode = req.query.idperiode;
    
    let whereStatement = {};
    
    if(searchTerm) {
      whereStatement = {
        [Sequelize.Op.or]: [
          {
            nama_lengkap: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    }

    const query = {
      include:[
        'NilaiUjianMatapelUji',
        { 
          model: req.db.HasilPpsb, 
          as: 'NilaiUjianHasilPpsb',            
          required:true,
          where: {
            id_tahun_ajaran: idperiode
          },            
          include: [
            'TahunAjaranHasilPpsb',
            { 
              model: req.db.Proguser, 
              as: 'PengujiHasilPpsb',            
              required:true,            
              include: [
                {
                  model: req.db.StaffProfile, 
                  as: 'userProfile',            
                  required:true,
                }
              ],            
            },            
            {
              model: req.db.Siswa,
              as: 'SiswaHasilPpsb',
              required:true,
              where: whereStatement,
            },
          ],            
        },
      ],
      offset: offset,
      limit: limit,
      // where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.NilaiUjianPpsb
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.NilaiUjianPpsb
    .findAll(query)
    .then((NilaiUjianPpsb) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': NilaiUjianPpsb
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getHasilSiswaPpsb(req, res) {
    return req.db.HasilPpsb
      .findAll({        
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((HasilPpsb) => res.status(200).send(HasilPpsb))
      .catch((error) => { res.status(400).send(error); });
  },

  getNilaiSiswaPpsb(req, res) {
    const queryStr = req.params.id === '0' ? 'select a.id AS id_matauji, a.nama_studi,b.* from matapel_uji a left join nilai_ujian_ppsb b \
      on a.id=b.id_matapel_uji and b.id_hasil_ppsb IS NULL' : 'select a.id AS id_matauji, a.nama_studi,b.* from matapel_uji a left join nilai_ujian_ppsb b \
      on a.id=b.id_matapel_uji and b.id_hasil_ppsb=(:idhasilppsb)';

    return req.db.NilaiUjianPpsb.sequelize.query(
      queryStr,      
      {
        replacements: {
          idhasilppsb: req.params.id
        },
        type: QueryTypes.SELECT
      }
    )
    .then((NilaiUjianPpsb) =>  {
      return res.status(200).send(NilaiUjianPpsb);
    })
    .catch((error) => {
      console.log(error); 
    });
    
  },

  getById(req, res) {
    return req.db.Biaya
      .findByPk(req.params.id, {})
      .then((Biaya) => {
        if (!Biaya) {
          return res.status(404).send({
            message: 'Biaya Not Found',
          });
        }
        return res.status(200).send(Biaya);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByPeriode(req, res) {
    return req.db.Biaya
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
      .then((Biaya) => res.status(200).send(Biaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getBiayaRegistrasiByPeriode(req, res) {
    return req.db.Biaya
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
      .then((Biaya) => res.status(200).send(Biaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getBiayaRegistrasiByAktivePeriode(req, res) {
    return req.db.Biaya
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
      .then((Biaya) => res.status(200).send(Biaya))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  async add(req, res) {
    console.log('BODY', req.body);

    let idTagihan = "";

    // hanya jika ada biaya
    if (req.body.selectedPaketBiaya.length > 0 && (req.body.status_kelulusan === "lulus_murni" || req.body.status_kelulusan === "lulus_bersyarat")) {

      // get bank
      // const bank = await Money.getBankByKode("BSI");
      // get total tagihan
      const totalTagihan = await Money.getTotalAmountByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res);
  
      console.log("TOTAL", totalTagihan);
  
      // penentuan nomor induk 
      // - 2.23.00874
      // 2 = L, 1 = P
      // 23 = tahun
      // 00874 = sequence siswa lulus
      const siswa = await Money.generateNoInduk(req.body.id_siswa);
      
      console.log("SISWA", siswa);
      const noIndukSiswa = siswa.dataValues.no_induk;
  
      // 1. create tagihan
      // 2. create hasil ppsb
      // 3. create nilai
      
  
      // TODO: 
      // - penentuan tanggal jatuh tempo
      // - create taghan hanya yg lulus
      // - tinjau ulang tipe pembayaran
      // - tinjau ulang jumlah pembayaran saat ini diset 0
      // - update or create VA to API oppal
      // - tinjau ulang id_ref virtual account

      // do not create VA right now
      const CREATE_VA = false;
  
      let tipePembayaran = "CLOSED"; // TODO: next we will change to open
      
      if (CREATE_VA === true) {
        const vaNumber = Helper.generateUangPangkalVANumber(noIndukSiswa);
    
        const branchId =  process.env.BRANCH_ID;
        const vaTypeID = process.env.CLOSE_PAYMENT_VA_TYPE_ID;
        const categoryId = process.env.UANG_PANGKAL_CATEGORY_ID;
    
        const axios = require('axios');
        const apiUrl = process.env.OPPAL_API_END_URL;
        const dateExpired = Helper.getVAExpiredDate(process.env.VA_EXPIRATION);
        const data = {
            "BranchID": branchId,
            "VATypeID": vaTypeID,
            "CategoryID": categoryId,
            "AccountHolder": "Darunnajah Uang pangkal Installment Payment",
            "Amount": totalTagihan,
            "DateExpired": dateExpired,
            "AccountNumber": vaNumber,
            "Notes": ""
        }

        if (process.env.ENVIRONTMENT === "DEV" || process.env.ENVIRONTMENT === "PROD") {
          const config = {
            headers:{
              'content-type': 'text/json',
              'Authorization': 'Basic ' + Helper.generateBasicAuth(process.env.OPPAL_USERNAME, process.env.OPPAL_PASSWORD)
            }
          };
          const makePayment = await axios.post(apiUrl + '/v2/transaction/adm', data, config);
          
          console.log("RESP JASON", makePayment);
          if (makePayment.status === 200) {
            console.log("rESPONSE FROM OPPAL");
            const makePaymentData = makePayment.data.Data;
            console.log("ALLDATA", makePaymentData);
            
            if (makePayment.data.Status === "failed") {
              console.log("FAILED");
              return res.status(400).send(makePaymentData);
            }
            console.log(makePaymentData.Status, makePaymentData.Amount,makePaymentData.DateCreated,makePaymentData.DateExpired, makePaymentData.ID, makePaymentData.AccountHolder);
          }
        }        
      }
  
      // buat tagihan
      // simpan va
      // get last sequence
      
      const lastSequenceTagihan = await db.sequelize.query("SELECT nextval('tagihan_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
      const jsonTagihan = JSON.stringify(lastSequenceTagihan[0], null, 2);
      const objValueTagihan = JSON.parse(jsonTagihan); 
      
      const tagihanNumber = Helper.generateInvoiceNumber(objValueTagihan.nextsequence);
      const dateExpired = Helper.getVAExpiredDate("Y");
      const dateCreated = new Date();

      const newTagihan = await req.db.Tagihan
        .create({
          id_siswa: req.body.id_siswa,
          nomor: tagihanNumber,
          // nilai_tagihan: makePaymentData.Amount,
          nilai_tagihan: totalTagihan,
          // jumlah_pembayaran: makePaymentData.Amount,
          sisa_tagihan: totalTagihan,
          // tanggal_tagihan: makePaymentData.DateCreated,
          tanggal_tagihan: dateCreated,
          // tanggal_jatuh_tempo: makePaymentData.DateExpired,
          tanggal_jatuh_tempo: dateExpired,
          // keterangan: makePaymentData.Category,
          keterangan: 'Uang Pangkal',
          // id_kode_biaya: idKodeBiaya,
          tipe_pembayaran: tipePembayaran
        });
  
  
      console.log("NEW TAGIHAN", newTagihan);    
  
      if (newTagihan) {
        idTagihan = newTagihan.id;
        // simpan VA
        // DO not simpan VA right now
        /*
        try {
          await VirtualAccount
          .create({
            id_bank: bank.id,
            id_tagihan: idTagihan,
            prefix: process.env.UANG_PANGKAL_BILLER_PREFIX,
            nomor: makePaymentData.AccountNumber,
            id_ref: makePaymentData.ID,
            va_status: 'CREATE'
          });
        } catch (e) {
          console.log(e);
          return res.status(400).send(e);
        }
        */
  
        // also save tagihan item
        try {
  
          const gbiaya = await Money.getItemTagihanByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res);
  
          console.log('GBIAYA', gbiaya);
  
          for (let i = 0; i < gbiaya.length; i++)  {
            console.log(gbiaya[i].id);
            console.log(gbiaya[i].name);
            await req.db.TagihanItem
            .create({
              id_tagihan: idTagihan,
              id_group_biaya: gbiaya[i].id,
              item: gbiaya[i].name,
              amount: gbiaya[i].total_group_biaya,
              tanggal_mulai_ditagih: dateCreated
            });
          }
  
        } catch (e) {
          console.log(e);
          return res.status(400).send(e);
        }
      
      } else {
        return res.status(400).send(e);
      }
      
      
    }
    
    const hasil = await req.db.HasilPpsb
      .create({    
        id_siswa: req.body.id_siswa,
        id_tahun_ajaran: req.body.id_tahun_ajaran,
        id_penguji: req.body.id_penguji,
        id_user_input: req.body.id_user_input,
        status_kelulusan: req.body.status_kelulusan,
        id_lembaga: req.body.id_lembaga,
        id_tingkat: req.body.id_tingkat,
        id_lembaga_biaya: req.body.id_lembaga_biaya || null,
        id_paket_biaya: req.body.id_paket_biaya || null,
        id_tagihan: idTagihan === "" ? null : idTagihan,
        id_gelombang: req.body.id_gelombang,
        catatan_penguji: req.body.catatan_penguji
      });

    // Bulk insert
    let finDataToSave = [];

    const allNilaiSiswa = req.body.nilaiSiswaNya;
    for (let i = 0; i < allNilaiSiswa.length; i++)  {
      console.log('idmatauji', allNilaiSiswa[i].id_matauji);
      const objToSave = {};

      objToSave['id_hasil_ppsb'] = hasil.id;
      objToSave['id_matapel_uji'] = allNilaiSiswa[i].id_matauji;
      objToSave['nilai'] = allNilaiSiswa[i].nilai || 0;
      objToSave['keterangan'] = allNilaiSiswa[i].keterangan;
      
      finDataToSave.push(objToSave);
    }

    await NilaiUjianPpsb.bulkCreate(finDataToSave, { fields: ["id_hasil_ppsb", "id_matapel_uji","nilai","keterangan"], returning: true })

    // update tahapan pendaftaran
    if (req.body.status_kelulusan === "lulus_murni" || req.body.status_kelulusan === "lulus_bersyarat") {
      const siswaNya = await req.db.Siswa.findByPk(req.body.id_siswa, {});
      await siswaNya.update({
        current_status: "ENTRY_TUITION_FEE",
      });
    }

    return res.status(200).send(hasil);
  },

  async update(req, res) {
    console.log('req.body', req.body)

    let idTagihan = "";
    let tipePembayaran = "CLOSED"; // TODO: next we will change to open

    // check for no induk
    // if (req.body.status_kelulusan === "lulus_murni" || req.body.status_kelulusan === "lulus_bersyarat") {
    //   await Money.generateNoInduk(req.body.id_siswa);
    // } 
    
    // hanya jika ada biaya
    if (req.body.selectedPaketBiaya.length > 0 && req.body.id_tagihan === null && (req.body.status_kelulusan === "lulus_murni" || req.body.status_kelulusan === "lulus_bersyarat")) {
      const totalTagihan = await Money.getTotalAmountByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res);
      const lastSequenceTagihan = await db.sequelize.query("SELECT nextval('tagihan_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
      const jsonTagihan = JSON.stringify(lastSequenceTagihan[0], null, 2);
      const objValueTagihan = JSON.parse(jsonTagihan); 
      const tagihanNumber = Helper.generateInvoiceNumber(objValueTagihan.nextsequence);
      const dateExpired = Helper.getVAExpiredDate("Y");
      const dateCreated = new Date();

      const newTagihan = await req.db.Tagihan
        .create({
          id_siswa: req.body.id_siswa,
          nomor: tagihanNumber,
          nilai_tagihan: totalTagihan,
          sisa_tagihan: totalTagihan,
          tanggal_tagihan: dateCreated,
          tanggal_jatuh_tempo: dateExpired,
          keterangan: 'Uang Pangkal',
          tipe_pembayaran: tipePembayaran
        });
  
  
      console.log("NEW TAGIHAN", newTagihan);          
      
      if (newTagihan) {
        idTagihan = newTagihan.id;
  
        // also save tagihan item
        try {
  
          const gbiaya = await Money.getItemTagihanByLembagaAndPaketPembayaranAndPeriodeAndGroupBiaya(req, res);
  
          console.log('GBIAYA', gbiaya);
  
          for (let i = 0; i < gbiaya.length; i++)  {
            console.log(gbiaya[i].id);
            console.log(gbiaya[i].name);
            await req.db.TagihanItem
            .create({
              id_tagihan: idTagihan,
              id_group_biaya: gbiaya[i].id,
              item: gbiaya[i].name,
              amount: gbiaya[i].total_group_biaya
            });
          }
  
        } catch (e) {
          console.log(e);
          return res.status(400).send(e);
        }
      
      } else {
        return res.status(400).send(e);
      }
    }

    const hasil = await req.db.HasilPpsb.findByPk(req.params.id, {});

    console.log('HASIL', hasil);
    if (hasil) {
      hasil.update({
        id_siswa: req.body.id_siswa || hasil.id_siswa,
        id_tahun_ajaran: req.body.id_tahun_ajaran || hasil.id_tahun_ajaran,
        id_penguji: req.body.id_penguji || hasil.id_penguji,
        id_user_input: req.body.id_user_input || hasil.id_user_input,
        status_kelulusan: req.body.status_kelulusan || hasil.status_kelulusan,
        id_lembaga: req.body.id_lembaga || hasil.id_lembaga,
        id_tingkat: req.body.id_tingkat || hasil.id_tingkat,
        id_lembaga_biaya: req.body.id_lembaga_biaya || hasil.id_lembaga_biaya,
        id_paket_biaya: req.body.id_paket_biaya || hasil.id_paket_biaya,
        id_tagihan: idTagihan === "" ? req.body.id_tagihan : idTagihan,
        id_gelombang: req.body.id_gelombang || hasil.id_gelombang,
        catatan_penguji: req.body.catatan_penguji || hasil.catatan_penguji
      });
      
      // Bulk insert
      // let finDataToSave = [];
  
      const allNilaiSiswa = req.body.nilaiSiswaNya;
      for (let i = 0; i < allNilaiSiswa.length; i++)  {
        const oldData = await req.db.NilaiUjianPpsb.findOne(
          {
            where : { id_hasil_ppsb: hasil.id, id_matapel_uji: allNilaiSiswa[i].id_matauji }
          });

        if (oldData) {
          await oldData.update({
            nilai: allNilaiSiswa[i].nilai || oldData.nilai,
            keterangan: allNilaiSiswa[i].keterangan || oldData.keterangan
          });
        }

        // console.log('idmatauji', allNilaiSiswa[i].id_matauji);
        // const objToSave = {};
  
        // objToSave['id_hasil_ppsb'] = hasil.id;
        // objToSave['id_matapel_uji'] = allNilaiSiswa[i].id_matauji;
        // objToSave['nilai'] = allNilaiSiswa[i].nilai || 0;
        // objToSave['keterangan'] = allNilaiSiswa[i].keterangan;
        
        // finDataToSave.push(objToSave);
      }
  
      // await NilaiUjianPpsb.bulkCreate(finDataToSave, { 
      //   fields: ["id_hasil_ppsb", "id_matapel_uji","nilai","keterangan"],
      //   updateOnDuplicate: ["nilai", "keterangan"], 
      //   returning: true 
      // })
    } else {
      return res.status(404).send({
        message: 'Hasil PPSB Not Found',
      });
    }

    return res.status(200).send(hasil);
  },

  async delete(req, res) {
    // actually just delete the tagihan automatically delete hasil ppsb
    
    const hasil = await req.db.HasilPpsb.findByPk(req.params.id);
    const idTagihan = hasil.id_tagihan;

    const tagihan = await req.db.Tagihan.findByPk(idTagihan);

    console.log('TAGIHAN', tagihan);

    const del = tagihan.destroy();

    return res.status(200).send(del);

    // const deleteTagihan = Tagihan.

    // return HasilPpsb
    //   .findByPk(req.params.id)
    //   .then(HasilPpsb => {
    //     if (!HasilPpsb) {
    //       return res.status(400).send({
    //         message: 'Hasil Ppsb Not Found',
    //       });
    //     }
    //     return HasilPpsb
    //       .destroy()
    //       .then(() => res.status(204).send())
    //       .catch((error) => res.status(400).send(error));
    //   })
    //   .catch((error) => res.status(400).send(error));
  },

  async generateVaDanaPangkal(req, res) {
    const idTagihan = req.body.id_tagihan;
    const noIndukSiswa = req.body.no_induk;
    const totalTagihan = req.body.nilai_tagihan;
    const vaNumber = Helper.generateUangPangkalVANumber(noIndukSiswa);
    
    const branchId =  process.env.BRANCH_ID;
    const vaTypeID = process.env.CLOSE_PAYMENT_VA_TYPE_ID;
    const categoryId = process.env.UANG_PANGKAL_CATEGORY_ID;

    // get tagihan
    const tagihan = await req.db.Tagihan.findByPk(idTagihan, {});

    const bank = await Money.getBankByKode("BSI");

    const axios = require('axios');
    const apiUrl = process.env.OPPAL_API_END_URL;
    // const dateExpired = process.env.ENVIRONTMENT === "local" ? Helper.getVAExpiredDate("N") : Helper.getVAExpiredDate(process.env.VA_EXPIRATION);
    const data = {
        "BranchID": branchId,
        "VATypeID": vaTypeID,
        "CategoryID": categoryId,
        "AccountHolder": "Darunnajah Uang pangkal Installment Payment",
        "Amount": tagihan.nilai_tagihan,
        "DateExpired": tagihan.tanggal_jatuh_tempo,
        "AccountNumber": vaNumber,
        "Notes": ""
    }
    const config = {
      headers:{
        'content-type': 'text/json',
        'Authorization': 'Basic ' + Helper.generateBasicAuth(process.env.OPPAL_USERNAME, process.env.OPPAL_PASSWORD)
      }
    };
    // comment this for testing purpose
    const makePayment = await axios.post(apiUrl + '/v2/transaction/adm', data, config);

    // uncomment this for testing purpose
    // const makePayment = await axios.get(apiUrl + '/v2/transaction/adm/id/673cffb0-44ef-4835-899b-8c32966c1a83', config);
    
    console.log("RESP JASON", makePayment);
    
    if (makePayment.status === 200) {
      console.log("rESPONSE FROM OPPAL");
      const makePaymentData = makePayment.data.Data;
      console.log("ALLDATA", makePaymentData);
      
      if (makePayment.data.Status === "failed") {
        console.log("FAILED");
        return res.status(400).send(makePaymentData);
      }
      console.log(makePaymentData.Status, makePaymentData.Amount,makePaymentData.DateCreated,makePaymentData.DateExpired, makePaymentData.ID, makePaymentData.AccountHolder);

      // Save VA
      try {
        const newVa = await req.db.VirtualAccount
        .create({
          id_bank: bank.id,
          prefix: process.env.UANG_PANGKAL_BILLER_PREFIX,
          nomor: makePaymentData.AccountNumber,
          total_amount: makePaymentData.Amount,
          date_expired: makePaymentData.DateExpired,
          id_ref: makePaymentData.ID,
          va_status: 'CREATE'
        });

        console.log("UPDATE TAGIHAN", newVa.id);
        await tagihan.update({
          id_virtual_account: newVa.id
        });
      } catch (e) {
        console.log(e);
        return res.status(400).send(e);
      }

      return res.status(200).send({
        message: 'No VA berhasil dibuat',
      });
    } else {
      return res.status(400).send(hasil);    
    }
  },
};