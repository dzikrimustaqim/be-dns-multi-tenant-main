const { Sequelize } = require('sequelize');

const Permission = require('../models').Permission;
const RolePermission = require('../models').RolePermission;
const Helper = require('../utils/helper');

module.exports = {  
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    
    let whereStatement = {};
    
    if(searchTerm) {
      whereStatement = {
        slug: {
          [Sequelize.Op.notIn]: ['SUPER_ADMIN']
        },
        active: 't',
        [Sequelize.Op.or]: [
          {
            role_name: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    } else {
      whereStatement = {
        slug: {
          [Sequelize.Op.notIn]: ['SUPER_ADMIN']
        },
        active: 't',
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

    const count = await req.db.Role
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Role
    .findAll(query)
    .then((roleResult) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': roleResult
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },


  listForStaff(req, res) {
    return req.db.Role
      .findAll({
        where: {
          slug: {
            [Sequelize.Op.notIn]: ['SUPER_ADMIN','PARENT','SISWA']
          },
          active: 't',
        },        
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((roleResult) => res.status(200).send(roleResult))
      .catch((error) => { res.status(400).send(error); });
  },

  listRoleAktif(req, res) {
    return req.db.Role
      .findAll({
        where: {
          slug: {
            [Sequelize.Op.ne]: 'SUPER_ADMIN'
          }
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((roleResult) => res.status(200).send(roleResult))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.Role
      .findByPk(req.params.id, {})
      .then((roleResult) => {
        if (!roleResult) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(roleResult);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.Role
      .findOne({
        include: [
          {
            model: RolePermission,
            as: 'RolePermission',
            attributes: ['role_id','permission_id'], 
            required: false,
            include: [
              {
                model: Permission,
                as: 'Permission',
                attributes: ['module','permission_name','slug'], 
                required: false,        
              },              
            ],        
          },              
        ],
        where: { slug: req.body.slug }
      })
      .then((roleResult) => {
        if (!roleResult) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(roleResult);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    const roleSlug = Helper.slugify(req.body.role_name);
    
    return req.db.Role
      .create({        
        role_name: req.body.role_name,
        slug: roleSlug,
        editable: req.body.editable || 't'
      })
      .then((roleResult) => res.status(201).send(roleResult))
      .catch((error) => res.status(400).send(error));
  },

  async addPermission(req, res) {
    // delete first
    // add bulk new data
    const permIds = req.body.permissions;

    console.log('permIDS :', permIds)
    const roleperm = await RolePermission.findAll({
      where: {
        role_id: req.body.role_id
      }
    })

    let finDataToSave = [];

    if (roleperm.length > 0) {
      const existingPerm = roleperm.map(pid => pid.permission_id);
      console.log("Ada data", existingPerm);

      const permsToDelete = roleperm.filter(pid => !permIds.includes(pid.permission_id))
      if (permsToDelete.length > 0) {
        console.log("Ada delete", permsToDelete.length);
        for (perm of permsToDelete) {
          await perm.destroy()
        }
      }

      const permsToSave = permIds.filter(pid => !existingPerm.includes(pid));
      if (permsToSave.length > 0) {
        
        for (let i=0;i<permsToSave.length;i++) {
          const objToSave = {};

          objToSave['role_id'] = req.body.role_id;
          objToSave['permission_id'] = permsToSave[i]; 
          finDataToSave.push(objToSave);

        }
                
      } else {
        return res.status(200).send({ message: 'success'})
      }
    } else {
      for (let i=0;i<permIds.length;i++) {
        const objToSave = {};

        objToSave['role_id'] = req.body.role_id;
        objToSave['permission_id'] = permIds[i]; 
        finDataToSave.push(objToSave);

      }
    }

    return RolePermission
      .bulkCreate(finDataToSave, { fields: ["role_id", "permission_id"], returning: true })
      .then((roleResult) => {
        if (roleResult) {
          res.status(200).send({ message: 'success'})
        }
        res.status(401).send('error bulk upload')
      })
      .catch(error => {
        res.status(402).send(error)
      })
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.Role
      .findByPk(req.params.id, {})
      .then(roleResult => {
        if (!roleResult) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return roleResult
          .update({
            role_name: req.body.role_name || req.db.Role.role_name,
            editable: req.body.editable || req.db.Role.editable
          })
          .then((roleResult) => res.status(200).send(roleResult))
          .catch((error) => {
            console.log(error);
            
            res.status(400).send(error)
          });
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Role
      .findByPk(req.params.id)
      .then(roleResult => {
        if (!roleResult) {
          return res.status(400).send({
            message: 'Role Not Found',
          });
        }
        return roleResult
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};