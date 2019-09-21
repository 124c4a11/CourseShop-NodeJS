const { Schema, model } = require('mongoose');


const userSchema = new Schema ({
  email: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  cart: {
    items: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        },

        count: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  }
});


userSchema.methods.addToCart = function(course) {
  const items = [ ...this.cart.items ];
  const ndx = items.findIndex((c) => {
    return c.courseId.toString() === course._id.toString();
  });

  if (ndx >= 0) {
    items[ndx].count++
  } else {
    items.push({
      courseId: course._id,
      count: 1
    });
  }

  this.cart = { items };

  return this.save();
};


module.exports = model('User', userSchema);
