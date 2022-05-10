const categories = require("../models/categories.model");
const questions = require("../models/questions.model");
const ValidateCategory = require("../validator/Category");
/* Add categories */
const Add = async (req, res) => {
  const { errors, isValid } = ValidateCategory(req.body);
  try {
    if (!isValid) {
      return res.status(404).json(errors);
    } else {
      await categories.create(req.body)
      .then(async()=>{
        const data = await categories.find()
        res.status(201).json({
          message: "Added with success",
          data
        });
      })
      
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* GetAll categories */
const GetAll = async (req, res) => {
  try {
    const data = await categories.find();
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* GetOne categories */
const GetOne = async (req, res) => {
  try {
    const data = await categories.findOne({ _id: req.params.id });
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* UpdateOne categories */
const UpdateOne = async (req, res) => {
  const { errors, isValid } = ValidateCategory(req.body);
  try {
    if (!isValid) {
      return res.status(404).json(errors);
    } else {
      const data = await categories.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      res.status(201).json({
        message: "Update with success",
        data
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* DeleteOne categories */
const DeleteOne = async (req, res) => {
  try {
    questions.findOne({ category: req.params.id }).then(async(exist) => {
      if (exist) {
        return res
          .status(404)
          .json({
            message:
              "category have more than questions, you can't delete their",
          });
      } else {
        await categories.deleteOne({ _id: req.params.id });
        res.status(201).json({
          message: "deleted with success",
        });
      }
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  Add,
  GetAll,
  GetOne,
  UpdateOne,
  DeleteOne,
};
