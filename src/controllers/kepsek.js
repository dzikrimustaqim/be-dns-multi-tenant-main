
module.exports = {
  list(req, res) {
    return req.db.Kepsek
      .findAll({        
        order: [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Kepsek) => res.status(200).send(Kepsek))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return req.db.Kepsek
      .findByPk(req.params.id, {})
      .then((Kepsek) => {
        if (!Kepsek) {
          return res.status(404).send({
            message: 'Kepsek Not Found',
          });
        }
        return res.status(200).send(Kepsek);
      })
      .catch((error) => res.status(400).send(error));
  },

  getByTahunAjaran(req, res) {
    console.log(req.params.id);
    return req.db.Kepsek
      .findAll({
        where : { id_tahun_ajaran: req.params.id, tipe: "KEPSEK" },
        include: [
          'TahunAjaran',
          { 
            model: req.db.Proguser, 
            as: 'Proguser',            
            required:false,            
            include: [
              {
                model: req.db.StaffProfile, 
                as: 'userProfile',            
                required:true,
              }
            ],            
          },          
        ],
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((Kepsek) => res.status(200).send(Kepsek))
      .catch((error) => { res.status(400).send(error); });
  },

  
  add(req, res) {
    return req.db.Kepsek
      .create({
        id_tahun_ajaran: req.body.id_tahun_ajaran,
        tipe: req.body.tipe,
        id_user: req.body.id_user
      })
      .then((Kepsek) => res.status(201).send(Kepsek))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log('req.body', req.body)
  
    return req.db.Kepsek
      .findByPk(req.params.id, {})
      .then(Kepsek => {
        if (!Kepsek) {
          return res.status(404).send({
            message: 'Kepsek Not Found',
          });
        }
        return Kepsek
          .update({
            id_user: req.body.id_user || Kepsek.id_user            
          })
          .then(() => res.status(200).send(Kepsek))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return req.db.Kepsek
      .findByPk(req.params.id)
      .then(Kepsek => {
        if (!Kepsek) {
          return res.status(400).send({
            message: 'Kepsek Not Found',
          });
        }
        return Kepsek
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};