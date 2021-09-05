const router = require("express").Router();

//Helper function
const ticketExists = (req, response, next) => {
  const { ticketId } = req.params;
  const knex = req.app.get("db");
  knex
    .table("ticket")
    .where({ id: ticketId })
    .first()
    .then((ticket) => {
      if (ticket) {
        return next();
      }
      next({
        status: 404,
        message: `Ticket id not found: ${ticketId}`,
      });
    });
};

//Routers

router.route("/").post((req, response) => {
  const { employee_id, customer_id, case_start_date, status } = req.body;
  const knex = req.app.get("db");
  knex
    .table("ticket")
    .insert(
      {
        employee_id,
        customer_id,
        case_start_date,
        status,
      },
      ["id"]
    )
    .then((data) => {
      response.status(201).json({ data });
    });
});

router
  .route("/:ticketId")
  .get((req, response) => {
    const { ticketId } = req.params;
    const knex = req.app.get("db");
    return knex
      .select()
      .from("ticket")
      .where("ticket.id", req.params.ticketId)
      .fullOuterJoin("customer", "customer.id", "ticket.customer_id")
      .then((ticket) =>
        ticket ? response.json({ data: ticket }) : response.sendStatus(404)
      )
      .catch((err) => response.sendStatus(500));
  })
  .patch((req, response) => {
    const { ticketId } = req.params;
    const knex = req.app.get("db");
    const { resolution_date } = req.body;

    knex
      .table("ticket")
      .update({ resolution_date }, ["id"])
      .where({ id: ticketId })
      .then((data) => response.json(data))
      .catch((err) => response.sendStatus(500));
  });

module.exports = router;
