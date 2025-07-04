const { QueryTypes } = require("sequelize");

module.exports = {
  async getRekapPembayaranFormuirPerTingkat(req, res) {
    const queryStr =
      "select a.nama_tingkat,c.status_pembayaran,count(c.id) as total from tingkat a left join siswa b on a.id=b.tingkat_id AND b.angkatan=(:angkatan) left join tagihan c on b.id=c.id_siswa AND c.status_pembayaran=(:status) left join virtual_account d on c.id=d.id_tagihan GROUP BY a.nama_tingkat,a.urut,c.status_pembayaran ORDER BY a.urut";

    const rekap = await req.db.Siswa.sequelize.query(queryStr, {
      replacements: {
        angkatan: req.body.angkatan,
        status: "BELUM_DIBAYAR",
      },
      type: QueryTypes.SELECT,
    });

    console.log(rekap);
  },

  async getRekapPembayaranFormuirPerLembaga(req, res) {
    console.log(req.body);
    const queryStr =
      "SELECT a.nama_lembaga,c.status_pembayaran,count(c.id) as total FROM lembaga a \
      LEFT JOIN siswa b ON a.id=b.lembaga_tujuan AND b.angkatan=(:angkatan) LEFT JOIN tagihan c \
      ON b.id=c.id_siswa AND c.status_pembayaran=(:status) left join virtual_account d on c.id=d.id_tagihan \
      AND d.prefix=(:prefix) GROUP BY a.nama_lembaga,a.urut,c.status_pembayaran ORDER BY a.urut";

    const rekap = await req.db.Siswa.sequelize.query(queryStr, {
      replacements: {
        angkatan: req.body.angkatan,
        status: "LUNAS",
        prefix: process.env.REG_FEE_BILLER_PREFIX,
      },
      type: QueryTypes.SELECT,
    });

    console.log(rekap);

    return res.status(200).send(rekap);
  },

  async getRekapTahapanProses(req, res) {
    console.log(req.body);
    const queryStr =
      "SELECT count(a.id) FILTER (where current_status='FILL_REGISTRATION_DATA') AS filldata, \
      count(a.id) FILTER (WHERE current_status='REGISTRATION_FEE') AS regpayment, \
      count(a.id) FILTER (WHERE current_status='DOCUMENT_VALIDATION') AS docval, \
      count(a.id) FILTER (WHERE current_status='ENTRANCE_EXAMINATION') AS exam \
      FROM siswa a WHERE angkatan=(:angkatan)";

    const rekap = await req.db.Siswa.sequelize.query(queryStr, {
      replacements: {
        angkatan: req.body.angkatan,
      },
      type: QueryTypes.SELECT,
    });

    console.log(rekap);

    return res.status(200).send(rekap);
  },

  async getRekapStatusKelulusan(req, res) {
    console.log(req.body);
    const queryStr =
      "SELECT count(a.id) FILTER (WHERE status_kelulusan='lulus_murni') AS lulus_murni, \
        count(a.id) FILTER (WHERE status_kelulusan='lulus_bersyarat') AS lulus_bersyarat, \
        count(a.id) FILTER (WHERE status_kelulusan='lulus_cabang') AS lulus_cabang, \
        count(a.id) FILTER (WHERE status_kelulusan='menunggu_ujian') AS menunggu_ujian, \
        count(a.id) FILTER (WHERE status_kelulusan='tidak_lulus') AS tidak_lulus \
        FROM hasil_ppsb a WHERE id_tahun_ajaran=(:idperiode) GROUP BY a.id_lembaga";

    const rekap = await req.db.Siswa.sequelize.query(queryStr, {
      replacements: {
        idperiode: req.body.id_tahun_ajaran,
      },
      type: QueryTypes.SELECT,
    });

    console.log(rekap);

    return res.status(200).send(rekap);
  },
};
