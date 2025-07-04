var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
const encode = require("nodejs-base64-encode");
const expressJwt = require("express-jwt");
var moment = require("moment");

module.exports = {
  rjwt() {
    const secret = process.env.JWT_SECRET || "";
    return expressJwt({ secret, algorithms: ["HS256"] }).unless({
      path: [
        // public routes that don't require authentication
        process.env.DOMAIN + "/coreApi/v1/registrant/login",
        process.env.DOMAIN + "/coreApi/v1/registrant/register",
      ],
    });
  },
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, 8);
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(username, tenantId) {
    const token = jwt.sign(
      {
        userId: username,
        tenantId: tenantId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return token;
  },

  generateId() {
    let id = crypto.randomBytes(20).toString("hex");
    return id;
  },

  generateRegNumber() {
    let id =
      "REG-" +
      crypto.randomBytes(6).toString("hex") +
      moment().unix().toString();
    return id;
  },

  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  strEncode(str) {
    console.log(process.env.JWT_SECRET);
    return encode.encode(str, "base64");
  },

  /**
   * generate User Menu helper method
   * @param {string} perm
   * @returns {json} Object
   */
  generateUserMenus(perm) {
    const menus = [
      {
        menuType: "NAV_ITEM",
        title: "Dashboard",
        iconClass: "feather icon-monitor",
        link: "/dashboard",
        children: [],
      },

      {
        menuType: "NAV_ITEM",
        title: "Pengguna",
        iconClass: "feather icon-user",
        children: [
          {
            title: "Admin",
            link: "/user-admin",
          },
          {
            title: "Wali Kelas",
            link: "/user-walikelas",
          },
          {
            title: "Guru",
            link: "/user-guru",
          },
          {
            title: "Orang Tua",
            link: "/user-parent",
          },
          {
            title: "Siswa",
            link: "/user-siswa",
          },
        ],
      },
      {
        menuType: "NAV_HEADER",
        title: "PPSB",
        iconClass: "",
      },
      {
        menuType: "NAV_ITEM",
        title: "Pembayaran",
        iconClass: "feather icon-monitor",
        link: "/pembayaran",
        children: [],
      },
      {
        menuType: "NAV_ITEM",
        title: "Calon Siswa",
        iconClass: "feather icon-user",
        link: "/calon-siswa",
        children: [],
      },
      {
        menuType: "NAV_HEADER",
        title: "PENDIDIKAN",
        iconClass: "",
      },
      {
        menuType: "NAV_ITEM",
        title: "Master",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Kelas",
            link: "/kelas",
          },
          {
            title: "Mata Pelajaran",
            link: "/mata-pelajaran",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Plot",
        iconClass: "feather icon-user",
        children: [
          {
            title: "Wali Kelas",
            link: "/plot-wali-kelas",
          },
          {
            title: "Guru Kelas",
            link: "/plot-guru-kelas",
          },
          {
            title: "Siswa Kelas",
            link: "/plot-siswa-kelas",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Pengisian",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Absensi",
            link: "/pengisian-absensi",
          },
          {
            title: "Nilai Harian",
            link: "/pengisian-nilai-harian",
          },
          {
            title: "Nilai Akhir",
            link: "/pengisian-nilai-akhir",
          },
          {
            title: "Raport Non Nilai",
            link: "/raport-non-nilai",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Laporan",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Cetak Raport",
            link: "/cetak-raport",
          },
          {
            title: "Blanko Nilai",
            link: "/blanko-nilai",
          },
          {
            title: "Filter Nilai",
            link: "/filter-nilai",
          },
          {
            title: "Ledger Nilai",
            link: "/ledger-nilai",
          },
          {
            title: "Serah Terima",
            link: "/serah-terima",
          },
          {
            title: "Filter Grade",
            link: "/filter-grade",
          },
          {
            title: "Report Input",
            link: "/report-input",
          },
          {
            title: "Report Input Global",
            link: "/report-input-global",
          },
          {
            title: "Data Siswa",
            link: "/",
          },
          {
            title: "Average Nilai",
            link: "/",
          },
          {
            title: "Ledger Kenaikan Kelas",
            link: "/",
          },
          {
            title: "LKK Per Mata Pelajaran",
            link: "/",
          },
        ],
      },
      {
        menuType: "NAV_HEADER",
        title: "PENGASUHAN",
        iconClass: "",
      },
      {
        menuType: "NAV_ITEM",
        title: "Master",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Kamar",
            link: "/kamar",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Plot",
        iconClass: "feather icon-user",
        children: [
          {
            title: "Siswa Kamar",
            link: "/plot-siswa-kamar",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Pengisian",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Absensi",
            link: "/pengisian-absensi-bps",
          },
          {
            title: "Raport",
            link: "/raport-bps",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "Laporan",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Cetak Raport",
            link: "/cetak-raport-bps",
          },
        ],
      },
      {
        menuType: "NAV_HEADER",
        title: "PENGATURAN",
        iconClass: "",
      },
      {
        menuType: "NAV_ITEM",
        title: "Akademik",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Tahun Ajaran",
            link: "/tahun-ajaran",
          },
          {
            title: "Semester",
            link: "/semester",
          },
        ],
      },
      {
        menuType: "NAV_ITEM",
        title: "PPSB",
        iconClass: "feather icon-monitor",
        children: [
          {
            title: "Jadwal Pendaftaran",
            link: "/periode",
          },
          {
            title: "Jenis Biaya",
            link: "/jenis-biaya",
          },
          {
            title: "Biaya",
            link: "/biaya",
          },
          {
            title: "Lokasi Ujian",
            link: "/lokasi-ujian",
          },
        ],
      },
    ];

    return JSON.stringify(menus);
  },

  slugify(str) {
    const slugify = (str || "")
      .toUpperCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "_")
      .replace(/^-+|-+$/g, "");
    return slugify;
  },

  convertDate() {
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateNow = new Date(year, month, day);
    const dateToSend = dateNow.toISOString();

    return dateToSend;
  },

  generateRegNumber(sequence, length = 10) {
    let fmtNumber = "0000000000";
    if (length === 8) {
      fmtNumber = "00000000";
    }

    const strNumber = sequence.toString();

    const regNumber =
      fmtNumber.substring(0, fmtNumber.length - strNumber.length) + strNumber;

    return regNumber;
  },

  generateInvoiceNumber(sequence) {
    const d = new Date();
    function f(n) {
      return n < 10 ? "0" + n : n;
    }

    let fmtNumber = "00000000";
    const strNumber = sequence.toString();
    const seqNumber =
      fmtNumber.substring(0, fmtNumber.length - strNumber.length) + strNumber;

    // var random_num = Math.floor(Math.random() * (99999999999 -  10000000000)) + 10000000000;
    random_num =
      "INV/" +
      d.getFullYear() +
      f(d.getMonth() + 1) +
      f(d.getDate()) +
      "/" +
      f(d.getHours()) +
      f(d.getMinutes()) +
      f(d.getSeconds()) +
      "/" +
      seqNumber;

    return random_num;
  },

  generateBasicAuth(username, password) {
    return Buffer.from(`${username}:${password}`).toString("base64");
    //return btoa(`${username}:${password}`);
  },

  getVAExpiredDate(duration) {
    // just set it in one month
    const date = new Date();

    switch (duration) {
      case "Y":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "M":
        date.setMonth(date.getMonth() + 1);
        break;
      case "H":
        date.setHours(date.getHours() + 24); // 1 day
        break;
      case "N":
        date.setHours(date.getMinutes() + 10); // 10 minutes
        break;
      default:
        break;
    }

    return date;
  },

  getNumOfDaysInMonth(month, year) {
    const idxMonth = parseInt(month) - 1;
    // Create a Moment.js object representing the first day of the specified month and year
    const result = moment({ year, month: idxMonth }).daysInMonth();

    return result;
  },

  getFirstDateBulanan(month, year) {
    const idxMonth = parseInt(month) - 1;
    // Create a Moment.js object representing the first day of the specified month and year
    const firstDateOfMonth = moment({ year, month: idxMonth });

    // Format the result as a string if needed
    const formattedDate = firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss");

    return formattedDate;
  },

  getDayDate(tgl) {
    const dDay = moment(tgl);

    return parseInt(dDay.format("DD"));
  },

  getLastDateBulanan(month, year) {
    // Create a Moment.js object representing the first day of the next month
    const idxMonth = parseInt(month) - 1;

    const firstDayOfNextMonth =
      idxMonth < 11
        ? moment({ year, month: idxMonth + 1, day: 1 })
        : moment({ year, month: idxMonth, day: 31 });

    // Subtract one day to get the last day of the desired month
    const lastDateOfMonth =
      idxMonth < 11
        ? firstDayOfNextMonth.subtract(1, "days")
        : firstDayOfNextMonth;

    // Format the result as a string if needed
    const formattedDate = lastDateOfMonth.format("YYYY-MM-DD HH:mm:ss");

    return formattedDate;
  },

  getExpiredDateBulanan(month, year) {
    const idxMonth = parseInt(month) - 1;
    // Create a Moment.js object representing the first day of the specified month and year
    const firstDateOfMonth = moment({ year, idxMonth, day: 10 });

    // Format the result as a string if needed
    const formattedDate = firstDateOfMonth.format("YYYY-MM-DD HH:mm:ss");

    return formattedDate;
  },

  generateNomorTagihan(sequence) {
    const date = new Date();
    return (
      "TI-" +
      date.getFullYear() +
      date.getMonth() +
      date.getDay() +
      "-" +
      this.generateRegNumber(sequence)
    );
  },

  generateNoInduk(gender, angkatan, sequence) {
    const prefix = process.env.DOMAIN_PREFIX;
    let fmtNumber = "00000";
    const strNumber = sequence.toString();
    const regNumber =
      fmtNumber.substring(0, fmtNumber.length - strNumber.length) + strNumber;

    const kodeGender = gender === "L" ? "1" : "2";
    // const kodeGender = gender === "L" ? "6" : "5";
    const year = angkatan.substring(2, 4);
    return prefix + "." + kodeGender + "." + year + "." + regNumber;
  },

  convertDateWothoutTz(curdate) {
    return moment(curdate, "YYYY-MM-DD HH:mm:ss");
  },

  generateUangPangkalVANumber(noInduk) {
    const noVa = noInduk.substring(2);
    console.log("no VA", noVa);
    return noVa.replace(/\./g, "");
  },
};
