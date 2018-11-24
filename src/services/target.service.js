class TargetService {
  constructor({ models }) {
    this.TargetModel = models.Target;
  }

  create(newTarget) {
    return new this.TargetModel(newTarget).save();
  }

  getById(id) {
    return this.TargetModel.findById(id);
  }

  getByName(name) {
    return this.TargetModel.findOne({ name });
  }
}

module.exports = TargetService;
