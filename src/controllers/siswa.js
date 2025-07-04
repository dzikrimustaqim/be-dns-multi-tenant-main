const Helper = require('../utils/helper');
const Siswa = require('../models').Siswa;
const NomorVa = require('../models').NomorVa;
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const RolePermission = require('../models').RolePermission;
const Parent = require('../models').Parent;
const Tagihan = require('../models').Tagihan;
const Siswakelas = require('../models').Siswakelas;
const SiswaKamar = require('../models').SiswaKamar;
const VirtualAccount = require('../models').VirtualAccount;
const { Sequelize, QueryTypes } = require('sequelize');
const db  = require('../models');


module.exports = {
  login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }
    // if (!Helper.isValidEmail(req.body.email)) {
    //   return res.status(400).send({ 'message': 'Please enter a valid email address' });
    // }

    return req.db.Siswa
      .findOne({
        include:[
          { 
            model: req.db.Role, 
            as: 'Role', 
            attributes: ['role_name','slug'],            
            required:true,            
            include: [
              {
                model: req.db.RolePermission,
                as: 'RolePermission',
                attributes: ['role_id','permission_id'], 
                required: false,
                include: [
                  {
                    model: req.db.Permission,
                    as: 'Permission',
                    attributes: ['module','permission_name','slug'], 
                    required: false,        
                  },              
                ],        
              },              
            ],            
          },
        ], 
        where: { username: req.body.username } 
      })
      .then((Siswa) => {
        if (!Siswa) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        if (!Helper.comparePassword(Siswa.password, req.body.password)) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        
        const token = Helper.generateToken(Siswa.username, req.tenantId);
        
        const jsonUser = {
          "iduser":Siswa.id,
          "username":Siswa.username,
          "grade":"ADMIN",
          "nama":Siswa.nama,
          "email":Siswa.email,
          "siswa":Siswa
        };
        const user = Helper.strEncode(JSON.stringify(jsonUser));

        return res.status(200).send({ token, user });
      })
      .catch((error) => res.status(400).send(error));
  },

  getByRegistrant(req, res) {
    return req.db.Siswa
      .findOne({
        include: [
          'tingkat',
          'lembaga',
          'NomorVa',
        ],        
        where: { registrant_id: req.body.registrant_id }
      })
      .then((Siswa) => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Santri Not Found',
          });
        }
        return res.status(200).send(Siswa);
      })
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); 
      });
  },

  async getSebaranKotaByPeriode(req, res) {
    const queryStr1 = "select count(*) as grandtotal from siswa where angkatan=(:periode) AND kota_kab IS NOT NULL";
    const allSiswa = await req.db.Siswa.sequelize.query(
      queryStr1,      
      {
        replacements: {            
          periode: req.params.periode,
        },
        type: QueryTypes.SELECT
      }
    );

    const grandTotal = allSiswa[0].grandtotal;
    console.log("TOAL", allSiswa[0].grandtotal);

    const queryStr = "select kota_kab, count(*) as total from siswa where angkatan=(:periode) AND kota_kab IS NOT NULL GROUP BY kota_kab ORDER BY total DESC";

    console.log("QUERY", queryStr);

    const dataSiswa = await req.db.Siswa.sequelize.query(
      queryStr,      
      {
        replacements: {            
          periode: req.params.periode,
        },
        type: QueryTypes.SELECT
      }
    );

    const result = {
      data: dataSiswa,
      alltotal: grandTotal
    }
    return res.status(200).send(result)
    
  },

  list(req, res) {
    return req.db.Siswa
      .findAll({        
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Siswa) => res.status(200).send(Siswa))
      .catch((error) => { res.status(400).send(error); });
  },

  listSiswaAktif(req, res) {
    return req.db.Siswa
      .findAll({
        where : { status: 't' },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Siswa) => res.status(200).send(Siswa))
      .catch((error) => { res.status(400).send(error); });
  },

  getSiswaDouble(req, res) {
    const queryStr = 'select nama_lengkap, count(nama_lengkap) as total from siswa where angkatan=(:angkatan) group by nama_lengkap HAVING count(nama_lengkap) > 1';

    return req.db.Siswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          angkatan: req.query.angkatan
        },
        type: QueryTypes.SELECT
      }
    )
    .then((Siswa) =>  {
      return res.status(200).send(Siswa);
    })
    .catch((error) => {
      console.log(error); 
    });
    
  },

  getRekapLokasiUjian(req, res) {
    const queryStr = 'select count(id) AS total,lokasi_ujian from siswa WHERE angkatan=(:angkatan) \
      AND lokasi_ujian IS NOT NULL GROUP BY lokasi_ujian;';

    return req.db.Siswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          angkatan: req.query.angkatan
        },
        type: QueryTypes.SELECT
      }
    )
    .then((Siswa) =>  {
      return res.status(200).send(Siswa);
    })
    .catch((error) => {
      console.log(error); 
    });
    
  },

  getRekapTanggalUjian(req, res) {
    const queryStr = 'select count(id) AS total,tanggal_ujian from siswa WHERE angkatan=(:angkatan) \
      GROUP BY tanggal_ujian;';

    return req.db.Siswa.sequelize.query(
      queryStr,      
      {
        replacements: {
          angkatan: req.query.angkatan
        },
        type: QueryTypes.SELECT
      }
    )
    .then((Siswa) =>  {
      return res.status(200).send(Siswa);
    })
    .catch((error) => {
      console.log(error); 
    });
    
  },

  async listSiswaBaru(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const angkatan = req.query.angkatan;
    
    let whereStatement = {
      angkatan: angkatan,
    };
    
    if(searchTerm) {
      whereStatement = {
        [Sequelize.Op.and]: [
          {
            angkatan: angkatan,
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

    const query = {
      include:[
        'tingkat','lembaga',
        { 
          model: req.db.Role, 
          as: 'role', 
          attributes: ['role_name','slug'],            
          required:true,            
          include: [
            {
              model: req.db.RolePermission,
              as: 'RolePermission',
              attributes: ['role_id','permission_id'], 
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: 'Permission',
                  attributes: ['module','permission_name','slug'], 
                  required: false,        
                },              
              ],        
            },              
          ],            
        },
        { 
          model: req.db.Parent, 
          as: 'parent',            
          required:false,
          where: {}
        },
        { 
          model: req.db.Tagihan, 
          as: 'SiswaTagihan',            
          required:false,
          // include: [
          //   {
          //     model: VirtualAccount, 
          //     as: 'vatagihan',            
          //     required:false,
          //     include: [ 'vaBank' ]
          //   }
          // ],
        },
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        [{ model: Tagihan, as: 'SiswaTagihan' }, 'createdAt', 'desc'],
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.Siswa
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Siswa
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

  async listPenentuanKelasSiswaBaru(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const angkatan = req.query.angkatan;
    const periode_id = req.query.periode_id;

    let whereStatement = {
      angkatan: angkatan,
      // status: "ACTIVE"
      no_induk: {
        [Sequelize.Op.ne]: ""
      },
    };
    
    if(searchTerm) {
      whereStatement = {
        angkatan: angkatan,
        status: "ACTIVE",
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

    const query = {
      include:[
        'tingkat','lembaga',
        { 
          model: req.db.Role, 
          as: 'role', 
          attributes: ['role_name','slug'],            
          required:true,            
          include: [
            {
              model: req.db.RolePermission,
              as: 'RolePermission',
              attributes: ['role_id','permission_id'], 
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: 'Permission',
                  attributes: ['module','permission_name','slug'], 
                  required: false,        
                },              
              ],        
            },              
          ],            
        },
        { 
          model: req.db.Parent, 
          as: 'parent',            
          required:false,
          where: {}
        },
        { 
          model: req.db.Tagihan, 
          as: 'SiswaTagihan',            
          required:false,
          // include: [
          //   {
          //     model: VirtualAccount, 
          //     as: 'vatagihan',            
          //     required:false,
          //     include: [ 'vaBank' ]
          //   }
          // ],
        },
        { 
          model: req.db.Siswakelas, 
          as: 'siswaKelas',            
          required:false,
          where: {
            periode_id: periode_id
          },
          include: [
            'Kelas'
          ],
        },
        { 
          model: req.db.SiswaKamar, 
          as: 'siswaKamar',            
          required:false,
          where: {
            id_tahun_ajaran: periode_id
          },
          include: [
            'Kamar'
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

    const count = await req.db.Siswa
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Siswa
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

  async listSiswaTahunAjaranAktive(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const angkatan = req.query.angkatan;
    const periode_id = req.query.periode_id;

    let whereStatement = {
      // angkatan: angkatan,
      status: {
        [Sequelize.Op.ne]: "REG"
      },
    };
    
    if(searchTerm) {
      whereStatement = {
        status: {
          [Sequelize.Op.ne]: "REG"
        },
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

    const query = {
      include:[
        'tingkat','lembaga',
        { 
          model: req.db.Role, 
          as: 'role', 
          attributes: ['role_name','slug'],            
          required:true,            
          include: [
            {
              model: req.db.RolePermission,
              as: 'RolePermission',
              attributes: ['role_id','permission_id'], 
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: 'Permission',
                  attributes: ['module','permission_name','slug'], 
                  required: false,        
                },              
              ],        
            },              
          ],            
        },
        { 
          model: req.db.Parent, 
          as: 'parent',            
          required:false,
          where: {}
        },
        { 
          model: req.db.Tagihan, 
          as: 'SiswaTagihan',            
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
          model: req.db.Siswakelas, 
          as: 'siswaKelas',            
          required:true,
          where: {
            periode_id: periode_id
          },
          include: [
            'Kelas'
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

    const count = await req.db.Siswa
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Siswa
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

  async listBukuInduk(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const angkatan = req.query.angkatan;
    
    let whereStatement = {
      status: {
        [Sequelize.Op.ne]: "REG"
      }
    };
    
    if(searchTerm) {
      whereStatement = {
        status: {
          [Sequelize.Op.ne]: "REG"
        },
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

    const query = {
      include:[
        'tingkat','lembaga',
        { 
          model: req.db.Role, 
          as: 'role', 
          attributes: ['role_name','slug'],            
          required:true,            
          include: [
            {
              model: req.db.RolePermission,
              as: 'RolePermission',
              attributes: ['role_id','permission_id'], 
              required: false,
              include: [
                {
                  model: req.db.Permission,
                  as: 'Permission',
                  attributes: ['module','permission_name','slug'], 
                  required: false,        
                },              
              ],        
            },              
          ],            
        },
        { 
          model: req.db.Parent, 
          as: 'parent',            
          required:false,
          where: {}
        },
        { 
          model: req.db.Tagihan, 
          as: 'SiswaTagihan',            
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
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.Siswa
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Siswa
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

  async listSiswaDokumen(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {
      status: 'REG',
    };
    
    if(searchTerm) {
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

    const query = {
      include:[
        'SiswaDokumenSyarat'
      ],
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await req.db.Siswa
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Siswa
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

  listSiswaByRole(req, res) {
    return req.db.Siswa
      .findAll({
        include:[
          { 
            model: req.db.Role, 
            as: 'Role', 
            attributes: ['role_name','slug'],            
            required:true,
            where: { slug: req.body.role },       
            include: [
              {
                model: req.db.RolePermission,
                as: 'RolePermission',
                attributes: ['role_id','permission_id'], 
                required: false,
                include: [
                  {
                    model: req.db.Permission,
                    as: 'Permission',
                    attributes: ['module','permission_name','slug'], 
                    required: false,        
                  },              
                ],        
              },              
            ],            
          },
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Siswa) => res.status(200).send(Siswa))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.Siswa
      .findByPk(req.params.id, {})
      .then((Siswa) => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        return res.status(200).send(Siswa);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {

    // get siswa role
    const rolesiswa = await req.db.Role.findOne({
      where: {
        slug: 'SISWA'
      }
    })

    // get last sequence 
    const lastSequence = await db.sequelize.query("SELECT nextval('registration_sequence') AS nextSequence", { type: db.sequelize.QueryTypes.SELECT });
    const json = JSON.stringify(lastSequence[0], null, 2);
    const objValue = JSON.parse(json); 
    
    const regNumber = Helper.generateRegNumber(objValue.nextsequence);

    console.log(req.body);
    if (!rolesiswa || !req.body.nama_lengkap || !req.body.tingkat_id || !req.body.lembaga_tujuan) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    const roleId = rolesiswa.id;

    const hashPassword = Helper.hashPassword(req.body.password || 'siswabaru123');
    const now = new Date();

    console.log(req.body);
    console.log("reg", regNumber, roleId);

    return await req.db.Siswa
      .create({
        role_id: roleId,
        registrant_id: req.body.registrant_id || null,        
        regnumber: regNumber,
        no_induk: req.body.no_induk || null,
        tingkat_id: req.body.tingkat_id,
        reg_date: now,
        angkatan: req.body.angkatan || null,
        username: req.body.username || null,
        nisn: req.body.nisn || null,
        email: req.body.email || null,
        nama_lengkap: req.body.nama_lengkap.toUpperCase(),
        password: hashPassword,
        npsn: req.body.npsn || null,
        nss: req.body.nss || null,
        no_ijazah: req.body.no_ijazah || null,
        nama_arab: req.body.nama_arab || null,
        nik: req.body.nik || null,
        gender: req.body.gender || null,
        pob: req.body.pob || null,
        dob: req.body.dob || null,
        anak_ke: req.body.anak_ke || null,
        jumlah_anak: req.body.jumlah_anak || null,
        telepon: req.body.telepon || null,
        riwayat_penyakit: req.body.riwayat_penyakit || null,
        berat_badan: req.body.berat_badan || null,
        tinggi_badan: req.body.tinggi_badan || null,
        golongan_darah: req.body.golongan_darah || null,
        hoby: req.body.hoby || null,
        saudara_kandung_aktif: req.body.saudara_kandung_aktif || null,
        sumber_info_sekolah: req.body.sumber_info_sekolah || null,
        lembaga_tujuan: req.body.lembaga_tujuan || null,
        kelas_tujuan: req.body.kelas_tujuan || null,
        ukuran_baju: req.body.ukuran_baju || null,
        asal_sekolah: req.body.asal_sekolah || null,
        nama_sekolah_asal: req.body.nama_sekolah_asal || null,
        tanggal_lulus: req.body.tanggal_lulus || null,
        pilihan_pesantren_kedua: req.body.pilihan_pesantren_kedua || null,
        no_kk: req.body.no_kk || null,
        nama_ayah: req.body.nama_ayah || null,
        nik_ayah: req.body.nik_ayah || null,
        status_ayah: req.body.status_ayah || null,
        pob_ayah: req.body.pob_ayah || null,
        dob_ayah: req.body.dob_ayah || null,
        gelar_akademik_ayah: req.body.gelar_akademik_ayah || null,
        status_hidup_ayah: req.body.status_hidup_ayah || null,
        pendidikan_terkahir_ayah: req.body.pendidikan_terkahir_ayah || null,
        pekerjaan_ayah: req.body.pekerjaan_ayah || null,
        penghasilan_perbulan_ayah: req.body.penghasilan_perbulan_ayah || null,
        telp_ayah: req.body.telp_ayah || null,
        alamat_ayah: req.body.alamat_ayah || null,
        nama_ibu: req.body.nama_ibu || null,
        nik_ibu: req.body.nik_ibu || null,
        status_ibu: req.body.status_ibu || null,
        pob_ibu: req.body.pob_ibu || null,
        dob_ibu: req.body.dob_ibu || null,
        gelar_akademik_ibu: req.body.gelar_akademik_ibu || null,
        status_hidup_ibu: req.body.status_hidup_ibu || null,
        pendidikan_terkahir_ibu: req.body.pendidikan_terkahir_ibu || null,
        pekerjaan_ibu: req.body.pekerjaan_ibu || null,
        penghasilan_perbulan_ibu: req.body.penghasilan_perbulan_ibu || null,
        telp_ibu: req.body.telp_ibu || null,
        alamat_ibu: req.body.alamat_ibu || null,
        kewarganegaraan: req.body.kewarganegaraan || null,
        negara: req.body.negara || null,
        alamat: req.body.alamat || null,
        rt: req.body.rt || null,
        rw: req.body.rw || null,
        provinsi: req.body.provinsi || null,
        kodepos: req.body.kodepos || null,
        kota_kab: req.body.kota_kab || null,
        kecamatan: req.body.kecamatan || null,
        desa_kelurahan: req.body.desa_kelurahan || null,
        lokasi_ujian: req.body.lokasi_ujian || null,
        admin_input: req.body.admin_input || 'f',
      })
      .then((Siswa) => res.status(201).send(Siswa))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error)
      });
  },

  bulkInsertSiswa(req, res) {
    const {data} = req.body
    
    if (data.length) {
      return req.db.Role
        .findOne({ where: {slug: 'SISWA'} })
        .then(role => {
          if (role.dataValues.id > 0) {
            let dataToSend = data.map((val, index) => {
              val['role_id'] = role.dataValues.id
              val['password'] = Helper.hashPassword(val.password)
              val['telepon'] = val.telepon.toString()
              val['no_kk'] = val['no_kk'].toString()
              val['nik_ayah'] = val['nik_ayah'].toString()
              val['nik_ibu'] = val['nik_ibu'].toString()
              val['createdat'] = Helper.convertDate()
              val['updateat'] = Helper.convertDate()
              return val
            });

            return Siswa
            .bulkCreate(dataToSend, { fields: ["role_id", "regnumber", "username", "password", "nisn", "npsn", "nama_lengkap", "nama_lengkap_ar", "nik", "gender", "pob", "dob", "anak_ke", "jumlah_anak", "telepon", "riwayat_penyakit", "golongan_darah", "email", "asal_sekolah", "nama_sekolah_asal", "tanggal_lulus", "no_kk", "nama_ayah", "nik_ayah", "status_ayah", "pob_ayah", "dob_ayah", "gelar_akademik_ayah", "status_hidup_ayah", "pendidikan_terkahir_ayah", "penghasilan_perbulan_ayah", "telp_ayah", "nama_ibu", "nik_ibu", "status_ibu", "pob_ibu", "dob_ibu", "gelar_akademik_ibu", "status_hidup_ibu", "pendidikan_terkahir_ibu", "penghasilan_perbulan_ibu", "telp_ibu", "alamat", "rt", "rw", "provinsi", "kodepos", "kota_kab", "kecamatan", "desa_kelurahan", "createat", "updateat"], returning: true })
            .then((siswa) => {
              if (siswa) {
                res.status(200).send({ message: 'bulk upload success'})
              }
              res.status(401).send('error bulk upload')
            })
            .catch(error => {
              res.status(402).send(error)
            })
          }
        })
        .catch(errRole => {
          res.status(403).send({message: 'Role Not Found', error: errRole});
        })
    }
    res.status(404).send({ 'message': 'Some values are missing' });
  },

  update(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Siswa
      .findByPk(req.params.id, {})
      .then(Siswa => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        return Siswa
          .update({          
            no_induk: req.body.no_induk || Siswa.no_induk,
            tingkat_id: req.body.tingkat_id || Siswa.tingkat_id,
            angkatan: req.body.angkatan || Siswa.angkatan,
            username: req.body.username || Siswa.username,
            nisn: req.body.nisn || Siswa.nisn,
            email: req.body.email || Siswa.email,
            nama_lengkap: req.body.nama_lengkap.toUpperCase() || Siswa.nama_lengkap,
            npsn: req.body.npsn || Siswa.npsn,
            nss: req.body.nss || Siswa.nss,
            no_ijazah: req.body.no_ijazah || Siswa.no_ijazah,
            nama_arab: req.body.nama_arab || Siswa.nama_arab,
            nik: req.body.nik || Siswa.nik,
            gender: req.body.gender || Siswa.gender,
            pob: req.body.pob || Siswa.pob,
            dob: req.body.dob || Siswa.dob,
            anak_ke: req.body.anak_ke || Siswa.anak_ke,
            jumlah_anak: req.body.jumlah_anak || Siswa.jumlah_anak,
            telepon: req.body.telepon || Siswa.telepon,
            riwayat_penyakit: req.body.riwayat_penyakit || Siswa.riwayat_penyakit,
            berat_badan: req.body.berat_badan || Siswa.berat_badan,
            tinggi_badan: req.body.tinggi_badan || Siswa.tinggi_badan,
            golongan_darah: req.body.golongan_darah || Siswa.golongan_darah,
            hoby: req.body.hoby || Siswa.hoby,
            saudara_kandung_aktif: req.body.saudara_kandung_aktif || Siswa.saudara_kandung_aktif,
            sumber_info_sekolah: req.body.sumber_info_sekolah || Siswa.sumber_info_sekolah,
            lembaga_tujuan: req.body.lembaga_tujuan || Siswa.lembaga_tujuan,
            kelas_tujuan: req.body.kelas_tujuan || Siswa.kelas_tujuan,
            ukuran_baju: req.body.ukuran_baju || Siswa.ukuran_baju,
            asal_sekolah: req.body.asal_sekolah || Siswa.asal_sekolah,
            nama_sekolah_asal: req.body.nama_sekolah_asal || Siswa.nama_sekolah_asal,
            tanggal_lulus: req.body.tanggal_lulus || Siswa.tanggal_lulus,
            pilihan_pesantren_kedua: req.body.pilihan_pesantren_kedua || Siswa.pilihan_pesantren_kedua,
            no_kk: req.body.no_kk || Siswa.no_kk,
            nama_ayah: req.body.nama_ayah || Siswa.nama_ayah,
            nik_ayah: req.body.nik_ayah || Siswa.nik_ayah,
            status_ayah: req.body.status_ayah || Siswa.status_ayah,
            pob_ayah: req.body.pob_ayah || Siswa.pob_ayah,
            dob_ayah: req.body.dob_ayah || Siswa.dob_ayah,
            gelar_akademik_ayah: req.body.gelar_akademik_ayah || Siswa.gelar_akademik_ayah,
            status_hidup_ayah: req.body.status_hidup_ayah || Siswa.status_hidup_ayah,
            pendidikan_terkahir_ayah: req.body.pendidikan_terkahir_ayah || Siswa.pendidikan_terkahir_ayah,
            pekerjaan_ayah: req.body.pekerjaan_ayah || Siswa.pekerjaan_ayah,
            penghasilan_perbulan_ayah: req.body.penghasilan_perbulan_ayah || Siswa.penghasilan_perbulan_ayah,
            telp_ayah: req.body.telp_ayah || Siswa.telp_ayah,
            alamat_ayah: req.body.alamat_ayah || Siswa.alamat_ayah,
            nama_ibu: req.body.nama_ibu || Siswa.nama_ibu,
            nik_ibu: req.body.nik_ibu || Siswa.nik_ibu,
            status_ibu: req.body.status_ibu || Siswa.status_ibu,
            pob_ibu: req.body.pob_ibu || Siswa.pob_ibu,
            dob_ibu: req.body.dob_ibu || Siswa.dob_ibu,
            gelar_akademik_ibu: req.body.gelar_akademik_ibu || Siswa.gelar_akademik_ibu,
            status_hidup_ibu: req.body.status_hidup_ibu || Siswa.status_hidup_ibu,
            pendidikan_terkahir_ibu: req.body.pendidikan_terkahir_ibu || Siswa.pendidikan_terkahir_ibu,
            pekerjaan_ibu: req.body.pekerjaan_ibu || Siswa.pekerjaan_ibu,
            penghasilan_perbulan_ibu: req.body.penghasilan_perbulan_ibu || Siswa.penghasilan_perbulan_ibu,
            telp_ibu: req.body.telp_ibu || Siswa.telp_ibu,
            alamat_ibu: req.body.alamat_ibu || Siswa.alamat_ibu,
            yang_menanggung_biaya: req.body.yang_menanggung_biaya || Siswa.yang_menanggung_biaya,
            nama_penanggung_biaya: req.body.nama_penanggung_biaya || Siswa.nama_penanggung_biaya,
            hubungan_keluarga_penanggung_biaya: req.body.hubungan_keluarga_penanggung_biaya || Siswa.hubungan_keluarga_penanggung_biaya,
            telepon_penanggung_biaya: req.body.telepon_penanggung_biaya || Siswa.telepon_penanggung_biaya,
            pekerjaan_penanggung_biaya: req.body.pekerjaan_penanggung_biaya || Siswa.pekerjaan_penanggung_biaya,
            alamat_penanggung_biaya: req.body.alamat_penanggung_biaya || Siswa.alamat_penanggung_biaya,
            kewarganegaraan: req.body.kewarganegaraan || Siswa.kewarganegaraan,
            negara: req.body.negara || Siswa.negara,
            alamat: req.body.alamat || Siswa.alamat,
            rt: req.body.rt || Siswa.rt,
            rw: req.body.rw || Siswa.rw,
            provinsi: req.body.provinsi || Siswa.provinsi,
            kodepos: req.body.kodepos || Siswa.kodepos,
            kota_kab: req.body.kota_kab || Siswa.kota_kab,
            kecamatan: req.body.kecamatan || Siswa.kecamatan,
            desa_kelurahan: req.body.desa_kelurahan || Siswa.desa_kelurahan,
            lokasi_ujian: req.body.lokasi_ujian || Siswa.lokasi_ujian,
          })
          .then(() => res.status(200).send(Siswa))
          .catch((error) => {
            console.log(error);
            res.status(400).send(error)
          });
      })
      .catch((error) => res.status(400).send(error));
  },

  changePassword(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Siswa
      .findByPk(req.body.id, {})
      .then(Siswa => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        return Siswa
          .update({
            password: req.body.password ? Helper.hashPassword(req.body.password) : Siswa.password,
          })
          .then(() => res.status(200).send(Siswa))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  changeStep(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Siswa
      .findByPk(req.body.id, {})
      .then(Siswa => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        
        return Siswa
          .update({
            current_status: req.body.step,
          })
          .then((Siswa) => res.status(200).send(Siswa))
          .catch((error) => {
            console.log(error); 
            res.status(400).send(error)
          });
      })
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error)
      });
  },

  updatePhotoSiswa(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Siswa
      .findByPk(req.body.id, {})
      .then(Siswa => {
        if (!Siswa) {
          return res.status(404).send({
            message: 'Siswa Not Found',
          });
        }
        
        return Siswa
          .update({
            photo: req.body.photo,
          })
          .then((Siswa) => res.status(200).send(Siswa))
          .catch((error) => {
            console.log(error); 
            res.status(400).send(error)
          });
      })
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error)
      });
  },

  async addRegistrationVaNumber(req, res) {
    console.log('req.body', req.body)
  
    const lastInvoice = await Invoice.findOne({
      where : { 
        akun: 'PSB',
        siswa_id: req.body.siswa_id,
        status: {
          [Sequelize.Op.or]: ['PENDING','SUCCESS']
        }
      }
    })

    console.log(lastInvoice);

    if (lastInvoice) {
      return res.status(400).send("invoice already exist.");
    }

    const akun = 'PSB';
    const title = 'Pendaftaran santri baru';
    const amount = 450000;

    const invoice = Helper.generateInvoiceNumber();
    const newInvoice = await Invoice
      .create({        
        siswa_id: req.body.siswa_id,
        invoice: invoice,
        akun: req.body.akun,
        nomor_va: req.body.nomor_va,
        akun: akun,
        title: title,
        amount: amount,
        status: 'PENDING',
      })

    if (newInvoice) {
      const va = await NomorVa.findOne({        
        where: { 
          siswa_id: req.body.siswa_id,
          akun: 'PSB' 
        }
      });

      if (!va) {
        const newVa = await NomorVa.create(
          {
            siswa_id: req.body.siswa_id,
            akun: 'PSB',
            nomor: req.body.nomor_va
          }
        );

        if (newVa) {
          return res.status(200).send(newInvoice);
        }
      } else {
        const updateVa = await va.update({
          nomor: req.body.nomor_va
        });

        if (updateVa) {
          return res.status(200).send(newInvoice);
        }
      }

      return res.status(400).send("Something went wrong");
      
    } else {
      return res.status(400).send("Something went wrong");

    }


  },

  delete(req, res) {
    return req.db.Siswa
      .findByPk(req.params.id)
      .then(Siswa => {
        if (!Siswa) {
          return res.status(400).send({
            message: 'Siswa Not Found',
          });
        }
        return Siswa
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};