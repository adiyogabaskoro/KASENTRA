const tokoService = require('./toko.service');

const getToko = async (req, res, next) => {
  try {
    const toko = await tokoService.getToko(req.user.tokoId);
    res.json({ success: true, data: toko });
  } catch (err) { next(err); }
};

const updateToko = async (req, res, next) => {
  try {
    const toko = await tokoService.updateToko(req.user.tokoId, req.body);
    res.json({ success: true, data: toko });
  } catch (err) { next(err); }
};

module.exports = { getToko, updateToko };