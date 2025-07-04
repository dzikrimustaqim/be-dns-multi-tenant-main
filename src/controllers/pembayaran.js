const Helper = require('../utils/helper');
const Siswa = require('../models').Siswa;
const Kelas = require('../models').Kelas;
const Tagihan = require('../models').Tagihan;
const TagihanItem = require('../models').TagihanItem;
const VirtualAccount = require('../models').VirtualAccount;
const Pembayaran = require('../models').Pembayaran;
const GroupBiaya = require('../models').GroupBiaya;
const db  = require('../models');
const { Sequelize, QueryTypes } = require('sequelize');

module.exports = {
  getTagihanFormulirByStudent(req, res) {
    return Tagihan
      .findOne({
        where : { 
          id_siswa: req.body.idsiswa,
          status_tagihan: 'AKTIF'
        },
        include: [
          {
            model: TagihanItem, 
            as: 'TagihanItem',            
            required:true,
            where: {
              id_group_biaya: req.body.idgroupbiaya
            }
          }
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Bank) => res.status(200).send(Bank))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  async getAllPembayaranFormulir(req, res) {

    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const idLembaga = req.query.idLembaga || null;
    const idTingkat = req.query.idTingkat || null;
    
    let whereStatement = {
      status: 'REG',
    };
    
    if(searchTerm) {
      console.log("SEARCHTERM", searchTerm);
      whereStatement = {
        [Sequelize.Op.and]: [
          {
            status: 'REG',
          },
        ],
        [Sequelize.Op.or]: [
          {
            nama_lengkap: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
          {
            regnumber: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },          
        ]
      }
    }

    let whereMainTableStatement = {};
    if (startDate !== null && endDate !== null) {
      var endOfDate = endDate + " 23:59:59";
      console.log("STAR DATE", startDate, endOfDate);

      whereMainTableStatement[Sequelize.Op.and] = [
        {
          waktu_transaksi: {
            [Sequelize.Op.between]: [startDate, endOfDate]
          }
        },
      ];
    }

    if (idLembaga !== null) {
      whereStatement[Sequelize.Op.and] = [
        {
          lembaga_tujuan: idLembaga,
        },
      ];
      
      if (idTingkat !== null) {
        whereStatement[Sequelize.Op.and] = [
          {
            tingkat_id: idTingkat
          },
        ];
      }
    }

    const query = {
      include:[
        { 
          model: Tagihan, 
          as: 'pembayaranTagihan',            
          required:true,
          include: [
            {
              model: Siswa, 
              as: 'siswaTagihan',            
              required:true,
              where: whereStatement,
              include: [
                'lembaga','tingkat'
              ]
            },
            {
              model: VirtualAccount, 
              as: 'vatagihan',            
              required:false,
              include: [ 'vaBank' ],
              where: { prefix: '1366' }
            }
          ],
          // where: { id_kode_biaya: 3 }
        },
      ],
      offset: offset,
      limit: limit,
      where: whereMainTableStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await Pembayaran
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return Pembayaran
      .findAll(query)
      .then((Siswa) => {
        res.status(200).send(
          {
            'totalrows': count,
            'data': Siswa
          }
        )
      })
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); 
      });
  },

  async checkStatusVa(req, res) {
    const axios = require('axios');
    const apiUrl = process.env.OPPAL_API_END_URL;
    
    const config = {
      headers:{
        'content-type': 'text/json',
        'Authorization': 'Basic ' + Helper.generateBasicAuth(process.env.OPPAL_USERNAME, process.env.OPPAL_PASSWORD)
      }
    };

    try {
      const makePayment = await axios.get(apiUrl + '/v2/transaction/adm/id/' + req.body.idtransaction, config);

      return res.status(200).send(makePayment.data);
    } catch (e) {
      console.log(e);
      return res.status(400).send({ 'message': 'Error get va status' });
    }
  },

  async makeManualBiayaFormulir(req, res) {
    console.log('req.body', req.body)

    if (!req.body.amount || !req.body.idsiswa || !req.body.idgroupbiaya || !req.body.namaGroupBiaya) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    // get last sequence 
    const lastSequence = await db.sequelize.query("SELECT nextval('va_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
    const json = JSON.stringify(lastSequence[0], null, 2);
    const objValue = JSON.parse(json); 
    
    const vaNumber = Helper.generateRegNumber(objValue.nextsequence, 8);
    const amount = req.body.amount;
    const category = req.body.namaGroupBiaya

    const lastSequenceTagihan = await db.sequelize.query("SELECT nextval('tagihan_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
    const jsonTagihan = JSON.stringify(lastSequenceTagihan[0], null, 2);
    const objValueTagihan = JSON.parse(jsonTagihan); 
    
    const tagihanNumber = Helper.generateInvoiceNumber(objValueTagihan.nextsequence);

    const idGroupBiaya = parseInt(req.body.idgroupbiaya);
    console.log("req.body.idgroupbiaya", idGroupBiaya);
    const dateExpired = process.env.ENVIRONTMENT === "local" ? Helper.getVAExpiredDate("N") : Helper.getVAExpiredDate("M");
    const dateCreated = new Date();
    const monthInvoice = dateCreated.getMonth();
    const yearInvoice = dateCreated.getFullYear();

    const newTagihan = await Tagihan
    .create({
      id_siswa: req.body.idsiswa,
      nomor: tagihanNumber,
      nilai_tagihan: amount,
      bulan_tagihan: monthInvoice,
      tahun_tagihan: yearInvoice,
      tanggal_tagihan: dateCreated,
      tanggal_jatuh_tempo: dateExpired,
      keterangan: category
    });

    console.log("NEW TAGIHAN", newTagihan);
    
    if (newTagihan) {
      // create tagihan_item 
      const tagihanItem = await TagihanItem
      .create({
        id_tagihan: newTagihan.id,
        id_group_biaya: idGroupBiaya,
        deskripsi: category,
        original_amount: amount,
        amount: amount
      });
    } else {
      return res.status(400).send(e);
    }

    return res.status(200).send(newTagihan);

  },

  async makeBiayaFormulir(req, res) {
    console.log('req.body', req.body)

    if (!req.body.amount || !req.body.idsiswa || !req.body.idbank || !req.body.idgroupbiaya || !req.body.namaGroupBiaya) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    // get last sequence 
    const lastSequence = await db.sequelize.query("SELECT nextval('va_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
    const json = JSON.stringify(lastSequence[0], null, 2);
    const objValue = JSON.parse(json); 
    
    const vaNumber = Helper.generateRegNumber(objValue.nextsequence, 8);

    // get branchID, vaTypeID, CategoryID
    // set AccountHolder, Amount, DateExpired, Notes
    const branchId =  process.env.BRANCH_ID;
    const vaTypeID = process.env.CLOSE_PAYMENT_VA_TYPE_ID;
    const categoryId = process.env.REG_FEE_CATEGORY_ID;
    const amount = req.body.amount;

    const axios = require('axios');
    const apiUrl = process.env.OPPAL_API_END_URL;
    
    const config = {
      headers:{
        'content-type': 'text/json',
        'Authorization': 'Basic ' + Helper.generateBasicAuth(process.env.OPPAL_USERNAME, process.env.OPPAL_PASSWORD)
      }
    };

    const dateExpired = process.env.ENVIRONTMENT === "local" ? Helper.getVAExpiredDate("N") : Helper.getVAExpiredDate("M");

    const data = {
      "BranchID": branchId,
      "VATypeID": vaTypeID,
      "CategoryID": categoryId,
      "AccountHolder": "Darunnajah Uang pendaftaran Payment",
      "Amount": amount,
      "DateExpired": dateExpired,
      "AccountNumber": vaNumber,
      "Notes": ""
    }

    const makePayment = await axios.post(apiUrl + '/v2/transaction/adm', data, config);

    // uncomment this for testing purpose
    // const makePayment = await axios.get(apiUrl + '/v2/transaction/adm/id/9fdb6c87-a9f3-498a-b685-b91fd06e36cf', config);
    
    console.log("RESP JASON", makePayment);

    const tipePembayaran = "CLOSED";

    if (makePayment.status === 200) {
      console.log("rESPONSE FROM OPPAL");
      const makePaymentData = makePayment.data.Data;
      console.log("ALLDATA", makePaymentData);
      
      if (makePayment.data.Status === "failed") {
        console.log("FAILED");
        return res.status(400).send(makePaymentData);
      }
      console.log(makePaymentData.Status, makePaymentData.Amount,makePaymentData.DateCreated,makePaymentData.DateExpired, makePaymentData.ID, makePaymentData.AccountHolder);
      // buat tagihan
      // simpan va
      // get last sequence 
      const lastSequenceTagihan = await db.sequelize.query("SELECT nextval('tagihan_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
      const jsonTagihan = JSON.stringify(lastSequenceTagihan[0], null, 2);
      const objValueTagihan = JSON.parse(jsonTagihan); 
      
      const tagihanNumber = Helper.generateInvoiceNumber(objValueTagihan.nextsequence);

      // dummy data for test
      // makePaymentData.Amount = 200000;
      // makePaymentData.DateCreated = new Date();
      // makePaymentData.DateExpired - new Date();
      // makePaymentData.Category = "";
      // makePaymentData.AccountNumber = "1300000007";
      // makePaymentData.ID = "4dd82be3-58ed-1623-8b7f-468ebe474014";

      const idGroupBiaya = parseInt(req.body.idgroupbiaya);
      console.log("req.body.idgroupbiaya", idGroupBiaya);
      const newTagihan = await Tagihan
      .create({
        id_siswa: req.body.idsiswa,
        nomor: tagihanNumber,
        nilai_tagihan: makePaymentData.Amount,
        sisa_tagihan: makePaymentData.Amount,
        tanggal_tagihan: makePaymentData.DateCreated,
        tanggal_jatuh_tempo: makePaymentData.DateExpired,
        keterangan: makePaymentData.Category,
        tipe_pembayaran: tipePembayaran
      });

      console.log("NEW TAGIHAN", newTagihan);
      
      if (newTagihan) {
        // create tagihan_item 
        const tagihanItem = await TagihanItem
        .create({
          id_siswa: req.body.idsiswa,
          id_tagihan: newTagihan.id,
          id_group_biaya: idGroupBiaya,
          item: makePaymentData.Category,
          qty: 1,
          amount: makePaymentData.Amount,
          tanggal_mulai_ditagih: makePaymentData.DateCreated,
        });

        // simpan VA
        console.log("AccountNumber", makePaymentData.AccountNumber);
        try {
          const newVa = await VirtualAccount
          .create({
            id_bank: req.body.idbank,
            prefix: process.env.REG_FEE_BILLER_PREFIX,
            nomor: makePaymentData.AccountNumber,
            total_amount: makePaymentData.Amount,
            date_expired: makePaymentData.DateExpired,
            id_ref: makePaymentData.ID,
            va_status: 'CREATE'
          });
          
          // update tagihan virtual account
          console.log("UPDATE TAGIHAN", newVa.id);
          await newTagihan.update({
            id_virtual_account: newVa.id
          });
        } catch (e) {
          // console.error(e);
          return res.status(400).send(e);
        }
      } else {
        return res.status(400).send(e);
      }

    }

    return res.status(200).send(makePayment.data);
  },

  async makePembayaranTunai(req, res) {
    console.log('req.body', req.body)
    if (!req.body.id || !req.body.waktu_transaksi || !req.body.jumlah || req.body.jenis_pembayaran) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    // 1. check tagihan
    // 2. 
    try {
      
    } catch (error) {
      
    }

  },

  async makePembayaran(req, res) {
    console.log('req.body', req.body)

    if (!req.body.TransactionID || !req.body.ID || !req.body.Account) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    if (req.body.Status !== "completed" && req.body.Status !== "sukses") {
      return res.status(400).send({ 'message': 'Payment Failed' });
    }

    // 1. get va by id_ref
    // 2. create pembayaran
    // 3. update va status
    // 4. update tagihan status

    
    try {
      const va = await VirtualAccount
        .findOne({
          where : { id_ref: req.body.ID },
          order : [
            ['createdAt', 'DESC'],
            ['createdAt', 'DESC'],
          ],
        });

        if (va) {
          // console.log(va.va_status);
          // if (va.va_status === "NONAKTIF") {
          //   return res.status(200).send("VA tidak aktif");
          // }
          
          // TODO:
          // check type of va (close/open)
          // close prefix 1366, 1566
          // open payment 1466

          // 1. get all tagihan
          const allTagihan = await Tagihan
          .findAll({
            include: [
              'pembayaran'
            ],
            where: { 
              id_virtual_account: va.id
            }
          });
          
          console.log("PEMBAYARAN", allTagihan);

          for (dt of allTagihan) {
            // await dt.destroy();
            console.log('dt', dt.id, dt.id_virtual_account,dt.pembayaran,"Y");

            if (dt.pembayaran === null) {
              await dt.update({
                jumlah_pembayaran: dt.nilai_tagihan,
                status_pembayaran: 'LUNAS',
                sisa_tagihan: 0
              });

              // save pembayaran
              const payment = await Pembayaran
              .create({
                id_tagihan: dt.id,
                id_bank: va.id_bank,
                waktu_transaksi: req.body.ModifiedDate,
                jumlah: req.body.Amount,
                jenis_pembayaran: 'VIRTUAL_ACCOUNT',
                keterangan: req.body.AccountHolder
              });              

            }
          }

          if (va.external_id === null) {
            await va
              .update({
                va_status: 'NONAKTIF',
                external_id: req.body.TransactionID
              });
          }

          return res.status(200).send("Sukses");

        } else {
          return res.status(200).send("Error VA is not available");
        }
    } catch (e) {
      console.log(e);
      return res.status(400).send("Error payment VA");
    }


    return res.status(200).send("OK");
  },

  async getAllUnpaidTagihanByGroupBiaya(req, res) {
    console.log("PAYLOAD UNPAID", req.body);

    const tipe = req.body.tipe;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    const selected_group_biaya = req.body.selectedGroupBiayaValue;
    const from_beginning_tagihan = req.body.from_beginning_tagihan;
    const from_bulan_tagihan = req.body.from_bulan_tagihan;
    const from_tahun_tagihan = req.body.from_tahun_tagihan;
    const end_bulan_tagihan = req.body.end_bulan_tagihan;
    const end_tahun_tagihan = req.body.end_tahun_tagihan;
    const firstDate = Helper.getFirstDateBulanan(from_bulan_tagihan, from_tahun_tagihan);
    const endDate = Helper.getLastDateBulanan(end_bulan_tagihan, end_tahun_tagihan);

    let addQueryDateRange = "";
    if (from_beginning_tagihan == true) {
      // parse from date
      addQueryDateRange = " AND t.tanggal_tagihan<=(:toDate) "
      // parse end date 
    } else {
      addQueryDateRange = " AND t.tanggal_tagihan>=(:fromDate) AND t.tanggal_tagihan<=(:toDate) "
    }
    
    var qryListKelas = "";
    var addQryListKelas = "";
    var idKelas = [];
    var listIdSiswa = [];

    if (tipe == "Group") {
      if (id_lembaga != "") {
        var addQuery = "";
        if (id_tingkat != "") {
          addQuery = " AND b.id_tingkat=(:tingkat) "
        }
        qryListKelas = "SELECT a.kelas_id from siswakelas a INNER JOIN kelas b ON a.kelas_id=b.id \
          INNER JOIN tingkat c ON b.id_tingkat=c.id INNER JOIN lembaga d ON c.id_lembaga=d.id \
          WHERE d.id=(:lembaga) "+ addQuery +" GROUP BY a.kelas_id";
        
        const listKelas = await Kelas.sequelize.query(
          qryListKelas,      
          {
            replacements: {
              lembaga: id_lembaga,
              tingkat: id_tingkat
            },
            type: QueryTypes.SELECT
          }
        );
  
        console.log("KELAS",listKelas);
        if (listKelas.length > 0) {
          for (dt of listKelas) {
            idKelas.push(dt.kelas_id);
          }
        }
  
        if (idKelas.length > 0) {
          addQryListKelas = " AND a.kelas_id IN(:kelas) ";
        } else {
          addQryListKelas = " AND a.kelas_id ISNULL ";
        }
      }
    } else {      
      const allSiswa = req.body.list_siswa;

      
      for (let dtSiswa of allSiswa) {
        listIdSiswa.push(dtSiswa.id);
      }
      addQryListKelas = " AND a.siswa_id IN(:siswa) "
    }
    
    var resTagihanBulan = [];
    try {
      const qryTagihanBulan = "WITH tagihan_siswa AS (SELECT SUM(ti.amount) AS amount,ti.id_siswa AS idsiswa \
        FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan WHERE ti.id_group_biaya IN(:groupBiaya) \
        "+ addQueryDateRange +" AND t.status_pembayaran='BELUM_DIBAYAR' \
        GROUP BY ti.id_siswa) \
          SELECT a.kelas_id,c.nama_kelas,b.id,b.no_induk,b.nama_lengkap,b.status,ts.*\
          FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
          INNER JOIN kelas c ON c.id=a.kelas_id INNER JOIN tagihan_siswa ts ON ts.idsiswa=b.id\
          WHERE a.periode_id=(:periode) " + addQryListKelas + " ORDER BY c.nama_kelas,b.nama_lengkap;";
        
      const tagihan = await TagihanItem.sequelize.query(
        qryTagihanBulan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            kelas: idKelas,
            siswa: listIdSiswa,
            groupBiaya: selected_group_biaya,
            fromDate: firstDate,
            toDate: endDate
          },
          type: QueryTypes.SELECT
        }
      );

      return res.status(200).send(
        {
          'data': tagihan
        }
      )

    } catch (error) {
      console.log(error);
    }    
  },

  async getAllUnpaidTagihanByGroupBiayaPerItem(req, res) {
    console.log("PAYLOAD UNPAIDX", req.body);

    const tipe = req.body.tipe;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    const selected_group_biaya = req.body.selectedGroupBiayaValue;
    const from_beginning_tagihan = req.body.from_beginning_tagihan;
    const from_bulan_tagihan = req.body.from_bulan_tagihan;
    const from_tahun_tagihan = req.body.from_tahun_tagihan;
    const end_bulan_tagihan = req.body.end_bulan_tagihan;
    const end_tahun_tagihan = req.body.end_tahun_tagihan;
    const firstDate = Helper.getFirstDateBulanan(from_bulan_tagihan, from_tahun_tagihan);
    const endDate = Helper.getLastDateBulanan(end_bulan_tagihan, end_tahun_tagihan);

    let addQueryDateRange = "";
    if (from_beginning_tagihan == true) {
      // parse from date
      addQueryDateRange = " AND t.tanggal_tagihan<=(:toDate) "
      // parse end date 
    } else {
      addQueryDateRange = " AND t.tanggal_tagihan>=(:fromDate) AND t.tanggal_tagihan<=(:toDate) "
    }
    
    var qryListKelas = "";
    var addQryListKelas = "";
    var idKelas = [];
    var listIdSiswa = [];

    if (tipe == "Group") {
      if (id_lembaga != "") {
        var addQuery = "";
        if (id_tingkat != "") {
          addQuery = " AND b.id_tingkat=(:tingkat) "
        }
        qryListKelas = "SELECT a.kelas_id from siswakelas a INNER JOIN kelas b ON a.kelas_id=b.id \
          INNER JOIN tingkat c ON b.id_tingkat=c.id INNER JOIN lembaga d ON c.id_lembaga=d.id \
          WHERE d.id=(:lembaga) "+ addQuery +" GROUP BY a.kelas_id";
        
        const listKelas = await Kelas.sequelize.query(
          qryListKelas,      
          {
            replacements: {
              lembaga: id_lembaga,
              tingkat: id_tingkat
            },
            type: QueryTypes.SELECT
          }
        );
  
        console.log("KELAS",listKelas);
        if (listKelas.length > 0) {
          for (dt of listKelas) {
            idKelas.push(dt.kelas_id);
          }
        }
  
        if (idKelas.length > 0) {
          addQryListKelas = " AND a.kelas_id IN(:kelas) ";
        } else {
          addQryListKelas = " AND a.kelas_id ISNULL ";
        }
      }
    } else {      
      const allSiswa = req.body.list_siswa;

      
      for (let dtSiswa of allSiswa) {
        listIdSiswa.push(dtSiswa.id);
      }
      addQryListKelas = " AND a.siswa_id IN(:siswa) "
    }
    
    var resTagihanBulan = [];
    try {
      const qryTagihanBulan = "WITH total_tagihan_siswa AS (SELECT SUM(ti.amount) AS total_amount,ti.id_siswa AS idsiswa \
        FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan WHERE ti.id_group_biaya IN(:groupBiaya) \
        "+ addQueryDateRange +" AND t.status_pembayaran='BELUM_DIBAYAR' \
        GROUP BY ti.id_siswa), \
        item_tagihan_siswa AS (SELECT SUM(ti.amount) AS amount,ti.id_siswa AS ti_idsiswa, \
        ti.id_group_biaya AS id_group_biaya,gb.name AS group_biaya, \
        t.bulan_tagihan AS bulan_tagihan,t.tahun_tagihan AS tahun_tagihan \
        FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
        INNER JOIN group_biaya gb ON ti.id_group_biaya=gb.id \
        WHERE ti.id_group_biaya IN(:groupBiaya) \
        "+ addQueryDateRange + " AND t.status_pembayaran='BELUM_DIBAYAR' \
        GROUP BY ti.id_siswa,t.bulan_tagihan,t.tahun_tagihan,ti.id_group_biaya,gb.name) \
          SELECT a.kelas_id,c.nama_kelas,b.id,b.no_induk,b.nama_lengkap,b.status,tts.*,its.*\
          FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
          INNER JOIN kelas c ON c.id=a.kelas_id INNER JOIN total_tagihan_siswa tts ON tts.idsiswa=b.id\
          INNER JOIN item_tagihan_siswa its ON tts.idsiswa=its.ti_idsiswa \
          WHERE a.periode_id=(:periode) " + addQryListKelas + 
          " ORDER BY c.nama_kelas,b.nama_lengkap,its.bulan_tagihan ASC,its.tahun_tagihan ASC;";
        
      const tagihan = await TagihanItem.sequelize.query(
        qryTagihanBulan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            kelas: idKelas,
            siswa: listIdSiswa,
            groupBiaya: selected_group_biaya,
            fromDate: firstDate,
            toDate: endDate
          },
          type: QueryTypes.SELECT
        }
      );

      return res.status(200).send(
        {
          'data': tagihan
        }
      )

    } catch (error) {
      console.log(error);
    }    
  },

  async getLaporanTagihan(req, res) {
    console.log("PAYLOAD UNPAIDX", req.body);

    // search term
    const namaOrNoInduk = req.body.nama_or_no_induk;
    const statusSiswa = req.body.status_siswa;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    const selected_group_biaya = req.body.selectedGroupBiayaValue;
    const from_beginning_tagihan = req.body.from_beginning_tagihan;
    const from_bulan_tagihan = req.body.from_bulan_tagihan;
    const from_tahun_tagihan = req.body.from_tahun_tagihan;
    const end_bulan_tagihan = req.body.end_bulan_tagihan;
    const end_tahun_tagihan = req.body.end_tahun_tagihan;
    const firstDate = Helper.getFirstDateBulanan(from_bulan_tagihan, from_tahun_tagihan);
    const endDate = Helper.getLastDateBulanan(end_bulan_tagihan, end_tahun_tagihan);

    let qrySiswaFilter = "";
    let addQueryTagihanFilter = "";
    let addQueryDateRange = "";

    if (namaOrNoInduk !== null) {
      qrySiswaFilter = " AND (a.nama_lengkap ILIKE '%" + namaOrNoInduk + "%' OR a.no_induk LIKE '%" + namaOrNoInduk + "%') ";
    }

    if (from_beginning_tagihan == true) {
      // parse from date
      // addQueryDateRange = " AND tg.tanggal_tagihan<=(:toDate) "
      // parse end date 
    } else {
      // addQueryDateRange = " AND tg.tanggal_tagihan>=(:fromDate) AND tg.tanggal_tagihan<=(:toDate) "
    }    
  
    const groupBiaya = await GroupBiaya.findAll({        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    const groupBiayaObjList = {};
    const groupBiayaList = [];
    const groupBiayaAmountList = [];
    // for (const gb of groupBiaya) {
    //   groupBiayaObjList[gb.id] = {
    //     groupBiayaName: gb.name,
    //     totalAmount: 0
    //   }

    // }

    for (let i=0;i<groupBiaya.length;i++) {
      groupBiayaList.push(groupBiaya[i].name);
      groupBiayaAmountList.push(0);
      groupBiayaObjList[groupBiaya[i].id] = i;
    }
  
    try {
      const qryLaporanTagihan = "WITH data_siswa AS ( \
        SELECT a.id AS siswaid,a.nama_lengkap,a.nama_ayah,a.nama_ibu,c.nama_kelas \
        FROM siswa a INNER JOIN siswakelas b ON a.id=b.siswa_id \
        INNER JOIN kelas c ON b.kelas_id=c.id WHERE b.periode_id=(:periode) "+ qrySiswaFilter +"), \
        data_tagihan AS ( \
        SELECT SUM(tg.sisa_tagihan) AS tagihan,tg.id_siswa AS tg_idsiswa,itg.id_group_biaya \
        FROM tagihan tg INNER JOIN tagihan_item itg ON tg.id=itg.id_tagihan \
        WHERE tg.id IS NOT NULL "+ addQueryTagihanFilter +" " + addQueryDateRange + " \
        GROUP BY itg.id_group_biaya,tg.id_siswa \
        ), \
        total_tagihan AS ( \
          SELECT SUM(tg.sisa_tagihan) AS total_tagihan,tg.id_siswa AS tg_idsiswa \
          FROM tagihan tg INNER JOIN tagihan_item itg ON tg.id=itg.id_tagihan \
          WHERE tg.id IS NOT NULL "+ addQueryTagihanFilter +" " + addQueryDateRange + " \
          GROUP BY tg.id_siswa \
          ) \
        SELECT ds.*, tg.tagihan,tg.id_group_biaya,ttg.total_tagihan FROM data_siswa ds \
        LEFT JOIN data_tagihan tg ON ds.siswaid=tg.tg_idsiswa \
        LEFT JOIN total_tagihan ttg ON ds.siswaid=ttg.tg_idsiswa \
        ORDER BY ds.nama_lengkap,tg.id_group_biaya;";
        
      const tagihan = await TagihanItem.sequelize.query(
        qryLaporanTagihan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            groupBiaya: selected_group_biaya,
            fromDate: firstDate,
            toDate: endDate
          },
          type: QueryTypes.SELECT
        }
      );


      // Create an empty object to hold the grouped data
      const groupedData = {};

      // Loop through the SQL query results
      for (const row of tagihan) {
        
        // Use a property from the "one" side as a key for grouping
        const key = row.siswaid;

        // If the key doesn't exist in the groupedData, create an array for it
        if (!groupedData[key]) {
          groupedData[key] = [];
        }

        // Push the "many" side data into the array associated with the key
        groupedData[key].push({ 
          groupBiayaId: row.id_group_biaya,
          amount: row.tagihan 
        });
      }

      const resultArray = [];

      for (const key in groupedData) {
        console.log("ROW", key, groupedData);
        if (groupedData.hasOwnProperty(key)) {
          // parse group biaya list 
          const groupBiayaSiswaList = [...groupBiayaAmountList];
          console.log("groupBiayaAmountList => ", groupBiayaAmountList);
          for (let i=0;i<groupedData[key].length; i++) {
            if (groupBiayaObjList.hasOwnProperty(groupedData[key][i].groupBiayaId)) {
              const idx = groupBiayaObjList[groupedData[key][i].groupBiayaId];
              groupBiayaSiswaList[idx] = groupedData[key][i].amount;
            }
          }
          resultArray.push({
            id: key, // Convert the key back to the original data type if needed
            siswa: tagihan.find(row => row.siswaid === key), // You can retrieve other properties from the "one" side data here
            groupBiaya: groupBiayaSiswaList,
          });
        }
      }

      return res.status(200).send(
        {
          'data': {
            result: resultArray,
            groupBiayaNameList: groupBiayaList
          }
        }
      )

    } catch (error) {
      console.log(error);
    }    
  },

  async getAllTagihanBulanan(req, res) {
    console.log("PAYLOAD", req.body);

    const tipe = req.body.tipe;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    
    var qryListKelas = "";
    var addQryListKelas = "";
    var idKelas = [];
    var listIdSiswa = [];

    if (tipe == "Group") {
      if (id_lembaga != "") {
        var addQuery = "";
        if (id_tingkat != "") {
          addQuery = " AND b.id_tingkat=(:tingkat) "
        }
        qryListKelas = "SELECT a.kelas_id from siswakelas a INNER JOIN kelas b ON a.kelas_id=b.id \
          INNER JOIN tingkat c ON b.id_tingkat=c.id INNER JOIN lembaga d ON c.id_lembaga=d.id \
          WHERE d.id=(:lembaga) "+ addQuery +" GROUP BY a.kelas_id";
        
        const listKelas = await Kelas.sequelize.query(
          qryListKelas,      
          {
            replacements: {
              lembaga: id_lembaga,
              tingkat: id_tingkat
            },
            type: QueryTypes.SELECT
          }
        );
  
        console.log("KELAS",listKelas);
        if (listKelas.length > 0) {
          for (dt of listKelas) {
            idKelas.push(dt.kelas_id);
          }
        }
  
        if (idKelas.length > 0) {
          addQryListKelas = " AND a.kelas_id IN(:kelas) ";
        } else {
          addQryListKelas = " AND a.kelas_id ISNULL ";
        }
      }
    } else {      
      const allSiswa = req.body.list_siswa;

      
      for (let dtSiswa of allSiswa) {
        listIdSiswa.push(dtSiswa.id);
      }
      addQryListKelas = " AND a.siswa_id IN(:siswa) "
    }
    
    var resTagihanBulan = [];
    try {
      for (let i=1;i<=12;i++) {
        const qryTagihanBulan = "WITH tagihan_by_group AS (\
          SELECT t.status_pembayaran AS status_pembayaran,ti.id_group_biaya AS id_group_biaya,\
          ti.amount AS amount,ti.id_siswa AS idsiswa \
          FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan WHERE ti.id_group_biaya=(:gbiaya)\
          AND t.bulan_tagihan=(:bulantagih) AND t.tahun_tagihan=(:tahun_tagih)\
          ) \
          SELECT a.kelas_id,c.nama_kelas,b.id,b.no_induk,b.nama_lengkap,b.status,tbg.*\
          FROM siswakelas a INNER JOIN siswa b ON a.siswa_id=b.id \
          INNER JOIN kelas c ON c.id=a.kelas_id LEFT JOIN tagihan_by_group tbg ON tbg.idsiswa=b.id\
          WHERE a.periode_id=(:periode) " + addQryListKelas + " ORDER BY c.nama_kelas,b.nama_lengkap;";
          
        var thTagih = req.body.tahun_awal;
        if (i <= 6) {
          thTagih = req.body.tahun_akhir;
        }
        const tagihan = await TagihanItem.sequelize.query(
          qryTagihanBulan,      
          {
            replacements: {
              periode: req.body.id_periode,
              gbiaya: req.body.id_group_biaya,
              tahun_tagih: thTagih,
              bulantagih: i,
              kelas: idKelas,
              siswa: listIdSiswa
            },
            type: QueryTypes.SELECT
          }
        );
        
        resTagihanBulan.push(tagihan);
      }

      return res.status(200).send(
        {
          'data': {
            juli: resTagihanBulan[6],
            agustus: resTagihanBulan[7],
            september: resTagihanBulan[8],
            oktober: resTagihanBulan[9],
            november: resTagihanBulan[10],
            desember: resTagihanBulan[11],
            januari: resTagihanBulan[0],
            februari: resTagihanBulan[1],
            maret: resTagihanBulan[2],
            april: resTagihanBulan[3],
            mei: resTagihanBulan[4],
            juni: resTagihanBulan[5],
          }
        }
      )

    } catch (error) {
      console.log(error);
    }    
  },

  async getDetailTagihanBulananSiswa(req, res) {
    console.log("PAYLOAD", req.body);

    const tipe = req.body.tipe;
    const id_siswa = req.body.id_siswa;
    const tahun = req.body.tahun;
    const id_tingkat = req.body.id_tingkat;

    let addQueryDateRange = "";
    let fromDate = "";
    let toDate = "";

    if (tahun != "") {
      splTh = tahun.split("-");
      fromDate = Helper.getFirstDateBulanan(7, splTh[0]);
      toDate = Helper.getLastDateBulanan(6, splTh[1]);
      addQueryDateRange = " AND t.tanggal_tagihan>=(:fromDate) AND t.tanggal_tagihan<=(:toDate) "
    }

    const groupBiaya = await GroupBiaya.findAll({        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });

    const bulan = [7,8,9,10,11,12,1,2,3,4,5,6];
    
    var addQrySiswa = " AND a.siswa_id=(:id_siswa) ";    
      
    try {
      const qryTagihanBulan = "WITH list_tagihan_siswa AS ( \
        SELECT t.status_pembayaran AS status_pembayaran,t.bulan_tagihan,t.tahun_tagihan, ti.id_group_biaya AS id_group_biaya, \
              SUM(t.sisa_tagihan) AS amount \
              FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
              WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" \
              GROUP BY t.status_pembayaran,t.tahun_tagihan,t.bulan_tagihan,ti.id_group_biaya \
              ORDER BY ti.id_group_biaya, t.bulan_tagihan \
        ), \
        total_tagihan_siswa AS ( \
            SELECT t.tahun_tagihan, ti.id_group_biaya AS id_group_biaya, \
                  SUM(t.sisa_tagihan) AS total_amount \
                  FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan  \
                  WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" \
                  GROUP BY t.tahun_tagihan,ti.id_group_biaya \
                  ORDER BY ti.id_group_biaya \
        ) \
        SELECT lts.*,tts.total_amount FROM list_tagihan_siswa lts \
        INNER JOIN total_tagihan_siswa tts ON lts.id_group_biaya=tts.id_group_biaya;";

      var thTagih = req.body.tahun_awal;
      // if (i <= 6) {
      //   thTagih = req.body.tahun_akhir;
      // }
      const tagihan = await TagihanItem.sequelize.query(
        qryTagihanBulan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            tahun_tagih: thTagih,
            bulantagih: 1,
            siswa: id_siswa,
            fromDate: fromDate,
            toDate: toDate
          },
          type: QueryTypes.SELECT
        }
      );

      // Create an empty array to store transformed data
      const transformedData = [];

      const masterAmountList = [0,0,0,0,0,0,0,0,0,0,0,0];
      for (const rowGb of groupBiaya) {
        const gbName = rowGb.name;
        const gbId = rowGb.id;
        const amountList = [...masterAmountList];
        let totalAmount = 0;
        let tmpGb = 0;
        for (const row of tagihan) {
          const idxBln = bulan.indexOf(row.bulan_tagihan);
          if (row.id_group_biaya === gbId) {
            amountList[idxBln] = row.amount;
            if (tmpGb != gbId) {
              totalAmount = row.total_amount;
            }
          }
        }

        const dataTagihanSiswa = {
          groupBiayaName: gbName,
          listNominalBulan: amountList,
          totalAmount: totalAmount
        }

        transformedData.push(dataTagihanSiswa);
      }

      const qryTotalTagihanPerBulan = "SELECT t.bulan_tagihan, \
        SUM(t.sisa_tagihan) AS total_amount \
        FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
        WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" \
        GROUP BY t.bulan_tagihan ORDER BY t.bulan_tagihan";

      const totalTagihanBulan = await TagihanItem.sequelize.query(
        qryTotalTagihanPerBulan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            tahun_tagih: thTagih,
            bulantagih: 1,
            siswa: id_siswa,
            fromDate: fromDate,
            toDate: toDate
          },
          type: QueryTypes.SELECT
        }
      );

      const amountListBulan = [0,0,0,0,0,0,0,0,0,0,0,0];
      for (const rowBl of totalTagihanBulan) {
        const idxBln = bulan.indexOf(rowBl.bulan_tagihan);        
        amountListBulan[idxBln] = rowBl.total_amount;        
      }

      const qryGrandTotalTagihan = "SELECT SUM(t.sisa_tagihan) AS total_amount \
      FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
      WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" ";

      const grandTotalTagihan = await TagihanItem.sequelize.query(
        qryGrandTotalTagihan,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            tahun_tagih: thTagih,
            bulantagih: 1,
            siswa: id_siswa,
            fromDate: fromDate,
            toDate: toDate
          },
          type: QueryTypes.SELECT
        }
      );
      
      // bulan tertagih
      const qryTotalMasukBulanTagih = "SELECT t.bulan_tagihan, \
        SUM(t.sisa_tagihan) AS total_amount \
        FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
        WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" \
        GROUP BY t.bulan_tagihan ORDER BY t.bulan_tagihan";

      const totalMasukBulanTagih = await TagihanItem.sequelize.query(
        qryTotalMasukBulanTagih,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            tahun_tagih: thTagih,
            bulantagih: 1,
            siswa: id_siswa,
            fromDate: fromDate,
            toDate: toDate
          },
          type: QueryTypes.SELECT
        }
      );

      const amountListMasukBulanTagih = [0,0,0,0,0,0,0,0,0,0,0,0];
      for (const rowBlTagih of totalMasukBulanTagih) {
        const idxBlnTagih = bulan.indexOf(rowBlTagih.bulan_tagihan);        
        amountListMasukBulanTagih[idxBlnTagih] = rowBlTagih.total_amount;        
      }

      const qryGrandTotalMAsukBulanTagih = "SELECT SUM(t.sisa_tagihan) AS total_amount \
      FROM tagihan t INNER JOIN tagihan_item ti ON t.id=ti.id_tagihan \
      WHERE t.id_siswa=(:siswa) "+ addQueryDateRange +" ";

      const grandTotalMasukBulanTagih = await TagihanItem.sequelize.query(
        qryGrandTotalMAsukBulanTagih,      
        {
          replacements: {
            periode: req.body.id_periode,
            gbiaya: req.body.id_group_biaya,
            tahun_tagih: thTagih,
            bulantagih: 1,
            siswa: id_siswa,
            fromDate: fromDate,
            toDate: toDate
          },
          type: QueryTypes.SELECT
        }
      );

      return res.status(200).send(
        {
          'data': transformedData,
          'totalBulan': amountListBulan,
          'grandTotal': grandTotalTagihan,
          'totalBulanTagih': amountListMasukBulanTagih,
          'grandTotalBulanTagih': grandTotalMasukBulanTagih
        }
      )

    } catch (error) {
      console.log(error);
    }    
  },

  async deleteTagihanBulanan(req, res) {
    
    const tipe = req.body.tipe;
    const id_group_biaya = req.body.id_group_biaya;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    const id_periode = req.body.id_tahun_ajaran;
    const selected_bulan = req.body.list_bulan;
    
    var allSiswa = req.body.list_siswa;

    console.log("BODY", req.body);

    if (tipe == "Group") {
      let qryAllSiswa = "";
        
      if (id_lembaga == 0) {
        qryAllSiswa = "SELECT a.id FROM siswa a INNER JOIN siswakelas b ON a.id=b.siswa_id\
          WHERE b.periode_id=(:periode) ";
      } else {
        var addQuery = "";
        if (id_tingkat != "") {
          addQuery = " AND c.id=(:tingkat) "
        }
  
        qryAllSiswa = "SELECT a.id FROM siswa a INNER JOIN siswakelas b ON a.id=b.siswa_id\
          INNER JOIN kelas k ON b.kelas_id=k.id \
          INNER JOIN tingkat c ON k.id_tingkat=c.id INNER JOIN lembaga d ON c.id_lembaga=d.id \
          WHERE b.periode_id=(:periode) AND d.id=(:lembaga) " + addQuery;
      }
  
      allSiswa = await Siswa.sequelize.query(
        qryAllSiswa,      
        {
          replacements: {
            periode: id_periode,
            lembaga: id_lembaga,
            tingkat: id_tingkat
          },
          type: QueryTypes.SELECT
        }
      );
    }

    for (bl of selected_bulan) {
      const splBln = bl.split("-");
      const bulan = splBln[0];
      const tahun = splBln[1];
      console.log("===============================>>>", bulan, tahun);
      for (dt of allSiswa) {
        const xTagihan = await Tagihan
          .findOne({
            where : { 
              id_siswa: dt.id,
              tipe_tagihan: 'BULANAN',
              bulan_tagihan: bulan,
              tahun_tagihan: tahun,
              tipe_pembayaran: 'CLOSED',
              status_pembayaran: 'BELUM_DIBAYAR',
              id_virtual_account: null
            },
            include: [
              {
                model: TagihanItem, 
                as: 'TagihanItem',            
                required:true,
                where: {
                  id_group_biaya: id_group_biaya
                }
              }
            ],
            order : [
              ['createdAt', 'DESC'],
              ['createdAt', 'DESC'],
            ],
          })
        
        if (xTagihan != null) {
          console.log("DELETE DRAFT TAGIHAN", bulan, tahun, xTagihan.id);
          await xTagihan.destroy();
        }        
      }
    }

    return res.status(200).send(
      {
        "status":"200",
        "message": "Success"
      }
    );
  },
  
  async generateTagihanBulanan(req, res) {
    // 1. get list siswa 
    // 2. loop by siswa
    // 3. cek jika sudah ada tagihan lewati
    // 3. create tagihan with total amount
    // 4. create item tagihan

    const tipe = req.body.tipe;
    const id_group_biaya = req.body.id_group_biaya;
    const id_lembaga = req.body.id_lembaga;
    const id_tingkat = req.body.id_tingkat;
    const id_periode = req.body.id_tahun_ajaran;
    const selected_bulan = req.body.list_bulan;
    const totalTagihan = req.body.total_tagihan;
    const groupBiayaName = req.body.group_biaya_name;

    var allSiswa = req.body.list_siswa;

    console.log("BODY", req.body);

    if (tipe == "Group") {
      let qryAllSiswa = "";
        
      if (id_lembaga == 0) {
        qryAllSiswa = "SELECT a.id,bk.jumlah,bk.active FROM siswa a INNER JOIN siswakelas b ON a.id=b.siswa_id\
          LEFT JOIN biaya_khusus bk ON a.id=bk.id_siswa AND bk.id_group_biaya=(:group_biaya) \
          WHERE b.periode_id=(:periode) ";
      } else {
        var addQuery = "";
        if (id_tingkat != "") {
          addQuery = " AND c.id=(:tingkat) "
        }
  
        qryAllSiswa = "SELECT a.id,bk.jumlah,bk.active FROM siswa a INNER JOIN siswakelas b ON a.id=b.siswa_id\
          INNER JOIN kelas k ON b.kelas_id=k.id \
          INNER JOIN tingkat c ON k.id_tingkat=c.id INNER JOIN lembaga d ON c.id_lembaga=d.id \
          LEFT JOIN biaya_khusus bk ON a.id=bk.id_siswa AND bk.id_group_biaya=(:group_biaya) \
          WHERE b.periode_id=(:periode) AND d.id=(:lembaga) " + addQuery;
      }
  
      allSiswa = await Siswa.sequelize.query(
        qryAllSiswa,      
        {
          replacements: {
            group_biaya: id_group_biaya,
            periode: id_periode,
            lembaga: id_lembaga,
            tingkat: id_tingkat
          },
          type: QueryTypes.SELECT
        }
      );
    }
    
    for (bl of selected_bulan) {
      const splBln = bl.split("-");
      const bulan = splBln[0];
      const tahun = splBln[1];
      console.log(bulan, tahun);
      for (dt of allSiswa) {
        console.log("======= >> ALL SISWA ", dt);
        const xTagihan = await Tagihan
          .findOne({
            where : { 
              id_siswa: dt.id,
              tipe_tagihan: 'BULANAN',
              bulan_tagihan: bulan,
              tahun_tagihan: tahun,
              tipe_pembayaran: 'CLOSED'
            },
            include: [
              {
                model: TagihanItem, 
                as: 'TagihanItem',            
                required:true,
                where: {
                  id_group_biaya: id_group_biaya
                }
              }
            ],
            order : [
              ['createdAt', 'DESC'],
              ['createdAt', 'DESC'],
            ],
          })
         
        // cek jika ada tagihan
        if (xTagihan == null) {          

          const lastSequenceTagihan = await db.sequelize.query("SELECT nextval('tagihan_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
          const jsonTagihan = JSON.stringify(lastSequenceTagihan[0], null, 2);
          const objValueTagihan = JSON.parse(jsonTagihan); 
          
          const tagihanNumber = Helper.generateInvoiceNumber(objValueTagihan.nextsequence);
          const dateTagihan = Helper.getFirstDateBulanan(bulan, tahun);
          const dateExpired = Helper.getExpiredDateBulanan(bulan, tahun);
          const tipePembayaran = "CLOSED";

          const realTotalTagihan = dt.jumlah != null && dt.active == true ? dt.jumlah : totalTagihan;
          console.log("========>>> dt.jumlah", dt.jumlah, "dt.active", dt.active, realTotalTagihan);
          
          const newTagihan = await Tagihan
            .create({
              id_siswa: dt.id,
              nomor: tagihanNumber,
              nilai_tagihan: realTotalTagihan,              
              sisa_tagihan: realTotalTagihan,              
              tanggal_tagihan: dateTagihan,              
              tanggal_jatuh_tempo: dateExpired,              
              keterangan: groupBiayaName + bulan + ' ' + tahun,
              tipe_tagihan: 'BULANAN',
              bulan_tagihan: bulan,
              tahun_tagihan: tahun,
              tipe_pembayaran: tipePembayaran
            });
            
          console.log("NEW TAGIHAN", newTagihan);    
          
          if (newTagihan) {
            idTagihan = newTagihan.id;
            // also save tagihan item
            try {
      
              await TagihanItem
              .create({
                id_siswa: dt.id,
                id_tagihan: idTagihan,
                id_group_biaya: id_group_biaya,
                item: groupBiayaName,
                amount: realTotalTagihan,
                tanggal_mulai_ditagih: dateTagihan
              });
      
            } catch (e) {
              console.log(e);
              return res.status(400).send(e);
            }
          
          } else {
            return res.status(400).send(e);
          }
        }        
      }
    }

    return res.status(200).send(
      {
        "status":"200",
        "message": "Success"
      }
    );
  }

};