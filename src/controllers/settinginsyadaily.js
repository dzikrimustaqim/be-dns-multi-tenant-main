const SettingInsyaDaily = require('../models').SettingInsyaDaily;

module.exports = {
  async list(req, res) {
    const searchTerm = req.query.searchTerm;
    const limit = req.query.size ? parseInt(req.query.size) : null;
    const offset = parseInt(req.query.page | 0) * limit;
    const id_tahun_ajaran = req.query.id_tahun_ajaran;
    const semester = req.query.semester;

    let whereStatement = {
    };

    if (id_tahun_ajaran) {
      whereStatement = {
        id_tahun_ajaran: id_tahun_ajaran,
        semester: semester
      }
    }    

    const query = {
      include: [
        'TahunAjaran','Tingkat'
      ],   
      offset: offset,
      limit: limit,
      where: whereStatement,     
      order: [
        ['createdAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    }

    const count = await SettingInsyaDaily
                        .count(query);

    return SettingInsyaDaily
      .findAll(query)
      .then((SettingInsyaDaily) => {
        res.status(200).send(
          {
            'totalrows': count,
            'data': SettingInsyaDaily
          }
        )
      })
      .catch((error) => { res.status(400).send(error); });
  },

  getByTipe(req, res) {
    return SettingInsyaDaily
      .findOne({
        where : { 
          tipe: req.body.tipe,
          id_tahun_ajaran: req.body.id_tahun_ajaran,
          semester: req.body.semester,
          id_tingkat: req.body.id_tingkat
        },
        order : [
          ['createdAt', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      })
      .then((SettingInsyaDaily) => res.status(200).send(SettingInsyaDaily))
      .catch((error) => {
        console.log(error); 
        res.status(400).send(error); });
  },

  getById(req, res) {
    return SettingInsyaDaily
      .findByPk(req.params.id, {})
      .then((SettingInsyaDaily) => {
        if (!SettingInsyaDaily) {
          return res.status(404).send({
            message: 'SettingInsyaDaily Not Found',
          });
        }
        return res.status(200).send(SettingInsyaDaily);
      })
      .catch((error) => res.status(400).send(error));
  },
  
  add(req, res) {
    return SettingInsyaDaily
      .create({
        tipe: req.body.tipe,
        id_tahun_ajaran: req.body.id_tahun_ajaran,
        semester: req.body.semester,
        id_tingkat: req.body.id_tingkat,
        jumlah_tugas: req.body.jumlah_tugas,
      })
      .then((SettingInsyaDaily) => res.status(201).send(SettingInsyaDaily))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    console.log('req.body', req.body)
  
    return SettingInsyaDaily
      .findByPk(req.params.id, {})
      .then(SettingInsyaDaily => {
        if (!SettingInsyaDaily) {
          return res.status(404).send({
            message: 'SettingInsyaDaily Not Found',
          });
        }
        return SettingInsyaDaily
          .update({
            tipe: req.body.tipe || SettingInsyaDaily.tipe,
            id_tahun_ajaran: req.body.id_tahun_ajaran || SettingInsyaDaily.id_tahun_ajaran,
            semester: req.body.semester || SettingInsyaDaily.semester,
            id_tingkat: req.body.id_tingkat || SettingInsyaDaily.id_tingkat,
            jumlah_tugas: req.body.jumlah_tugas || SettingInsyaDaily.jumlah_tugas,
          })
          .then(() => res.status(200).send(SettingInsyaDaily))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return SettingInsyaDaily
      .findByPk(req.params.id)
      .then(SettingInsyaDaily => {
        if (!SettingInsyaDaily) {
          return res.status(400).send({
            message: 'SettingInsyaDaily Not Found',
          });
        }
        return SettingInsyaDaily
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};