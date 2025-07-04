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
      offset: offset,
      limit: limit,
      where: whereStatement,        
      order: [
        ['name', 'ASC'],
      ],
    }

    const count = await req.db.TahunAjaran
                        .count(query);
    console.log("COUNT : ", count);
    console.log(whereStatement);

    return req.db.TahunAjaran
    .findAll(query)
    .then((resultTahunAjaran) => {
      res.status(200).send(
        {
          'totalrows': count,
          'data': resultTahunAjaran
        }
      )
    })
    .catch((error) => { res.status(400).send(error); });
  },

  getTahunAjaranAktif(req, res) {
    return req.db.TahunAjaran
      .findOne({
        include: ['Semester'],
        where : { active: 't' },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((resultTahunAjaran) => res.status(200).send(resultTahunAjaran))
      .catch((error) => { res.status(400).send(error); });
  },

  getTahunPendaftaranAktif(req, res) {
    return req.db.TahunAjaran
      .findOne({
        where : { ppsb: 't' },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((resultTahunAjaran) => res.status(200).send(resultTahunAjaran))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.TahunAjaran
      .findByPk(req.params.id, {})
      .then((resultTahunAjaran) => {
        if (!resultTahunAjaran) {
          return res.status(404).send({
            message: 'TahunAjaran Not Found',
          });
        }
        return res.status(200).send(resultTahunAjaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  getBySlug(req, res) {
    return req.db.TahunAjaran
      .findOne({where: { slug: req.body.slug }})
      .then((resultTahunAjaran) => {
        if (!resultTahunAjaran) {
          return res.status(404).send({
            message: 'TahunAjaran Not Found',
          });
        }
        return res.status(200).send(resultTahunAjaran);
      })
      .catch((error) => res.status(400).send(error));
  },

  async add(req, res) {

    if (req.body.active === true) {
      const thActive = await req.db.TahunAjaran
          .findOne({where: { active: 't' }});

      if (thActive) {
        return res.status(400).send({
          message: 'Masih ada tahun ajaran aktif',
        });
      }
    }

    if (req.body.ppsb === true) {
      const ppsbActive = await req.db.TahunAjaran
          .findOne({where: { ppsb: 't' }});

      if (ppsbActive) {
        return res.status(400).send({
          message: 'Masih ada tahun pendaftaran aktif',
        });
      }
    }
    
    return req.db.TahunAjaran
      .create({        
        name: req.body.name,
        active: req.body.active,
        ppsb: req.body.ppsb
      })
      .then((resultTahunAjaran) => res.status(201).send(resultTahunAjaran))
      .catch((error) => res.status(400).send(error));
  },

  async update(req, res) {
    console.log('req.body', req.body)
    const status = req.body.active === false ? 'f' : req.body.active === true ? 't' : req.body.active;
    const ppsbStatus = req.body.ppsb === false ? 'f' : req.body.ppsb === true ? 't' : req.body.ppsb;
    // cek if other is active 
    
    if (req.body.active) {
      const thActive = await req.db.TahunAjaran
          .findOne({where: { active: 't' }});

      if (thActive && req.params.id != thActive.id) {
        return res.status(400).send({
          message: 'Masih ada tahun ajaran aktif',
        });
      }
    }

    if (req.body.ppsb) {
      const ppsbActive = await req.db.TahunAjaran
            .findOne({where: { ppsb: 't' }});
  
      if (ppsbActive && req.params.id != ppsbActive.id) {
        return res.status(400).send({
          message: 'Masih ada tahun pendaftaran aktif',
        });
      }
    }

    return req.db.TahunAjaran
      .findByPk(req.params.id, {})
      .then(resultTahunAjaran => {
          if (!resultTahunAjaran) {
              return res.status(404).send({
                  message: 'TahunAjaran Not Found',
              });
          }
          return resultTahunAjaran
          .update({
              name: req.body.name || resultTahunAjaran.name,
              active: status || resultTahunAjaran.active,
              ppsb: ppsbStatus || resultTahunAjaran.ppsb
          })
          .then(() => res.status(200).send(resultTahunAjaran))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    console.log("ID : ", req.params.id);
    
    return req.db.TahunAjaran
      .findByPk(req.params.id)
      .then(resultTahunAjaran => {
        if (!resultTahunAjaran) {
          return res.status(400).send({
            message: 'TahunAjaran Not Found',
          });
        }
        console.log(resultTahunAjaran);
        if (resultTahunAjaran.active === true) {
          return res.status(400).send({
            message: 'Cannot delete active TahunAjaran',
          });
        }
        return resultTahunAjaran
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => {
        console.log(error);
        
        res.status(400).send(error)
      });
  },
};