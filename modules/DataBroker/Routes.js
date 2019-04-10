const router = require("express").Router();

module.exports = (server) => {
  router.get("/", async (req, res) => {
    server
      .getIdList()
      .then((l) => {
        res.json(l);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

  router.post("/", async (req, res) => {
    server
      .validate(req.body)
      .then((result) => {
        server
          .insert(result)
          .then((saved) => {
            res.json(saved);
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  });

  router.delete("/:modelId", (req, res) => {
    server
      .destroy(req.params.modelId)
      .then(() => {
        res.json({ success: "true", id: req.params.modelId });
      })
      .catch((err) => res.status(500).json(err));
  });
  return router;
};
