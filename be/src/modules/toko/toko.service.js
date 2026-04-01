const prisma = require('../../config/database');

const getToko = async (tokoId) =>
  prisma.toko.findUnique({ where: { id: tokoId } });

const updateToko = async (tokoId, data) =>
  prisma.toko.update({ where: { id: tokoId }, data });

module.exports = { getToko, updateToko };