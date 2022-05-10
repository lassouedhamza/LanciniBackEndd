const mongoose =require( 'mongoose')

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Creator',
    },
  },
  {
    timestamps: true,
  }
)

const projectSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Creator',
    },
   
    creatorname: {
      type: String,
      required: true,
    },
    Position: {
      type: String,
      //required: true,
    },
    email: {
      type: String,
      //required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
     // required: true,
    },
    video: {
      type: String,
     // required: true,
    },
    verification: {
      type: String,
     // required: true,
    },
    category: {
      type: String,
    //  required: true,
    },
    description: {
      type: String,
     // required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
  //    required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
    //  required: true,
      default: 0,
    },
    price: {
      type: Number,
     // required: true,
      default: 0,
    },
    p: {
      type: Number,
    //  required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const project = mongoose.model('project', projectSchema)

module.exports = project