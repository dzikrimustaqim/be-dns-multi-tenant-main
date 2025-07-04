const { Sequelize } = require('sequelize');
const Helper = require('../utils/helper');

module.exports = {
  login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }
    // if (!Helper.isValidEmail(req.body.email)) {
    //   return res.status(400).send({ 'message': 'Please enter a valid email address' });
    // }

    return req.db.Proguser
      .findOne({
        include:[
          { 
            model: req.db.Role, 
            as: 'Role', 
            attributes: ['id', 'role_name','slug'],            
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
            model: req.db.StaffProfile, 
            as: 'userProfile', 
            attributes: ['real_name','name_ar','photo'],            
            required:true            
          },
        ],
        where: { username: req.body.username } 
      })
      .then((resProguser) => {
        if (!resProguser) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        if (!Helper.comparePassword(resProguser.password, req.body.password)) {
          return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
        }
        
        resProguser.password = "";
        
        const token = Helper.generateToken(resProguser.id, req.tenantId);
        
        const jsonUser = {
          "iduser":resProguser.id,
          "username":resProguser.username,
          "nama":resProguser.nama,
          "email":resProguser.email,
          "proguser":resProguser
        };
        const user = Helper.strEncode(JSON.stringify(jsonUser));

        return res.status(200).send({ token, user });
      })
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); 
      });
  },

  async list(req, res) {
    
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {};
    
    if(searchTerm) {
      whereStatement = {
        [Sequelize.Op.or]: [
          {
            '$userProfile.real_name$': {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
          {
            '$userProfile.kode_guru_nip$': {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
          {
            username: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
      //whereStatement.username = {[Sequelize.Op.like]: '%' + searchTerm + '%'};
      //whereProfileStatement.real_name = {[Sequelize.Op.like]: '%' + searchTerm + '%'};
    }

    const query = {
      include:[
        { 
          model: req.db.Role, 
          as: 'Role', 
          attributes: ['role_name','slug'],            
          required:true,
          where: {
            slug: {
              [Sequelize.Op.ne]: 'SUPER_ADMIN'
            },
          },            
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
          model: req.db.StaffProfile, 
          as: 'userProfile',            
          required:true,
          where: {}
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

    const count = await req.db.Proguser
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);
    
    return req.db.Proguser
      .findAll(query)
      .then((resProguser) => {
        res.status(200).send(
          {
            'totalrows': count,
            'data': resProguser
          }
        )
      })
      .catch((error) => { res.status(400).send(error); });
  },

  listProguserAktif(req, res) {
    return req.db.Proguser
      .findAll({
        where : { status: 't' },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((resProguser) => res.status(200).send(resProguser))
      .catch((error) => { res.status(400).send(error); });
  },

  listProguserByRole(req, res) {
    return req.db.Proguser
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
      .then((resProguser) => res.status(200).send(resProguser))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.Proguser
      .findByPk(req.params.id, {
        include:[
          'Role','userProfile'
        ],
      })
      .then((resProguser) => {
        if (!resProguser) {
          return res.status(404).send({
            message: 'Proguser Not Found',
          });
        }
        return res.status(200).send(resProguser);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {

    if (!req.body.roleId || !req.body.username || !req.body.email || !req.body.real_name) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }

    const hashPassword = Helper.hashPassword(req.body.password ? req.body.password : "secretpassword");
    
    const reqdob = req.body.dob !== '' ? req.body.dob : null;
    const reqgender = req.body.gender !== '' ? req.body.gender : null;    
    const reqmarital_status = req.body.marital_status !== '' ? req.body.marital_status : null;    
    const reqgolongan_darah = req.body.golongan_darah !== '' ? req.body.golongan_darah : null;
    const reqstatus = req.body.status !== '' ? req.body.status : null;
    const reqtanggal_masuk = req.body.tanggal_masuk !== '' ? req.body.tanggal_masuk : null;

    // First, we start a transaction and save it into a variable
    const t = await req.db.Proguser.sequelize.transaction();

    try {
      const user = await req.db.Proguser
        .create({
          role_id: req.body.roleId,        
          username: req.body.username,
          email: req.body.email,
          password: hashPassword
        }, { transaction: t });

      const profile = await req.db.StaffProfile
        .create({
          id_user: user.id,        
          real_name: req.body.real_name,
          nik: req.body.nik,
          name_ar: req.body.name_ar,
          gelar_akademik: req.body.gelar_akademik,
          pob: req.body.pob,
          dob: reqdob,
          gender: reqgender,
          hobby: req.body.hobby,
          photo: req.body.photo,
          sign: req.body.sign,
          marital_status: reqmarital_status,
          facebook: req.body.facebook,
          instagram: req.body.instagram,
          twitter: req.body.twitter,
          no_hp1: req.body.no_hp1,
          no_hp2: req.body.no_hp2,
          golongan_darah: reqgolongan_darah,
          ayah: req.body.ayah,
          ibu: req.body.ibu,
          alamat: req.body.alamat,
          rt: req.body.rt,
          rw: req.body.rw,
          provinsi: req.body.provinsi,
          kodepos: req.body.kodepos,
          kota_kab: req.body.kota_kab,
          kecamatan: req.body.kecamatan,
          desa_kelurahan: req.body.desa_kelurahan,
          kode_guru_nip: req.body.kode_guru_nip,
          nuptk: req.body.nuptk,
          kode_guru_nip: req.body.kode_guru_nip,
          aktifitas_luar_pondok: req.body.aktifitas_luar_pondok,
          rekomendasi: req.body.rekomendasi,
          status: reqstatus,
          tahun_bertugas: req.body.tahun_bertugas,
          tanggal_masuk: reqtanggal_masuk
        }, { transaction: t });
        
        await t.commit();

        return res.status(200).send(user)
    } catch (error) {

      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
    
      return res.status(500).send(error);
    }

    

  },

  async update(req, res) {
    console.log('req.body', req.body)
  
    if (!req.body.roleId || !req.body.username || !req.body.email || !req.body.real_name) {
      return res.status(400).send({ 'message': 'Some values are missing' });
    }
    
    const reqdob = req.body.dob !== '' ? req.body.dob : null;
    const reqgender = req.body.gender !== '' ? req.body.gender : null;    
    const reqmarital_status = req.body.marital_status !== '' ? req.body.marital_status : null;    
    const reqgolongan_darah = req.body.golongan_darah !== '' ? req.body.golongan_darah : null;
    const reqstatus = req.body.status !== '' ? req.body.status : null;
    const reqtanggal_masuk = req.body.tanggal_masuk !== '' ? req.body.tanggal_masuk : null;


    const t = await req.db.Proguser.sequelize.transaction();

    try {
      const user = await req.db.Proguser
        .findByPk(req.params.id, {
          include: [
            'userProfile'
          ]
        });

      const idProfile = user.userProfile.id;

      user.update({
        role_id: req.body.roleId || user.role_id,
        username: req.body.username || user.username,
        password: req.body.password ? Helper.hashPassword(req.body.password) : user.password,
        nama: req.body.nama || user.nama,
        nama_ar: req.body.telepon || user.nama_ar,
        email: req.body.email || user.email,
        active: req.body.active || user.active
      });

      const profileUser = await req.db.StaffProfile.findByPk(idProfile, {});

      profileUser.update({
        real_name: req.body.real_name || profileUser.real_name,
        nik: req.body.nik || profileUser.nik,
        name_ar: req.body.name_ar || profileUser.name_ar,
        gelar_akademik: req.body.gelar_akademik || profileUser.gelar_akademik,
        pob: req.body.pob || profileUser.pob,
        dob: reqdob || profileUser.dob,
        gender: reqgender || profileUser.gender,
        hobby: req.body.hobby || profileUser.hobby,
        marital_status: reqmarital_status  || profileUser.marital_status,
        facebook: req.body.facebook || profileUser.facebook,
        instagram: req.body.instagram || profileUser.instagram,
        twitter: req.body.twitter || profileUser.twitter,
        no_hp1: req.body.no_hp1 || profileUser.no_hp1,
        no_hp2: req.body.no_hp2 || profileUser.no_hp2,
        golongan_darah: reqgolongan_darah || profileUser.golongan_darah,
        ayah: req.body.ayah || profileUser.ayah,
        ibu: req.body.ibu || profileUser.ibu,
        alamat: req.body.alamat || profileUser.alamat,
        rt: req.body.rt || profileUser.rt,
        rw: req.body.rw || profileUser.rw,
        provinsi: req.body.provinsi || profileUser.provinsi,
        kodepos: req.body.kodepos || profileUser.kodepos,
        kota_kab: req.body.kota_kab || profileUser.kota_kab,
        kecamatan: req.body.kecamatan || profileUser.kecamatan,
        desa_kelurahan: req.body.desa_kelurahan || profileUser.desa_kelurahan,
        kode_guru_nip: req.body.kode_guru_nip || profileUser.kode_guru_nip,
        nuptk: req.body.nuptk || profileUser.nuptk,
        kode_guru_nip: req.body.kode_guru_nip || profileUser.kode_guru_nip,
        aktifitas_luar_pondok: req.body.aktifitas_luar_pondok || profileUser.aktifitas_luar_pondok,
        rekomendasi: req.body.rekomendasi || profileUser.rekomendasi,
        status: reqstatus || profileUser.status,
        tahun_bertugas: req.body.tahun_bertugas || profileUser.tahun_bertugas,
        tanggal_masuk: reqtanggal_masuk || profileUser.tanggal_masuk
      })

      await t.commit();

      return res.status(200).send(user)

    } catch (error) {
      console.log(error);
      await t.rollback();
    
      return res.status(500).send(error);
    }
  },

  changePassword(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Proguser
      .findByPk(req.body.id, {})
      .then(resProguser => {
        if (!resProguser) {
          return res.status(404).send({
            message: 'Proguser Not Found',
          });
        }
        return resProguser
          .update({
            password: req.body.password ? Helper.hashPassword(req.body.password) : resProguser.password,
          })
          .then((resProguser) => res.status(200).send(resProguser))
          .catch((error) => {
            console.log(error);  
            res.status(400).send(error)
          });
      })
      .catch((error) => res.status(400).send(error));
  },

  changePhoto(req, res) {
    console.log('req.body', req.body)
  
    return req.db.StaffProfile
      .findByPk(req.body.id, {})
      .then(resProguser => {
        if (!resProguser) {
          return res.status(404).send({
            message: 'Proguser Not Found',
          });
        }
        return resProguser
          .update({
            photo: req.body.photo || Proguser.photo,
          })
          .then(() => res.status(200).send(resProguser))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  changeSign(req, res) {
    console.log('req.body', req.body)
  
    return req.db.StaffProfile
      .findByPk(req.body.id, {})
      .then(resProguser => {
        if (!resProguser) {
          return res.status(404).send({
            message: 'Proguser Not Found',
          });
        }
        return resProguser
          .update({
            sign: req.body.sign || Proguser.sign,
          })
          .then(() => res.status(200).send(resProguser))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Proguser
      .findByPk(req.params.id)
      .then(resProguser => {
        if (!resProguser) {
          return res.status(400).send({
            message: 'Proguser Not Found',
          });
        }
        return resProguser
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => {
            console.log("ERROR => ", error);      
            res.status(400).send(error)
          });
      })
      .catch((error) => res.status(400).send(error));
  },
};