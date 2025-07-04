'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.bulkInsert({ tableName: 'template_setting', schema: schema }, [
      {
        template: 'tagihan',
        content: '<div class="invoice"> <div class="invoice-header"> <img src="./../../../assets/images/Logo-DN.png" alt="Company Logo" style="width:80px; max-width:80px;"> <p> BENDAHARA PESANTREN<br> PONDOK PESANTREN DARUNNAJAH<br> Jl. Ulujami Raya No.86, RW.7, Ulujami,Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12250 </p> </div> <hr> <!-- <div class="invoice-info"> <p>Jakarta,06-09-2023</p> </div> --> <div class="invoice-details"> <table border="0" style="width: 100%"> <tr> <td>Nomor </td> <td width="8px">:</td> <td>1/KEUX/#tahunDiNomorSurat#</td> <td width="250px">Jakarta,#tanggalSurat#</td> </tr> <tr> <td>Lampiran</td> <td width="8px">:</td> <td>1</td> <td>&nbsp;</td> </tr> <tr> <td>Hal</td> <td width="8px">:</td> <td><u><b>INFORMASI SPP</b></u></td> <td>&nbsp;</td> </tr> </table> </div> <div class="invoice-opening"> <br /> <p> Kepada Yth :<br /> Orang Tua/wali dari : <strong>#namaSiswa#</strong><br /> Kelas : <strong>#namaKelas#</strong><br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Di Tempat </p> <p> Bismillahirrahmannirrahim </br> Assalamu`alaikum Warahmatullahi Wabarakatuh <p align="justify"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Puji syukur kami panjatkan ke hadirat Allah SWT teriring do\'a semoga Bapak/Ibu senantiasa berada dalam rahmat, hidayah dan taufiq-Nya sehingga mampu melaksanakan aktifitas sehari-hari dengan ridho Allah SWT. Aminn.. </p> <p align="justify"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Informasi SPP: </p> </div> #dataVA# #dataTagihan# <div class="invoice-footer"> <p>Demikian surat Konfirmasi ini sampaikan atas perhatian dan kerjasamanya kami ucapkan banyak terimakasih.</p> <p>Wassalamu`alaikum Warahmatullahi Wabarakatuh</p> <br/> <p><b>Pimpinan Pondok Pesantren Darunnajah Ulujami</b></p> <br/> <br/> <p><b>Dr. H. Sofwan Manaf M.Si</b></p> <br/> <div class="row-nb"> <div class="column-nbleft">NB:</div> <div class="column-nbright">1. Pembayaran SPP bisa dilakukan dari tanggal 1 sampai akhir bulan setiap bulannya.</div> </div> <div class="row-nb"> <div class="column-nbleft">&nbsp;</div> <div class="column-nbright">2. Apabila sejak dikeluarkan surat ini telah melakukan pembayaran mohon diabaikan.</div> </div> <div class="row-nb"> <div class="column-nbleft">&nbsp;</div> <div class="column-nbright">3. Keterlambatan pembayaran SPP akan terakumulasi dengan SPP bulan selanjutnya.</div> </div> </div> </div>'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.bulkDelete({ tableName: 'template_setting', schema: schema }, null, {});
  }
};
