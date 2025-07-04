const { Sequelize } = require('sequelize');
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
            nama_gedung: {
              [Sequelize.Op.iLike]: '%' + searchTerm + '%'
            }
          },
        ]
      }
    }

    const query = {
      include:[
        { 
          model: req.db.Rayon, 
          as: 'GedungRayon',            
          required:false,            
          include: [
            {
              model: req.db.Kamar,
              as: 'RayonKamar',
              required: false,        
            },              
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

    const count = await req.db.Gedung
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.Gedung
    .findAll(query)
    .then((Gedung) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': Gedung
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.Gedung
      .findByPk(req.params.id, {
        include:[
          { 
            model: req.db.Rayon, 
            as: 'GedungRayon',            
            required:true,            
            include: [
              {
                model: req.db.Kamar,
                as: 'RayonKamar',
                required: true,        
              },              
            ],            
          },
        ],
      })
      .then((Gedung) => {
        if (!Gedung) {
          return res.status(404).send({
            message: 'Gedung Not Found',
          });
        }
        return res.status(200).send(Gedung);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return req.db.Gedung
      .create({        
        nama_gedung: req.body.nama_gedung,
      })
      .then((Gedung) => res.status(201).send(Gedung))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log('req.body', req.body)
    return req.db.Gedung
      .findByPk(req.params.id, {})
      .then(Gedung => {
        if (!Gedung) {
          return res.status(404).send({
            message: 'Gedung Not Found',
          });
        }
        return Gedung
          .update({
            nama_gedung: req.body.nama_gedung || Gedung.nama_gedung,
          })
          .then(() => res.status(200).send(Gedung))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Gedung
      .findByPk(req.params.id)
      .then(Gedung => {
        if (!Gedung) {
          return res.status(400).send({
            message: 'Gedung Not Found',
          });
        }
        return Gedung
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};