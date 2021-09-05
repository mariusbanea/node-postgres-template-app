const read = (req, res) => {};

const ticketExists = (req, res, next) => {};

const update = (req, res) => {};

const create = (req, res) => {};

module.exports = {
  read: [ticketExists, read],
  update: [ticketExists, update],
  create,
};
