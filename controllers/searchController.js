const User = require('../models/User');
const Spam = require('../models/Spam');

exports.search = async (req, res) => {
  const { query } = req.query;
  // console.log(query);

  try {
    if (/^\d+$/.test(query)) {
      const results = await User.findMany({ where: { phone: query } });
      res.json(results);
    } else {
      const results = await User.findMany({
        where: {
          OR: [
            { name: { startsWith: query } },
            { name: { contains: query } },
          ],
        },
        orderBy: { name: 'asc' },
      });
      res.json(results);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markSpam = async (req, res) => {
  const { phone } = req.body;

  try {
    const spam = await Spam.upsert({
      where: { phone },
      update: { count: { increment: 1 } },
      create: { phone, count: 1 },
    });
    res.json(spam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};