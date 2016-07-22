module.exports = {
  port: 3000,
  session: {
    secret: "Dge%%2g8*7gnd0)-",
    key: "sid",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 3600000
    }
  }
};